/* @ds-bundle: {"format":3,"namespace":"ScriptoriaDesignSystem_d07b87","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Divider","sourcePath":"components/core/Divider.jsx"},{"name":"Emblem","sourcePath":"components/core/Emblem.jsx"},{"name":"NavPill","sourcePath":"components/core/NavPill.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"WordChip","sourcePath":"components/core/WordChip.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"8ff9d812c43c","components/core/Button.jsx":"cdf30a795905","components/core/Card.jsx":"19c547fb8481","components/core/Divider.jsx":"489f2b955518","components/core/Emblem.jsx":"b6560ea8a9b3","components/core/NavPill.jsx":"b9fec5c2cc01","components/core/ProgressBar.jsx":"4acea26f9fc5","components/core/SectionHeading.jsx":"a80d9cc4f209","components/core/WordChip.jsx":"2bb3deacd4bb","ui_kits/lingua-latina/LinguaApp.jsx":"4a54912e5ab5","ui_kits/little-missal/MissalApp.jsx":"0067b0671cf9"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ScriptoriaDesignSystem_d07b87 = window.ScriptoriaDesignSystem_d07b87 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — a small rubric pill for difficulty, season, or status.
 * Filled, uppercase Cinzel micro-type. Colors map to the liturgical /
 * progression palette.
 */
