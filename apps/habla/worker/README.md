# Habla tutor proxy (Cloudflare Worker)

Habla is a static site on GitHub Pages, so it **can't safely hold an API key** —
anything shipped to the browser is visible in "view source." This little Worker
holds your Anthropic API key server-side and relays chat to **Claude Haiku**
(`claude-haiku-4-5`), which is very cheap (~$1 / $5 per million input/output
tokens — pennies per practice session).

You deploy this once, paste its URL into Habla's **Converse → ⚙️ settings**, and
you're done.

## What you need

- A free [Cloudflare account](https://dash.cloudflare.com/sign-up).
- An **Anthropic API key** from <https://console.anthropic.com> (this is the
  pay-as-you-go API — separate from a Claude.ai subscription). Set a low monthly
  **spend limit** on the key so there are no surprises.
- Node.js 18+ installed locally.

## Deploy (about 5 minutes)

```bash
cd apps/habla/worker
npm install

# one-time login to Cloudflare
npx wrangler login

# store your Anthropic key as an encrypted secret (never committed)
npx wrangler secret put ANTHROPIC_API_KEY
# (optional) require a shared password so randoms can't use your URL:
npx wrangler secret put ACCESS_TOKEN

npx wrangler deploy
```

`wrangler deploy` prints a URL like
`https://habla-tutor.<your-subdomain>.workers.dev`. That's your endpoint.

## Connect it to Habla

1. Open Habla → **Speak** tab → **Converse with a tutor** → tap the **⚙️** gear.
2. Paste the Worker URL. If you set an `ACCESS_TOKEN`, paste it too.
3. Save. Start chatting — the tutor replies in simple Spanish and gently
   corrects you.

## Lock it down (recommended)

- **Restrict the origin.** In `wrangler.toml`, uncomment `ALLOWED_ORIGIN` and set
  it to `https://tadellsworth.github.io`, then redeploy. Browsers on other sites
  then can't call your Worker.
- **Set `ACCESS_TOKEN`** (above) so the URL alone isn't enough to use it.
- **Cap spend** on the Anthropic key. Cost stays in the low single-dollars/month
  even with daily use, but a hard cap means zero risk.

## Cost & privacy

Each turn sends only the recent conversation (capped at 16 messages, 800 chars
each) plus a short tutor prompt, and caps the reply at 500 tokens. Your chat text
goes **from your browser → your Worker → Anthropic** and back; nothing is stored.

## Local test

```bash
npx wrangler dev            # runs the Worker locally
# then point Habla's Converse URL at the printed http://localhost:8787
```
