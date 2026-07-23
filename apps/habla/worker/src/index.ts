import Anthropic from '@anthropic-ai/sdk';

/**
 * Habla tutor proxy — a tiny Cloudflare Worker that holds your Anthropic API
 * key server-side and talks to Claude Haiku on the app's behalf. The Habla PWA
 * (static, on GitHub Pages) can't safely hold a key, so it calls this instead.
 *
 * Deploy: see README.md in this folder.
 */

export interface Env {
  /** Required secret: `npx wrangler secret put ANTHROPIC_API_KEY` */
  ANTHROPIC_API_KEY: string;
  /** Optional: lock CORS to your site, e.g. https://tadellsworth.github.io */
  ALLOWED_ORIGIN?: string;
  /** Optional shared secret the app must send (x-habla-token). Set as a secret. */
  ACCESS_TOKEN?: string;
  /** Optional KV namespace for cloud progress backup (see README). */
  HABLA_SYNC?: KVNamespace;
}

// The tutor persona. Speaking-first, beginner-friendly, present-tense leaning.
const SYSTEM = `You are "Profe", a warm, patient Spanish conversation tutor for an English-speaking beginner who is learning to *speak*.

Rules:
- Reply almost entirely in simple Spanish. Prefer the present tense and short sentences (1–3 sentences).
- Always keep the conversation going: end with one simple question.
- If the student makes a mistake, gently fix it FIRST on its own line, starting with "✏️", then continue naturally. Example: "✏️ Mejor: *yo tengo hambre*."
- You may add a tiny English hint in parentheses for a hard word, e.g. "el almuerzo (lunch)".
- Never lecture or send long paragraphs. Match the student's level and keep it encouraging and fun.
- If the student writes in English, answer in easy Spanish and nudge them to try in Spanish.`;

function corsHeaders(env: Env, origin: string | null): Record<string, string> {
  const allow =
    env.ALLOWED_ORIGIN && env.ALLOWED_ORIGIN !== '*' ? env.ALLOWED_ORIGIN : origin || '*';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-habla-token',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(obj: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const headers = corsHeaders(env, origin);

    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (request.method !== 'POST') return json({ error: 'Use POST' }, 405, headers);

    // Optional shared-secret gate (deters casual abuse of the public URL).
    if (env.ACCESS_TOKEN && request.headers.get('x-habla-token') !== env.ACCESS_TOKEN) {
      return json({ error: 'Unauthorized' }, 401, headers);
    }

    // Cloud backup lives under /sync; everything else is the chat tutor.
    if (new URL(request.url).pathname.replace(/\/+$/, '').endsWith('/sync')) {
      return handleSync(request, env, headers);
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Bad JSON' }, 400, headers);
    }

    const raw = Array.isArray(body?.messages) ? body.messages : null;
    if (!raw) return json({ error: 'messages[] required' }, 400, headers);

    // Bound cost: cap history depth and per-message length; the API also needs
    // the first message to be from the user.
    const messages = raw
      .slice(-16)
      .map((m: any) => ({
        role: m?.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: String(m?.content ?? '').slice(0, 800),
      }))
      .filter((m: { content: string }) => m.content.length > 0);
    while (messages.length && messages[0].role !== 'user') messages.shift();
    if (!messages.length) return json({ error: 'no user message' }, 400, headers);

    try {
      const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
      const resp = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 500,
        system: SYSTEM,
        messages,
      });
      const reply = resp.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
        .trim();
      return json({ reply: reply || '…' }, 200, headers);
    } catch (e: any) {
      return json({ error: 'Upstream error', detail: String(e?.message ?? e) }, 502, headers);
    }
  },
};

// --- Cloud progress backup (Cloudflare KV) ---------------------------------
// Stores one JSON blob per user, keyed by a hash of their private backup code.
// No accounts, no PII — the code is the only credential.
async function handleSync(
  request: Request,
  env: Env,
  headers: Record<string, string>
): Promise<Response> {
  if (!env.HABLA_SYNC) return json({ error: 'Backup not enabled on this Worker' }, 501, headers);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Bad JSON' }, 400, headers);
  }

  const action = body?.action;
  const code = String(body?.code ?? '');
  if (code.length < 8) return json({ error: 'Invalid code' }, 400, headers);
  const key = 'st_' + (await sha256hex(code));

  if (action === 'load') {
    const raw = await env.HABLA_SYNC.get(key);
    if (!raw) return json({ ok: false, notFound: true }, 200, headers);
    try {
      const rec = JSON.parse(raw);
      return json({ ok: true, savedAt: rec.savedAt, data: rec.data }, 200, headers);
    } catch {
      return json({ ok: false, notFound: true }, 200, headers);
    }
  }

  if (action === 'save') {
    const data = body?.data;
    if (data == null || typeof data !== 'object') return json({ error: 'data required' }, 400, headers);
    const payload = JSON.stringify({ v: 1, savedAt: Date.now(), data });
    if (payload.length > 512 * 1024) return json({ error: 'Backup too large' }, 413, headers);
    await env.HABLA_SYNC.put(key, payload);
    return json({ ok: true, savedAt: Date.now() }, 200, headers);
  }

  return json({ error: 'Unknown action' }, 400, headers);
}

async function sha256hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
