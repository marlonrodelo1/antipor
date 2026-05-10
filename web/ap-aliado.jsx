// Aliado avatar — abstract organic shape with 3 states.
// state: 'rest' | 'listening' | 'speaking'
// size: pixel diameter

function Aliado({ size = 80, state = 'rest', tone = 'warm', noAnim = false }) {
  // Hue maps to context. warm = intervention, cool = calm/home, sage = chat
  const palettes = {
    warm:  { a: '#E8B96A', b: '#D97757', c: '#F2D7B0' },
    cool:  { a: '#A4C0DD', b: '#3B6EA8', c: '#D6E2EF' },
    sage:  { a: '#B8CFB8', b: '#7BA888', c: '#DCE9DC' },
    night: { a: '#3B6EA8', b: '#1F3A5C', c: '#5B86B6' },
  };
  const p = palettes[tone] || palettes.cool;
  const id = React.useId();
  const dur = state === 'speaking' ? 1.2 : state === 'listening' ? 2.0 : 6.0;
  const ringScale = state === 'speaking' ? 1.18 : state === 'listening' ? 1.08 : 1.04;

  // unique animation keyframes per instance to avoid conflicts
  React.useEffect(() => {
    if (noAnim) return;
    const styleId = `al-${id}`;
    if (document.getElementById(styleId)) return;
    const s = document.createElement('style');
    s.id = styleId;
    s.textContent = `
      @keyframes al-breathe-${id} { 0%,100%{transform:scale(1)} 50%{transform:scale(${ringScale})} }
      @keyframes al-shimmer-${id} { 0%,100%{opacity:.7} 50%{opacity:1} }
      @keyframes al-ripple-${id} { 0%{transform:scale(.85);opacity:.55} 100%{transform:scale(1.7);opacity:0} }
    `;
    document.head.appendChild(s);
    return () => s.remove();
  }, [id, ringScale, noAnim]);

  const breatheStyle = noAnim ? {} : { animation: `al-breathe-${id} ${dur}s ease-in-out infinite` };
  const shimmerStyle = noAnim ? {} : { animation: `al-shimmer-${id} ${dur*0.8}s ease-in-out infinite` };
  const rippleStyle  = noAnim ? {} : { animation: `al-ripple-${id} 2.4s ease-out infinite` };

  return (
    <div style={{
      width: size, height: size, position: 'relative',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* outer glow / listening ripple */}
      {state === 'listening' && !noAnim && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: `radial-gradient(circle, ${p.a}40 0%, transparent 70%)`,
          ...rippleStyle,
        }} />
      )}

      {/* breathing core */}
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        ...breatheStyle, transformOrigin: '50% 50%',
      }}>
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
          <defs>
            <radialGradient id={`g1-${id}`} cx="38%" cy="35%" r="70%">
              <stop offset="0%" stopColor={p.c} stopOpacity="1"/>
              <stop offset="55%" stopColor={p.a} stopOpacity="1"/>
              <stop offset="100%" stopColor={p.b} stopOpacity="1"/>
            </radialGradient>
            <radialGradient id={`g2-${id}`} cx="30%" cy="28%" r="40%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
            </radialGradient>
          </defs>
          {/* organic blob — slightly off-circle to feel hand-drawn */}
          <path
            d="M50 6 C70 6, 92 22, 94 46 C96 70, 78 94, 52 94 C26 94, 6 76, 6 50 C6 24, 28 6, 50 6 Z"
            fill={`url(#g1-${id})`}
          />
          <path
            d="M50 6 C70 6, 92 22, 94 46 C96 70, 78 94, 52 94 C26 94, 6 76, 6 50 C6 24, 28 6, 50 6 Z"
            fill={`url(#g2-${id})`}
          />
          {/* speaking pulse — small inner dot */}
          {state === 'speaking' && (
            <circle cx="50" cy="50" r="6" fill="#fff" opacity="0.55" style={shimmerStyle} />
          )}
        </svg>
      </div>
    </div>
  );
}

window.Aliado = Aliado;
