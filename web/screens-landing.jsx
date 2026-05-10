// Landing public site — desktop + mobile

function LandingNav({ mobile }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: mobile ? '20px 24px' : '28px 56px',
    }}>
      <APWordmark size={mobile ? 22 : 26}/>
      {mobile ? (
        <button style={{ background: 'transparent', border: 'none', padding: 6 }}>
          <I.more size={22}/>
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 36, alignItems: 'center', fontSize: 14, color: T.ink2 }}>
          <span>Cómo funciona</span>
          <span>Para quién</span>
          <span>Privacidad</span>
          <span>FAQ</span>
          <APButton variant="primary" size="sm">Descargar</APButton>
        </div>
      )}
    </div>
  );
}

function LandingHero({ mobile }) {
  return (
    <div style={{
      padding: mobile ? '24px 24px 48px' : '60px 56px 100px',
      display: 'flex', flexDirection: mobile ? 'column' : 'row',
      gap: mobile ? 36 : 80, alignItems: 'center',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', borderRadius: 999,
          background: T.primary + '14', color: T.primary,
          fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
          marginBottom: 22,
        }}>
          <I.shield size={14}/>
          Privado · Gratis · iOS y Android
        </div>
        <h1 className="ap-h1" style={{
          fontSize: mobile ? 44 : 72, fontWeight: 400,
          lineHeight: 1.05, margin: 0, letterSpacing: -0.025 * (mobile ? 44 : 72),
        }}>
          Cuando el impulso llegue,<br/>
          <em style={{ fontStyle: 'italic', color: T.primary }}>no estarás solo.</em>
        </h1>
        <p style={{
          fontSize: mobile ? 17 : 20, lineHeight: 1.55,
          color: T.ink2, marginTop: 24, maxWidth: 540,
        }}>
          Antiport intercepta el momento exacto y te acompaña con IA. Una conversación, no un bloqueo. Gratis, privado, sin juicio.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
          <APButton variant="dark" size="lg" leftIcon={<I.apple size={18}/>}>App Store</APButton>
          <APButton variant="dark" size="lg" leftIcon={<I.play size={16}/>}>Google Play</APButton>
        </div>
        <div style={{ marginTop: 18, fontSize: 13, color: T.ink3, display: 'flex', gap: 16, alignItems: 'center' }}>
          <span>Cómo funciona</span>
          <span style={{ width: 1, height: 12, background: T.hairlineStrong }}/>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <I.lock size={12}/> Cero URLs en nuestros servidores
          </span>
        </div>
      </div>

      {/* Phone mock — intervention preview */}
      <div style={{
        flex: mobile ? '0 0 auto' : '0 0 380px',
        position: 'relative', display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          width: mobile ? 260 : 320, aspectRatio: '9 / 19',
          borderRadius: 44, padding: 10,
          background: '#1C2128',
          boxShadow: '0 40px 80px -20px rgba(28,33,40,0.35), 0 8px 32px -8px rgba(28,33,40,0.2)',
          transform: mobile ? 'none' : 'rotate(2deg)',
        }}>
          <div style={{
            width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden',
            background: T.warmBg, padding: 24, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ height: 24 }}/>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <Aliado size={mobile ? 70 : 90} state="rest" tone="warm"/>
              <div className="ap-h1" style={{
                fontSize: mobile ? 18 : 22, textAlign: 'center', lineHeight: 1.25,
                color: T.ink, padding: '0 4px',
              }}>
                Marlon, espera un segundo. Llevas <em style={{ fontStyle: 'italic' }}>14 días</em>.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              <div style={{ height: 40, borderRadius: 20, background: T.warm, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>Hablar con Aliado</div>
              <div style={{ height: 40, borderRadius: 20, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: T.ink2 }}>Respirar 60 s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingMomentBlock({ mobile }) {
  return (
    <div style={{
      background: '#fff', padding: mobile ? '60px 24px' : '120px 56px',
      borderTop: `1px solid ${T.hairline}`, borderBottom: `1px solid ${T.hairline}`,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: T.warm, marginBottom: 16 }}>El momento del impulso</div>
        <h2 className="ap-h1" style={{ fontSize: mobile ? 32 : 56, fontWeight: 400, lineHeight: 1.1, margin: 0 }}>
          No es un bloqueo frío.<br/>
          <em style={{ fontStyle: 'italic', color: T.warm }}>Es una conversación.</em>
        </h2>
        <p style={{ fontSize: mobile ? 16 : 18, lineHeight: 1.6, color: T.ink2, maxWidth: 620, margin: `${mobile ? 20 : 28}px auto 0` }}>
          Cuando intentas abrir una página, Antiport no te enseña una pared. Te pone a Aliado al teléfono. Te pregunta qué pasó hoy. Y te ofrece tres salidas concretas.
        </p>
      </div>
    </div>
  );
}

function LandingBenefits({ mobile }) {
  const items = [
    { icon: <I.message size={28} color={T.primary}/>, title: 'Intervención en el momento', body: 'No es un bloqueo frío. Es una conversación con un agente IA empático que te ayuda a redirigir.', tint: T.primary },
    { icon: <I.trendingUp size={28} color={T.secondary}/>, title: 'Tu diario, tu progreso', body: 'Patrones, rachas, triggers. Conocerlos es la mitad del camino.', tint: T.secondary },
    { icon: <I.lock size={28} color={T.accent}/>, title: 'Privado de verdad', body: 'Lo que pasa en tu móvil, se queda en tu móvil. Cero historial en nuestros servidores.', tint: T.accent },
  ];
  return (
    <div style={{ padding: mobile ? '60px 24px' : '120px 56px', background: T.bg }}>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: mobile ? 16 : 28, maxWidth: 1180, margin: '0 auto' }}>
        {items.map(it => (
          <div key={it.title} style={{ background: '#fff', padding: 32, borderRadius: 24, border: `1px solid ${T.hairline}` }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: it.tint + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>{it.icon}</div>
            <div className="ap-h1" style={{ fontSize: 22, fontWeight: 500, marginBottom: 10 }}>{it.title}</div>
            <div style={{ fontSize: 15, lineHeight: 1.55, color: T.ink2 }}>{it.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LandingTestimonials({ mobile }) {
  const items = [
    { quote: 'No sentí que me bloqueara. Sentí que alguien me preguntó cómo estaba. Es muy distinto.', name: 'Marlon, 28' },
    { quote: 'Llevaba años intentándolo con apps que solo prohíben. Esto es lo primero que entiende por qué.', name: 'Lucía, 35' },
    { quote: 'Lo descargué con miedo a que fuera muy religioso. La capa de fe es opcional. Funciona perfecto sin ella.', name: 'D., 19' },
    { quote: 'La opción de versículo cuando lo necesito me ayuda mucho. Y respeta cuando no quiero.', name: 'Anónimo' },
  ];
  return (
    <div style={{ padding: mobile ? '60px 24px' : '120px 56px', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 className="ap-h1" style={{ fontSize: mobile ? 30 : 48, fontWeight: 400, lineHeight: 1.1, margin: 0, textAlign: 'center' }}>
          Para <em style={{ fontStyle: 'italic', color: T.primary }}>cualquiera</em> que esté listo.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(2, 1fr)', gap: 16, marginTop: 40 }}>
          {items.map((it, i) => (
            <div key={i} style={{ padding: 28, borderRadius: 20, background: T.bg, border: `1px solid ${T.hairline}` }}>
              <div className="ap-serif" style={{ fontSize: 18, lineHeight: 1.5, color: T.ink, fontStyle: 'italic' }}>"{it.quote}"</div>
              <div style={{ fontSize: 13, color: T.ink3, marginTop: 14, fontWeight: 500 }}>— {it.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LandingFaith({ mobile }) {
  return (
    <div style={{ padding: mobile ? '60px 24px' : '100px 56px', background: T.primary + '0E' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 32, alignItems: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <I.bookOpen size={32} color={T.primary}/>
        </div>
        <div>
          <div className="ap-h1" style={{ fontSize: mobile ? 24 : 30, fontWeight: 500, lineHeight: 1.2 }}>Capa espiritual cristiana, opcional.</div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: T.ink2, margin: '12px 0 0' }}>
            Si tu fe es parte de tu camino, Antiport puede acompañarte con versículos y reflexión bíblica. Si no, también está hecha para ti — la capa se desactiva en un toque.
          </p>
        </div>
      </div>
    </div>
  );
}

function LandingFAQ({ mobile }) {
  const qs = [
    { q: '¿Es realmente gratis?', a: 'Sí, gratis y sin anuncios. La app se sostiene por donaciones voluntarias.', open: true },
    { q: '¿Qué datos guardáis sobre mí?', a: 'El historial de URLs nunca sale del dispositivo. En el servidor solo guardamos tu email y configuración.', open: false },
    { q: '¿Cómo funciona el bloqueo en iOS / Android?', a: 'En iOS usamos Screen Time. En Android, un servicio de accesibilidad o VPN local. Sin enviar tráfico fuera.' },
    { q: '¿Puedo desinstalarla cuando quiera?', a: 'Sí. La fricción de 24h es opcional, opt-in en onboarding, y siempre puedes confirmarla por email.' },
  ];
  return (
    <div style={{ padding: mobile ? '60px 24px' : '120px 56px', background: T.bg }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h2 className="ap-h1" style={{ fontSize: mobile ? 30 : 44, fontWeight: 400, margin: 0, textAlign: 'center' }}>Preguntas frecuentes</h2>
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {qs.map((q, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.hairline}`, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{q.q}</div>
                <I.chevronDown size={18} color={T.ink3} style={{ transform: q.open ? 'rotate(180deg)' : 'none', transition: '.2s' }}/>
              </div>
              {q.open && <div style={{ fontSize: 15, color: T.ink2, lineHeight: 1.55, marginTop: 12 }}>{q.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LandingFooter({ mobile }) {
  return (
    <div style={{ padding: mobile ? '40px 24px' : '60px 56px', background: T.ink, color: '#A6ADB7' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 28, justifyContent: 'space-between' }}>
        <div>
          <APWordmark size={22} dark/>
          <div style={{ fontSize: 13, marginTop: 14, maxWidth: 320, lineHeight: 1.55 }}>
            Antiport te acompaña con IA cuando llega el impulso. Privado, gratis, sin juicio.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 48, fontSize: 13 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}>Producto</div>
            <span>Descargar</span><span>Cómo funciona</span><span>FAQ</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}>Legal</div>
            <span>Privacidad</span><span>Términos</span><span>Contacto</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}>Comunidad</div>
            <span>Apoya el proyecto</span><span>Newsletter</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1180, margin: '40px auto 0', paddingTop: 24, borderTop: `1px solid rgba(255,255,255,0.1)`, fontSize: 12, color: '#6B7280' }}>
        © 2026 Antiport · Hecho con cuidado, no con prisa.
      </div>
    </div>
  );
}

function LandingDesktop() {
  return (
    <div style={{ background: T.bg, fontFamily: 'Inter, sans-serif', color: T.ink }}>
      <LandingNav/>
      <LandingHero/>
      <LandingMomentBlock/>
      <LandingBenefits/>
      <LandingTestimonials/>
      <LandingFaith/>
      <LandingFAQ/>
      <LandingFooter/>
    </div>
  );
}

function LandingMobile() {
  return (
    <div style={{ background: T.bg, fontFamily: 'Inter, sans-serif', color: T.ink, width: '100%' }}>
      <LandingNav mobile/>
      <LandingHero mobile/>
      <LandingMomentBlock mobile/>
      <LandingBenefits mobile/>
      <LandingTestimonials mobile/>
      <LandingFaith mobile/>
      <LandingFAQ mobile/>
      <LandingFooter mobile/>
    </div>
  );
}

Object.assign(window, { LandingDesktop, LandingMobile });