function Badge({
  children,
  tone = 'neutral',
  soft = false,
  style,
  ...rest
}) {
  const tones = {
    neutral: 'var(--ink-soft)',
    beginner: 'var(--emerald)',
    intermediate: 'var(--gold-dark)',
    advanced: 'var(--vermillion)',
    feast: 'var(--vermillion)',
    season: 'var(--emerald)',
    lent: 'var(--amethyst)',
    lapis: 'var(--lapis)'
  };
  const c = tones[tone] || tones.neutral;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--sp-1)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 10.5,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    padding: '3px 10px',
    borderRadius: 'var(--r-pill)',
    lineHeight: 1.5,
    ...(soft ? {
      background: 'color-mix(in srgb, ' + c + ' 14%, transparent)',
      color: c,
      border: '1px solid color-mix(in srgb, ' + c + ' 35%, transparent)'
    } : {
      background: c,
      color: 'var(--vellum)'
    })
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — the primary action control.
 * Primary is a lapis gradient with Cinzel uppercase tracking; gilt is the
 * "illuminated" call-to-action; secondary is a lapis outline; ghost is bare
 * gold text. Press sinks 1px (never bounces).
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      minHeight: 40,
      padding: '0 18px',
      fontSize: 13
    },
    md: {
      minHeight: 50,
      padding: '0 28px',
      fontSize: 15
    },
    lg: {
      minHeight: 56,
      padding: '0 36px',
      fontSize: 17
    }
  };
  const base = {
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--sp-2)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    border: 'none',
    borderRadius: 'var(--r-lg)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'transform var(--dur-fast) var(--ease), box-shadow var(--dur) var(--ease), background var(--dur) var(--ease)',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: 'linear-gradient(180deg, var(--lapis) 0%, var(--lapis-deep) 100%)',
      color: 'var(--text-on-ink)',
      boxShadow: 'var(--sh-card)'
    },
    gilt: {
      background: 'radial-gradient(circle at 30% 20%, var(--gold-light), var(--gold) 70%, var(--gold-dark))',
      color: 'var(--lapis-deep)',
      boxShadow: 'var(--sh-gold)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--lapis)',
      border: '2px solid var(--lapis)',
      boxShadow: 'none'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-gilt)',
      letterSpacing: '0.16em',
      boxShadow: 'none'
    }
  };
  const press = e => {
    if (!disabled) e.currentTarget.style.transform = 'translateY(1px)';
  };
  const release = e => {
    e.currentTarget.style.transform = 'translateY(0)';
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseDown: press,
    onMouseUp: release,
    onMouseLeave: release,
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — a leaf of vellum. The default "vellum" register is sharp-cornered
 * (manuscript) with a hairline gilt border and inner highlight; the "app"
 * register is the softer rounded surface of the interactive products; "ink"
 * is a dark lapis panel for headers and rubric callouts.
 */
function Card({
  children,
  variant = 'vellum',
  label,
  title,
  interactive = false,
  onClick,
  style,
  ...rest
}) {
  const variants = {
    vellum: {
      background: 'linear-gradient(180deg, var(--parchment-2) 0%, var(--vellum) 100%)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-leaf)',
      boxShadow: 'var(--sh-vellum)',
      color: 'var(--text-body)'
    },
    app: {
      background: 'var(--surface-card)',
      border: '1px solid var(--line-hair)',
      borderRadius: 'var(--r-md)',
      boxShadow: 'var(--sh-soft)',
      color: 'var(--text-body)'
    },
    ink: {
      background: 'linear-gradient(180deg, var(--lapis) 0%, var(--lapis-deep) 100%)',
      border: 'none',
      borderRadius: 'var(--r-md)',
      boxShadow: 'var(--sh-card)',
      color: 'var(--text-on-ink)'
    }
  };
  const v = variants[variant];
  const base = {
    padding: 'var(--sp-5)',
    position: 'relative',
    transition: 'box-shadow var(--dur) var(--ease), transform var(--dur-fast) var(--ease)',
    cursor: interactive ? 'pointer' : 'default',
    ...v
  };
  const hover = e => {
    if (!interactive) return;
    e.currentTarget.style.boxShadow = 'var(--sh-card)';
    e.currentTarget.style.transform = 'translateY(-2px)';
  };
  const leave = e => {
    if (!interactive) return;
    e.currentTarget.style.boxShadow = v.boxShadow;
    e.currentTarget.style.transform = 'translateY(0)';
  };
  const onInk = variant === 'ink';
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: hover,
    onMouseLeave: leave,
    style: {
      ...base,
      ...style
    }
  }, rest), label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-label)',
      fontWeight: 600,
      letterSpacing: 'var(--tr-label)',
      textTransform: 'uppercase',
      color: onInk ? 'var(--gold-light)' : 'var(--text-gilt)',
      marginBottom: 'var(--sp-2)'
    }
  }, label), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'var(--fs-h3)',
      letterSpacing: '0.04em',
      color: onInk ? 'var(--text-on-ink)' : 'var(--text-title)',
      marginBottom: children ? 'var(--sp-3)' : 0
    }
  }, title), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Divider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Divider — the gilt rule: an ornament glyph flanked by gold gradient lines.
 * The signature section break of the system.
 */
function Divider({
  ornament = '❦',
  flush = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "separator",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--sp-4)',
      color: 'var(--rule-gold)',
      margin: flush ? 0 : 'var(--sp-4) 0',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      maxWidth: '5.5rem',
      height: 1,
      opacity: 0.7,
      background: 'linear-gradient(to right, transparent, var(--gold) 25%, var(--gold) 75%, transparent)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      lineHeight: 1
    }
  }, ornament), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      maxWidth: '5.5rem',
      height: 1,
      opacity: 0.7,
      background: 'linear-gradient(to right, transparent, var(--gold) 25%, var(--gold) 75%, transparent)'
    }
  }));
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Divider.jsx", error: String((e && e.message) || e) }); }

// components/core/Emblem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Emblem — a gilt coin bearing a glyph (the Chi-Rho by default). Used for
 * the app mark, lesson nodes, and unit medallions. State mirrors the lesson
 * path: available/completed gleam gold; locked is sunk parchment; next adds
 * a slow gilt pulse. A completed emblem wears a small emerald check.
 */
