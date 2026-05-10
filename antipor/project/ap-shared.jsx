// Shared primitives: tab bar, buttons, cards, color tokens.

const T = {
  primary: '#3B6EA8',
  primaryDeep: '#2C5485',
  secondary: '#7BA888',
  accent: '#E8B96A',
  warm: '#D97757',
  warmSoft: '#EFC9B6',
  warmBg: '#F5E5DC',
  bg: '#F7F5F2',
  surface: '#FFFFFF',
  ink: '#1C2128',
  ink2: '#3F4854',
  ink3: '#6B7280',
  hairline: 'rgba(28,33,40,0.08)',
  hairlineStrong: 'rgba(28,33,40,0.14)',
  dkBg: '#0F1419',
  dkSurface: '#1C2128',
  dkSurface2: '#242A33',
  dkInk: '#E8E6E3',
  dkInk2: '#A6ADB7',
  dkHairline: 'rgba(255,255,255,0.08)',
};

// Primary CTA — earthy amber / warm. variant: primary, secondary, ghost, warm
function APButton({ children, variant = 'primary', size = 'md', leftIcon, rightIcon, full, dark, style = {}, onClick }) {
  const palettes = {
    primary: { bg: T.primary, fg: '#fff', border: T.primary },
    secondary: { bg: 'transparent', fg: T.primary, border: T.hairlineStrong },
    accent:  { bg: T.accent, fg: '#3B2A0F', border: T.accent },
    warm:    { bg: T.warm,   fg: '#fff', border: T.warm },
    ghost:   { bg: 'transparent', fg: dark ? T.dkInk2 : T.ink2, border: 'transparent' },
    dark:    { bg: T.ink, fg: '#fff', border: T.ink },
    onWarm:  { bg: '#fff', fg: T.warm, border: '#fff' },
    onWarmGhost: { bg: 'transparent', fg: '#fff', border: 'rgba(255,255,255,0.45)' },
  };
  const sz = {
    sm: { h: 36, px: 14, fs: 14, gap: 8 },
    md: { h: 48, px: 18, fs: 15, gap: 10 },
    lg: { h: 56, px: 22, fs: 16, gap: 12 },
    xl: { h: 64, px: 26, fs: 17, gap: 12 },
  }[size];
  const p = palettes[variant];
  return (
    <button onClick={onClick} style={{
      height: sz.h, padding: `0 ${sz.px}px`, gap: sz.gap, fontSize: sz.fs,
      fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: -0.1,
      background: p.bg, color: p.fg, border: `1px solid ${p.border}`,
      borderRadius: sz.h/2, cursor: 'pointer', width: full ? '100%' : undefined,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      ...style,
    }}>
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}

// Bottom tab bar
function APTabBar({ active = 'home', dark = false }) {
  const items = [
    { id: 'home',     label: 'Hoy',     icon: I.home },
    { id: 'journal',  label: 'Diario',  icon: I.book },
    { id: 'aliado',   label: 'Aliado',  icon: I.message },
    { id: 'settings', label: 'Ajustes', icon: I.settings },
  ];
  const bg = dark ? 'rgba(15,20,25,0.92)' : 'rgba(255,255,255,0.92)';
  const ink = dark ? T.dkInk : T.ink;
  const muted = dark ? T.dkInk2 : T.ink3;
  const border = dark ? T.dkHairline : T.hairline;
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 30, paddingTop: 10,
      background: bg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${border}`,
      display: 'flex', justifyContent: 'space-around',
    }}>
      {items.map(it => {
        const on = active === it.id;
        return (
          <div key={it.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: on ? T.primary : muted,
          }}>
            <it.icon size={24} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.1 }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Pill / chip
function APPill({ children, selected, dark, leftIcon, style = {}, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 16px', fontSize: 14, fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      borderRadius: 999, cursor: 'pointer',
      border: `1px solid ${selected ? T.primary : (dark ? T.dkHairline : T.hairline)}`,
      background: selected ? `${T.primary}14` : (dark ? T.dkSurface2 : '#fff'),
      color: selected ? T.primary : (dark ? T.dkInk : T.ink),
      display: 'inline-flex', alignItems: 'center', gap: 6,
      ...style,
    }}>
      {leftIcon}
      {children}
    </button>
  );
}

// Soft card
function APCard({ children, dark, style = {}, padding = 20, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: dark ? T.dkSurface : '#fff',
      borderRadius: 20, padding,
      border: `1px solid ${dark ? T.dkHairline : T.hairline}`,
      ...style,
    }}>{children}</div>
  );
}

// Section header inside an iOS list view
function APSectionLabel({ children, dark }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 600, letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: dark ? T.dkInk2 : T.ink3,
      padding: '4px 4px 8px',
    }}>{children}</div>
  );
}

// Wordmark — Antiport. Fraunces, low-key dot under the 'i'.
function APWordmark({ size = 28, color = T.ink, dark }) {
  return (
    <span style={{
      fontFamily: 'Fraunces, serif', fontWeight: 600,
      fontSize: size, letterSpacing: -0.02 * size,
      color: dark ? T.dkInk : color,
      display: 'inline-flex', alignItems: 'center', gap: size * 0.18,
    }}>
      <span style={{
        width: size * 0.32, height: size * 0.32, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, ${T.accent}, ${T.warm})`,
        display: 'inline-block',
      }} />
      Antiport
    </span>
  );
}

window.T = T;
window.APButton = APButton;
window.APTabBar = APTabBar;
window.APPill = APPill;
window.APCard = APCard;
window.APSectionLabel = APSectionLabel;
window.APWordmark = APWordmark;
