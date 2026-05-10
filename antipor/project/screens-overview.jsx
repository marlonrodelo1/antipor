// Overview cards: cover, palette, Aliado 3 states.
const { T, APWordmark, Aliado, I } = window;

function CoverCard() {
  return (
    <div className="ap" style={{
      width: '100%', height: '100%',
      background: `linear-gradient(135deg, ${T.warmBg} 0%, #F7F5F2 60%, #EAF1F8 100%)`,
      padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <APWordmark size={32} />
        <span style={{ fontSize: 13, color: T.ink3, padding: '4px 10px', border: `1px solid ${T.hairline}`, borderRadius: 99 }}>
          Hi-fi · v1
        </span>
      </div>

      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div className="ap-h1" style={{ fontSize: 56, lineHeight: 1.05, color: T.ink, marginBottom: 18 }}>
            Cuando el impulso llegue,<br/>
            <em style={{ fontStyle: 'italic', color: T.warm }}>no estarás solo.</em>
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.6, color: T.ink2, maxWidth: 480 }}>
            App móvil gratuita que intercepta el momento exacto del impulso y te acompaña con un agente IA empático. Privacidad radical, capa espiritual cristiana opcional, sin juicio.
          </div>
        </div>
        <Aliado size={140} state="rest" tone="warm" />
      </div>

      <div style={{ display: 'flex', gap: 24, fontSize: 13, color: T.ink3 }}>
        <span>📱 React Native + Expo</span>
        <span>🌐 Next.js + shadcn</span>
        <span>🎨 Fraunces + Inter</span>
        <span>🇪🇸 ES · LATAM</span>
      </div>
    </div>
  );
}

function PaletteCard() {
  const swatches = [
    ['Primario',     '#3B6EA8', 'Cielo de mañana'],
    ['Secundario',   '#7BA888', 'Salvia'],
    ['Acento',       '#E8B96A', 'Ámbar'],
    ['Alerta suave', '#D97757', 'Terracota'],
    ['Texto',        '#1C2128', ''],
    ['Fondo',        '#F7F5F2', ''],
  ];
  return (
    <div className="ap" style={{ width: '100%', height: '100%', background: '#fff', padding: 36, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: T.ink3 }}>Sistema visual</div>
        <div className="ap-h1" style={{ fontSize: 28, marginTop: 4 }}>Paleta + tipografía</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {swatches.map(([name, hex, note]) => (
          <div key={hex} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: hex, border: `1px solid ${T.hairline}` }}/>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
              <div style={{ fontSize: 11, color: T.ink3, fontFamily: 'ui-monospace, monospace' }}>{hex}</div>
              {note && <div style={{ fontSize: 11, color: T.ink3 }}>{note}</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${T.hairline}`, paddingTop: 20 }}>
        <div className="ap-h1" style={{ fontSize: 36, lineHeight: 1.1, marginBottom: 8 }}>
          Vamos paso <em style={{ fontStyle: 'italic' }}>a paso.</em>
        </div>
        <div style={{ fontSize: 12, color: T.ink3, fontFamily: 'ui-monospace, monospace', marginBottom: 16 }}>Fraunces · 36/40 · 500</div>
        <div style={{ fontSize: 16, lineHeight: 1.55, color: T.ink2 }}>
          Estoy aquí cuando lo necesites. Sin juicio, sin presión.
        </div>
        <div style={{ fontSize: 12, color: T.ink3, fontFamily: 'ui-monospace, monospace', marginTop: 6 }}>Inter · 16/26 · 400</div>
      </div>
    </div>
  );
}

function AliadoStatesCard() {
  const states = [
    { state: 'rest',      label: 'En reposo', desc: 'Respira lento (6 s in/out). Default visible.' },
    { state: 'listening', label: 'Escuchando', desc: 'Halo ondula. El usuario habla por voz.' },
    { state: 'speaking',  label: 'Hablando',  desc: 'Pulso rápido (1.2 s). Aliado responde.' },
  ];
  return (
    <div className="ap" style={{
      width: '100%', height: '100%', background: '#FBF8F3',
      padding: 36, display: 'flex', flexDirection: 'column', gap: 28,
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: T.ink3 }}>Personaje</div>
        <div className="ap-h1" style={{ fontSize: 28, marginTop: 4 }}>Aliado · 3 estados</div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>Forma orgánica abstracta. Nunca cara humana.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'start' }}>
        {states.map(s => (
          <div key={s.state} style={{
            background: '#fff', borderRadius: 18, padding: 20,
            border: `1px solid ${T.hairline}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            <Aliado size={92} state={s.state} tone="warm" />
            <div style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: T.ink3, lineHeight: 1.45, textAlign: 'center' }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, fontSize: 11, color: T.ink3, marginTop: 'auto', flexWrap: 'wrap' }}>
        <span style={{ padding: '4px 10px', border: `1px solid ${T.hairline}`, borderRadius: 99, background: '#fff' }}>Tonos: warm · cool · sage · night</span>
        <span style={{ padding: '4px 10px', border: `1px solid ${T.hairline}`, borderRadius: 99, background: '#fff' }}>SVG + CSS keyframes</span>
        <span style={{ padding: '4px 10px', border: `1px solid ${T.hairline}`, borderRadius: 99, background: '#fff' }}>Lottie en producción</span>
      </div>
    </div>
  );
}

Object.assign(window, { CoverCard, PaletteCard, AliadoStatesCard });