function Emblem({
  glyph = '☧',
  size = 80,
  state = 'available',
  style,
  ...rest
}) {
  const gilt = 'radial-gradient(circle at 30% 30%, var(--gold-light), var(--gold) 70%, var(--gold-dark))';
  const states = {
    available: {
      background: gilt,
      color: 'var(--lapis)',
      boxShadow: 'var(--sh-gold), var(--sh-emboss)',
      border: '3px solid var(--parchment)'
    },
    completed: {
      background: gilt,
      color: 'var(--lapis)',
      boxShadow: 'var(--sh-gold), var(--sh-emboss)',
      border: '3px solid var(--parchment)'
    },
    next: {
      background: gilt,
      color: 'var(--lapis)',
      border: '3px solid var(--parchment)',
      animation: 'scriptoria-glow 2.5s var(--ease) infinite'
    },
    locked: {
      background: 'linear-gradient(180deg, var(--parchment-2), var(--parchment-3))',
      color: 'var(--ink-faint)',
      boxShadow: 'var(--sh-soft)',
      border: '2px solid var(--parchment-3)'
    },
    plain: {
      background: gilt,
      color: 'var(--lapis)',
      boxShadow: 'var(--sh-gold)'
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      width: size,
      height: size,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: Math.round(size * 0.46),
      lineHeight: 1,
      ...states[state]
    }
  }, state === 'locked' ? '\u{1F512}' : glyph), state === 'completed' && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: -6,
      right: -6,
      width: size * 0.36,
      height: size * 0.36,
      background: 'var(--emerald)',
      color: 'var(--vellum)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '3px solid var(--parchment)',
      boxShadow: 'var(--sh-soft)',
      fontFamily: 'var(--font-ui)',
      fontWeight: 700,
      fontSize: size * 0.2
    }
  }, "\u2713"));
}
Object.assign(__ds_scope, { Emblem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Emblem.jsx", error: String((e && e.message) || e) }); }

// components/core/NavPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * NavPill — a toggle / filter / nav button. Inactive is a tracked outline;
 * active fills (lapis by default, gold optional) with vellum text. Hover on
 * inactive washes the gilt tint. Used for day-tabs, filters, and segmented nav.
 */
function NavPill({
  children,
  active = false,
  tone = 'lapis',
  onClick,
  disabled = false,
  style,
  ...rest
}) {
  const fill = tone === 'gold' ? 'var(--gold)' : 'var(--lapis)';
  const base = {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    padding: '8px 16px',
    minHeight: 40,
    borderRadius: 'var(--r-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.3 : 1,
    transition: 'all var(--dur) var(--ease)',
    border: '1px solid var(--line-strong)',
    background: active ? fill : 'transparent',
    color: active ? 'var(--vellum)' : 'var(--text-muted)',
    borderColor: active ? fill : 'var(--line-strong)'
  };
  const enter = e => {
    if (!active && !disabled) e.currentTarget.style.background = 'var(--gold-08)';
  };
  const leave = e => {
    if (!active) e.currentTarget.style.background = 'transparent';
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    disabled: disabled,
    onMouseEnter: enter,
    onMouseLeave: leave,
    style: {
      ...base,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { NavPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/NavPill.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProgressBar — a slim gilt fill on a sunk track. For lesson mastery,
 * daily goals, and unit completion.
 */
function ProgressBar({
  value = 0,
  max = 100,
  height = 5,
  label,
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...style
    }
  }, rest), label && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 'var(--sp-2)',
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      color: 'var(--text-muted)',
      letterSpacing: '0.04em'
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--text-gilt)'
    }
  }, Math.round(pct), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      borderRadius: 'var(--r-pill)',
      overflow: 'hidden',
      background: 'var(--gold-12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: pct + '%',
      borderRadius: 'var(--r-pill)',
      background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SectionHeading — the centered title block: gilt eyebrow, Cinzel title,
 * a gilt rule, and an optional italic lead. The standard way a screen or
 * section opens in this system.
 */
function SectionHeading({
  eyebrow,
  title,
  lead,
  ornament = '❦',
  align = 'center',
  style,
  ...rest
}) {
  const centered = align === 'center';
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      textAlign: align,
      ...style
    }
  }, rest), eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-label)',
      fontWeight: 600,
      letterSpacing: 'var(--tr-label)',
      textTransform: 'uppercase',
      color: 'var(--text-gilt)',
      marginBottom: 'var(--sp-2)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--fs-h2)',
      letterSpacing: '0.05em',
      color: 'var(--text-title)',
      lineHeight: 'var(--lh-tight)'
    }
  }, title), ornament && /*#__PURE__*/React.createElement(__ds_scope.Divider, {
    ornament: ornament,
    style: {
      justifyContent: centered ? 'center' : 'flex-start',
      margin: 'var(--sp-3) 0 var(--sp-2)'
    }
  }), lead && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontStyle: 'italic',
      fontSize: 'var(--fs-lead)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--lh-snug)',
      maxWidth: centered ? '46ch' : undefined,
      marginLeft: centered ? 'auto' : 0,
      marginRight: centered ? 'auto' : 0
    }
  }, lead));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/WordChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * WordChip — an interactive Latin word with a dotted-gold underline,
 * inviting a tap for its gloss. The signature of the Latin reader: prayers
 * and verses are woven from these. Hover/active wash the gilt tint.
 */
function WordChip({
  children,
  active = false,
  onClick,
  style,
  ...rest
}) {
  const enter = e => {
    e.currentTarget.style.background = 'var(--gold-12)';
  };
  const leave = e => {
    if (!active) e.currentTarget.style.background = 'transparent';
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: onClick,
    onMouseEnter: enter,
    onMouseLeave: leave,
    style: {
      cursor: 'pointer',
      borderBottom: '1px dotted var(--gold)',
      background: active ? 'var(--gold-12)' : 'transparent',
      borderRadius: 3,
      padding: '1px 2px',
      transition: 'background var(--dur-fast) var(--ease)',
      color: 'inherit',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { WordChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/WordChip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/lingua-latina/LinguaApp.jsx
try { (() => {
/* LinguaApp — recreation of "Lingua Latina Ecclesiastica", the Ecclesiastical
   Latin learner. A home screen: progress, a serpentine lesson path of gilt
   Emblems, and a deck of flip flashcards. Composes Scriptoria primitives. */
(function () {
  const NS = window.ScriptoriaDesignSystem_d07b87;
  const {
    Emblem,
    Divider,
    Badge,
    NavPill,
    ProgressBar
  } = NS;
  const {
    useState
  } = React;
  const LESSONS = [{
    n: 'I',
    title: 'First Words',
    state: 'completed',
    off: 'C'
  }, {
    n: 'II',
    title: 'The Sign',
    state: 'completed',
    off: 'R1'
  }, {
    n: 'III',
    title: 'Pater Noster',
    state: 'next',
    off: 'L1'
  }, {
    n: 'IV',
    title: 'Ave Maria',
    state: 'locked',
    off: 'C'
  }, {
    n: 'V',
    title: 'Gloria Patri',
    state: 'locked',
    off: 'R1'
  }];
  const VOCAB = [{
    latin: 'Pater',
    en: 'Father',
    pron: 'PAH-ter',
    cat: 'Noun'
  }, {
    latin: 'caelum',
    en: 'heaven',
    pron: 'CHAY-lum',
    cat: 'Noun'
  }, {
    latin: 'sanctus',
    en: 'holy',
    pron: 'SANK-tus',
    cat: 'Adjective'
  }, {
    latin: 'oremus',
    en: 'let us pray',
    pron: 'oh-RAY-mus',
    cat: 'Verb'
  }, {
    latin: 'gratia',
    en: 'grace',
    pron: 'GRAH-tsee-ah',
    cat: 'Noun'
  }, {
    latin: 'Dominus',
    en: 'Lord',
    pron: 'DOH-mee-nus',
    cat: 'Noun'
  }];
  const CATS = ['All', 'Noun', 'Verb', 'Adjective'];
  function LinguaApp() {
    const [filter, setFilter] = useState('All');
    const [flipped, setFlipped] = useState({});
    const [learned, setLearned] = useState({});
    const cards = VOCAB.filter(v => filter === 'All' || v.cat === filter);
    const learnedCount = Object.values(learned).filter(Boolean).length;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: '100%',
        background: 'var(--tex-parchment), var(--bg-page)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 760,
        margin: '0 auto',
        padding: '28px 22px 56px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 22,
        fontFamily: 'var(--font-ui)'
      }
    }, /*#__PURE__*/React.createElement(Stat, {
      icon: "\u2726",
      tint: "var(--vermillion)",
      value: "7",
      label: "Streak"
    }), /*#__PURE__*/React.createElement(Stat, {
      icon: "\u2766",
      tint: "var(--gold-dark)",
      value: "240",
      label: "Words"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 16,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--lapis)'
      }
    }, "Lingua Latina")), /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'linear-gradient(180deg, var(--lapis) 0%, var(--lapis-deep) 100%)',
        borderRadius: 'var(--r-md)',
        padding: '18px 22px',
        margin: '20px 0 8px',
        color: 'var(--text-on-ink)',
        boxShadow: 'var(--sh-card)',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 11,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--gold-light)'
      }
    }, "Unit I"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: '0.05em',
        margin: '2px 0 4px'
      }
    }, "The Words of Prayer"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontStyle: 'italic',
        fontSize: 16,
        opacity: 0.85,
        marginBottom: 12
      }
    }, "Orationis Verba"), /*#__PURE__*/React.createElement(ProgressBar, {
      value: 2,
      max: 5,
      style: {
        maxWidth: 320,
        margin: '0 auto'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 0 6px'
      }
    }, LESSONS.map((l, k) => /*#__PURE__*/React.createElement("div", {
      key: k
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 0',
        ...offset(l.off)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Emblem, {
      glyph: l.n,
      size: 72,
      state: l.state
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.06em',
        color: l.state === 'locked' ? 'var(--ink-faint)' : 'var(--lapis)',
        marginTop: 12,
        textAlign: 'center'
      }
    }, l.title))), k < LESSONS.length - 1 && /*#__PURE__*/React.createElement(Connector, null)))), /*#__PURE__*/React.createElement(Divider, {
      ornament: "\u2766",
      style: {
        margin: '8px 0 18px'
      }
    }), /*#__PURE__*/React.createElement("header", {
      style: {
        textAlign: 'center',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--gold-dark)'
      }
    }, "Review"), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: '4px 0 0',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 24,
        letterSpacing: '0.04em',
        color: 'var(--lapis)'
      }
    }, "Vocabulary"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '6px 0 0',
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        color: 'var(--text-muted)'
      }
    }, learnedCount, " of ", VOCAB.length, " marked learned \xB7 tap a card to flip")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        gap: 6,
        flexWrap: 'wrap',
        marginBottom: 18
      }
    }, CATS.map(c => /*#__PURE__*/React.createElement(NavPill, {
      key: c,
      active: filter === c,
      onClick: () => setFilter(c)
    }, c))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 14
      }
    }, cards.map(v => {
      const isF = !!flipped[v.latin];
      const isL = !!learned[v.latin];
      return /*#__PURE__*/React.createElement("div", {
        key: v.latin,
        onClick: () => setFlipped({
          ...flipped,
          [v.latin]: !isF
        }),
        style: {
          height: 168,
          cursor: 'pointer',
          perspective: 800
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform var(--dur-slow) var(--ease)',
          transformStyle: 'preserve-3d',
          transform: isF ? 'rotateY(180deg)' : 'none'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          ...face(),
          background: 'linear-gradient(180deg, var(--parchment-2), var(--vellum))',
          border: '1px solid var(--line)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold-dark)'
        }
      }, v.cat), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 30,
          color: 'var(--lapis)',
          marginTop: 6
        }
      }, v.latin), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 14,
          color: 'var(--ink-soft)',
          marginTop: 2
        }
      }, v.pron), isL && /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 8
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: "beginner"
      }, "\u2713 Learned"))), /*#__PURE__*/React.createElement("div", {
        style: {
          ...face(),
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(180deg, var(--lapis) 0%, var(--lapis-deep) 100%)',
          color: 'var(--vellum)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 26,
          color: 'var(--vellum)'
        }
      }, v.en), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 14,
          color: 'var(--gold-light)',
          marginTop: 4
        }
      }, v.latin), /*#__PURE__*/React.createElement("button", {
        onClick: e => {
          e.stopPropagation();
          setLearned({
            ...learned,
            [v.latin]: !isL
          });
        },
        style: {
          marginTop: 12,
          padding: '5px 14px',
          borderRadius: 'var(--r-pill)',
          border: '1px solid ' + (isL ? 'var(--emerald)' : 'var(--gold-30)'),
          background: isL ? 'var(--emerald)' : 'transparent',
          color: isL ? 'var(--vellum)' : 'var(--gold-light)',
          fontFamily: 'var(--font-ui)',
          fontSize: 11.5,
          letterSpacing: '0.06em',
          cursor: 'pointer'
        }
      }, isL ? '✓ Learned' : 'Mark learned'))));
    }))));
  }
  function Stat({
    icon,
    tint,
    value,
    label
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: tint,
        fontSize: 18,
        fontFamily: 'var(--font-display)'
      }
    }, icon), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        color: 'var(--lapis)',
        fontSize: 18
      }
    }, value), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)'
      }
    }, label));
  }
  function Connector() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        gap: 5,
        height: 18
      }
    }, [0, 1, 2].map(d => /*#__PURE__*/React.createElement("span", {
      key: d,
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'var(--gold-30)'
      }
    })));
  }
  function offset(o) {
    const map = {
      L1: {
        paddingRight: 90
      },
      L2: {
        paddingRight: 160
      },
      C: {},
      R1: {
        paddingLeft: 90
      },
      R2: {
        paddingLeft: 160
      }
    };
    return map[o] || {};
  }
  function face() {
    return {
      position: 'absolute',
      inset: 0,
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      borderRadius: 'var(--r-md)',
      boxShadow: 'var(--sh-soft)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 14,
      textAlign: 'center'
    };
  }
  window.LinguaApp = LinguaApp;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/lingua-latina/LinguaApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/little-missal/MissalApp.jsx
try { (() => {
/* MissalApp — a faithful recreation of "The Little Missal" daily devotional.
   Composes Scriptoria primitives (Emblem, Divider, Badge, NavPill, WordChip,
   Button) over a vellum ground. Browse days; tap a Latin word for its gloss. */
(function () {
  const NS = window.ScriptoriaDesignSystem_d07b87;
  const {
    Emblem,
    Divider,
    Badge,
    NavPill,
    WordChip,
    Button
  } = NS;
  const {
    useState
  } = React;

  // A short run of real liturgical entries (Ordinary Time, 2026).
  const DAYS = [{
    date: 'Sunday, May 31, 2026',
    day: 'The Most Holy Trinity',
    tone: 'feast',
    gospel: 'John 16:12–15',
    theme: 'God is three Persons in one God: the Father, the Son, and the Holy Spirit. They love each other perfectly — and they invite us into that same love.',
    question: 'When you make the Sign of the Cross, what does each part mean to you?',
    prayer: ['Holy Trinity', '— Father, Son, and Holy Spirit —', 'I love you. Thank you for letting me share in your love. Help me grow in faith every day.'],
    latin: {
      In: 'in',
      nomine: 'the name',
      Patris: 'of the Father',
      et: 'and',
      Filii: 'of the Son',
      Spiritus: 'of the Spirit',
      Sancti: 'Holy'
    },
    verse: [['In', 'In'], ['nomine', 'nómine'], ['Patris', 'Patris'], ['et', 'et'], ['Filii', 'Fílii'], ['et', 'et'], ['Spiritus', 'Spíritus'], ['Sancti', 'Sancti']]
  }, {
    date: 'Monday, June 1, 2026',
    day: 'St. Justin · Martyr',
    tone: 'advanced',
    gospel: 'Mark 12:1–12',
    theme: 'Jesus is the special stone that holds everything together, even though some people did not believe in him. He is the strong center of our faith.',
    question: 'How do you think Jesus holds your family together?',
    prayer: ['Jesus, my cornerstone,', 'be the center of my home.', 'Hold us together in your love, today and always.'],
    latin: {
      Lapidem: 'the stone',
      quem: 'which',
      reprobaverunt: 'rejected',
      aedificantes: 'the builders'
    },
    verse: [['Lapidem', 'Lápidem'], ['quem', 'quem'], ['reprobaverunt', 'reprobavérunt'], ['aedificantes', 'aedificántes']]
  }, {
    date: 'Tuesday, June 2, 2026',
    day: 'Tuesday · 9th Week in Ordinary Time',
    tone: 'season',
    gospel: 'Mark 12:13–17',
    theme: 'Jesus tells us to give to God what belongs to God. Our whole hearts belong to him, because he made us and loves us.',
    question: 'What is one gift you can give back to God today — a prayer, a kindness, a thank-you?',
    prayer: ['Lord, all that I am is yours.', 'I give you my heart this morning.', 'Use it to love the people around me.'],
    latin: {
      Reddite: 'render',
      quae: 'the things',
      sunt: 'that are',
      Dei: "God's",
      Deo: 'to God'
    },
    verse: [['Reddite', 'Réddite'], ['quae', 'quae'], ['sunt', 'sunt'], ['Dei', 'Dei'], ['Deo', 'Deo']]
  }];
  function MissalApp() {
    const [i, setI] = useState(0);
    const [gloss, setGloss] = useState(null); // {latin, en}
    const d = DAYS[i];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: '100%',
        background: 'var(--tex-vellum), var(--bg-page)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 600,
        margin: '0 auto',
        padding: '40px 22px 48px',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("header", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 44,
        color: 'var(--gold)',
        lineHeight: 1
      }
    }, "\u2627"), /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: '8px 0 0',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 19,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--lapis)'
      }
    }, "The Little Missal"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '10px 0 2px',
        fontFamily: 'var(--font-body)',
        fontStyle: 'italic',
        fontSize: 19,
        color: 'var(--ink-soft)'
      }
    }, d.date), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--gold-dark)',
        marginTop: 6
      }
    }, d.day)), /*#__PURE__*/React.createElement(Divider, {
      style: {
        margin: '20px 0 6px'
      }
    }), /*#__PURE__*/React.createElement("main", {
      key: i,
      style: {
        animation: 'scriptoria-rise var(--dur-slow) var(--ease-out) both'
      }
    }, /*#__PURE__*/React.createElement("section", {
      style: card()
    }, /*#__PURE__*/React.createElement("div", {
      style: rowBetween()
    }, /*#__PURE__*/React.createElement("span", {
      style: label()
    }, "Gospel"), /*#__PURE__*/React.createElement(Badge, {
      tone: d.tone,
      soft: true
    }, d.tone === 'feast' ? 'Feast' : d.tone === 'advanced' ? 'Memorial' : 'Ordinary Time')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 22,
        fontWeight: 600,
        color: 'var(--lapis)',
        letterSpacing: '0.03em',
        marginTop: 6
      }
    }, d.gospel), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '12px 0 0',
        fontSize: 'var(--fs-lead)',
        lineHeight: 1.6,
        color: 'var(--text-body)'
      }
    }, d.theme)), /*#__PURE__*/React.createElement("section", {
      style: card()
    }, /*#__PURE__*/React.createElement("span", {
      style: label()
    }, "To Ponder"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '8px 0 0',
        fontFamily: 'var(--font-body)',
        fontStyle: 'italic',
        fontSize: 'var(--fs-lead)',
        color: 'var(--ink-soft)'
      }
    }, d.question)), /*#__PURE__*/React.createElement("section", {
      style: {
        ...card(),
        background: 'linear-gradient(180deg, var(--lapis) 0%, var(--lapis-deep) 100%)',
        border: 'none',
        color: 'var(--text-on-ink)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...label(),
        color: 'var(--gold-light)'
      }
    }, "Today's Latin"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '10px 0 0',
        fontSize: 22,
        lineHeight: 1.9,
        letterSpacing: '0.01em'
      }
    }, d.verse.map(([key, disp], k) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: k
    }, /*#__PURE__*/React.createElement(WordChip, {
      active: gloss && gloss.k === k,
      onClick: () => setGloss({
        k,
        latin: disp,
        en: d.latin[key]
      }),
      style: {
        borderBottomColor: 'var(--gold-light)',
        color: 'var(--vellum)'
      }
    }, disp), ' '))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        fontFamily: 'var(--font-ui)',
        fontSize: 12.5,
        color: 'rgba(255,255,255,0.65)',
        letterSpacing: '0.03em',
        minHeight: 18
      }
    }, gloss ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--gold-light)',
        fontWeight: 600
      }
    }, gloss.latin), " \u2014 ", gloss.en) : 'Tap a word to see what it means.')), /*#__PURE__*/React.createElement("section", {
      style: {
        ...card(),
        background: 'var(--gold-08)',
        borderLeft: '3px solid var(--gold)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: label()
    }, "Morning Prayer"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10
      }
    }, d.prayer.map((line, k) => /*#__PURE__*/React.createElement("p", {
      key: k,
      style: {
        margin: '0 0 2px',
        fontFamily: 'var(--font-body)',
        fontSize: 20,
        lineHeight: 1.7,
        color: 'var(--text-body)',
        fontStyle: k === 1 ? 'italic' : 'normal',
        color: k === 1 ? 'var(--ink-soft)' : 'var(--text-body)'
      }
    }, line)), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '10px 0 0',
        fontFamily: 'var(--font-display)',
        fontSize: 13,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--gold-dark)'
      }
    }, "Amen \u2720")))), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        marginTop: 24,
        paddingTop: 18,
        borderTop: '1px solid var(--line-hair)'
      }
    }, /*#__PURE__*/React.createElement(NavPill, {
      disabled: i === 0,
      onClick: () => {
        setGloss(null);
        setI(Math.max(0, i - 1));
      }
    }, "\u2190 Prev"), /*#__PURE__*/React.createElement(NavPill, {
      active: true,
      onClick: () => {
        setGloss(null);
        setI(0);
      }
    }, "Today"), /*#__PURE__*/React.createElement(NavPill, {
      disabled: i === DAYS.length - 1,
      onClick: () => {
        setGloss(null);
        setI(Math.min(DAYS.length - 1, i + 1));
      }
    }, "Next \u2192"))));
  }
  function card() {
    return {
      background: 'linear-gradient(180deg, var(--parchment-2) 0%, var(--vellum) 100%)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-leaf)',
      padding: '20px 22px',
      margin: '14px 0',
      boxShadow: 'var(--sh-vellum)'
    };
  }
  function label() {
    return {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--gold-dark)'
    };
  }
  function rowBetween() {
    return {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    };
  }
  window.MissalApp = MissalApp;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/little-missal/MissalApp.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.Emblem = __ds_scope.Emblem;

__ds_ns.NavPill = __ds_scope.NavPill;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.WordChip = __ds_scope.WordChip;

})();
