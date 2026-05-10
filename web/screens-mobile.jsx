// Onboarding + Intervention screens
const { IOSDevice, IOSStatusBar } = window;

// Mobile shell helper — iOS frame shrunk to actual size
function MobileShell({ children, dark, keyboard }) {
  return (
    <div style={{ width: 402, height: 874, position: 'relative', background: dark ? '#000' : '#F2F2F7', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      {/* dynamic island */}
      <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50 }}/>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <IOSStatusBar dark={dark}/>
      </div>
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
      {/* home indicator */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60, height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 8 }}>
        <div style={{ width: 139, height: 5, borderRadius: 100, background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)' }}/>
      </div>
    </div>
  );
}

// ───── ONBOARDING 1: Welcome ─────
function OnboardingWelcome() {
  return (
    <MobileShell>
      <div style={{ paddingTop: 80, height: '100%', display: 'flex', flexDirection: 'column', padding: '80px 28px 48px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36, textAlign: 'center' }}>
          <Aliado size={140} state="rest" tone="warm" />
          <div>
            <div className="ap-h1" style={{ fontSize: 38, lineHeight: 1.1, color: T.ink, marginBottom: 16 }}>
              Hola.<br/>Estoy aquí cuando<br/><em style={{ fontStyle: 'italic' }}>lo necesites.</em>
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.55, color: T.ink2, maxWidth: 320, margin: '0 auto' }}>
              Sin juicio, sin presión.<br/>Vamos paso a paso.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <APButton variant="primary" size="lg" full>Empezar</APButton>
          <APButton variant="ghost" size="md" full>Continuar como invitado</APButton>
        </div>
      </div>
    </MobileShell>
  );
}

// Top bar for onboarding flows
function OBHeader({ step, total = 7, onBack }) {
  return (
    <div style={{ paddingTop: 64, padding: '64px 20px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: 16, background: '#fff', border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <I.chevronLeft size={18} color={T.ink2} />
      </div>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: T.hairline, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(step/total)*100}%`, background: T.primary, borderRadius: 2 }}/>
      </div>
      <div style={{ fontSize: 12, color: T.ink3, fontVariantNumeric: 'tabular-nums', minWidth: 32 }}>{step}/{total}</div>
    </div>
  );
}

// ───── ONBOARDING 2: Name ─────
function OnboardingName() {
  return (
    <MobileShell>
      <OBHeader step={2} />
      <div style={{ padding: '32px 28px 28px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 84px)' }}>
        <div className="ap-h1" style={{ fontSize: 32, lineHeight: 1.15, color: T.ink, marginBottom: 12 }}>
          ¿Cómo te <em style={{ fontStyle: 'italic' }}>llamas?</em>
        </div>
        <div style={{ fontSize: 15, color: T.ink2, lineHeight: 1.5, marginBottom: 32 }}>
          Solo para que Aliado te hable por tu nombre. Puedes saltar.
        </div>
        <div style={{ position: 'relative' }}>
          <input defaultValue="Marlon" style={{
            width: '100%', height: 60, borderRadius: 16, border: `1.5px solid ${T.primary}`,
            background: '#fff', padding: '0 20px', fontSize: 18, fontFamily: 'Inter', color: T.ink,
            outline: 'none',
          }}/>
          <div style={{ position: 'absolute', right: 18, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
            <I.check size={20} color={T.secondary}/>
          </div>
        </div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 12, paddingLeft: 4 }}>Aliado te llamará "Marlon".</div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <APButton variant="primary" size="lg" full rightIcon={<I.arrowRight size={18}/>}>Continuar</APButton>
          <APButton variant="ghost" size="md" full>Saltar</APButton>
        </div>
      </div>
    </MobileShell>
  );
}

// ───── ONBOARDING 3: Motivation ─────
function OnboardingMotivation() {
  const opts = ['Salud mental', 'Mi pareja', 'Mi familia', 'Mi fe', 'Lo intenté antes', 'Curiosidad', 'Mi futuro'];
  const sel = [0, 4];
  return (
    <MobileShell>
      <OBHeader step={3} />
      <div style={{ padding: '32px 28px 28px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 84px)' }}>
        <div className="ap-h1" style={{ fontSize: 30, lineHeight: 1.15, color: T.ink, marginBottom: 10 }}>
          ¿Qué te trae <em style={{ fontStyle: 'italic' }}>hoy aquí?</em>
        </div>
        <div style={{ fontSize: 14, color: T.ink2, lineHeight: 1.5, marginBottom: 24 }}>
          Elige las que sientas. Sin juicio.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {opts.map((o, i) => (
            <APPill key={o} selected={sel.includes(i)}>{o}</APPill>
          ))}
        </div>
        <div style={{ marginTop: 'auto' }}>
          <APButton variant="primary" size="lg" full rightIcon={<I.arrowRight size={18}/>}>Continuar</APButton>
        </div>
      </div>
    </MobileShell>
  );
}

// ───── ONBOARDING 4: Faith opt-in ─────
function OnboardingFaith() {
  return (
    <MobileShell>
      <OBHeader step={5} />
      <div style={{ padding: '32px 28px 28px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 84px)' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, background: '#EAF1F8',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
        }}>
          <I.bookOpen size={32} color={T.primary} />
        </div>
        <div className="ap-h1" style={{ fontSize: 28, lineHeight: 1.18, color: T.ink, marginBottom: 14 }}>
          ¿Quieres acompañamiento <em style={{ fontStyle: 'italic' }}>espiritual cristiano?</em>
        </div>
        <div style={{ fontSize: 15, color: T.ink2, lineHeight: 1.55, marginBottom: 28 }}>
          Si dices sí, Aliado podrá compartirte un versículo o una reflexión cuando encaje. Si dices no, la app es 100% secular. <span style={{ color: T.ink, fontWeight: 500 }}>Puedes cambiarlo cuando quieras.</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button style={{
            padding: '20px 22px', borderRadius: 18, background: '#fff', border: `1.5px solid ${T.primary}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left',
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: T.ink }}>Sí, inclúyelo</div>
              <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}>Católico · evangélico · general</div>
            </div>
            <I.chevronRight size={18} color={T.primary}/>
          </button>
          <button style={{
            padding: '20px 22px', borderRadius: 18, background: '#fff', border: `1px solid ${T.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left',
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: T.ink }}>No, gracias</div>
              <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}>App 100% secular</div>
            </div>
            <I.chevronRight size={18} color={T.ink3}/>
          </button>
        </div>
        <div style={{ marginTop: 'auto', fontSize: 12, color: T.ink3, textAlign: 'center', lineHeight: 1.5 }}>
          Esto no afecta la efectividad de la app.<br/>Antiport funciona igual para cualquier persona.
        </div>
      </div>
    </MobileShell>
  );
}

// ───── ONBOARDING 5: Permissions ─────
function OnboardingPermissions() {
  const items = [
    { icon: I.shield, title: 'Screen Time', desc: 'iOS bloquea la página antes de que cargue.', on: true },
    { icon: I.lock,   title: 'Sin tracking', desc: 'Las URLs nunca salen de tu móvil.', on: true },
    { icon: I.bell,   title: 'Notificaciones', desc: 'Recordatorios suaves en franjas de riesgo.', on: false },
  ];
  return (
    <MobileShell>
      <OBHeader step={7} />
      <div style={{ padding: '28px 28px 28px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 84px)' }}>
        <div className="ap-h1" style={{ fontSize: 28, lineHeight: 1.15, color: T.ink, marginBottom: 10 }}>
          Activa la <em style={{ fontStyle: 'italic' }}>protección.</em>
        </div>
        <div style={{ fontSize: 14, color: T.ink2, lineHeight: 1.55, marginBottom: 24 }}>
          Todo lo que ves aquí explica honestamente qué hace cada permiso.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((it, i) => (
            <div key={i} style={{
              padding: 16, borderRadius: 16, background: '#fff', border: `1px solid ${T.hairline}`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: it.on ? '#EAF1F8' : '#F4F2EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <it.icon size={22} color={it.on ? T.primary : T.ink3} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>{it.title}</div>
                <div style={{ fontSize: 12, color: T.ink3, lineHeight: 1.4, marginTop: 2 }}>{it.desc}</div>
              </div>
              {/* toggle */}
              <div style={{
                width: 44, height: 26, borderRadius: 13, padding: 2,
                background: it.on ? T.primary : T.hairlineStrong, transition: '.2s',
                display: 'flex', alignItems: 'center',
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', marginLeft: it.on ? 18 : 0 }}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <APButton variant="primary" size="lg" full>Activar protección</APButton>
          <APButton variant="ghost" size="md" full>Más tarde</APButton>
        </div>
      </div>
    </MobileShell>
  );
}

// ═══════════════════ INTERVENTION ═══════════════════
// Common warm bg
function InterventionBg({ children }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse at 50% 30%, #F0CCB7 0%, ${T.warmBg} 50%, #ECDDD2 100%)`,
      overflow: 'hidden',
    }}>
      {/* organic blob */}
      <div style={{ position: 'absolute', top: -80, right: -100, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,87,0.18) 0%, transparent 70%)' }}/>
      <div style={{ position: 'absolute', bottom: -120, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,185,106,0.15) 0%, transparent 70%)' }}/>
      {children}
    </div>
  );
}

// C1 · Conversational (the canonical version)
function InterventionConversational() {
  return (
    <MobileShell>
      <InterventionBg>
        <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: '70px 24px 36px', display: 'flex', flexDirection: 'column' }}>
          {/* meta */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <I.shield size={16} color={T.warm}/>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.warm, letterSpacing: 0.4, textTransform: 'uppercase' }}>Antiport</span>
            </div>
            <div style={{ fontSize: 12, color: T.ink2, opacity: 0.7 }}>22:47 · domingo</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <Aliado size={88} state="rest" tone="warm" />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.warm, marginBottom: 6, letterSpacing: 0.3, textTransform: 'uppercase' }}>Aliado</div>
            <div className="ap-h1" style={{ fontSize: 26, lineHeight: 1.25, color: T.ink, fontWeight: 500 }}>
              Marlon, espera un segundo. Llevas <em style={{ fontStyle: 'italic', color: T.warm }}>14 días.</em>
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.5, color: T.ink2, marginTop: 12 }}>
              ¿Qué ha pasado hoy? ¿Estás cansado, te has aburrido, ha sido la peli?
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
            <button style={{
              padding: '18px 22px', borderRadius: 18, background: T.ink, color: '#fff',
              fontSize: 16, fontWeight: 600, fontFamily: 'Inter', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <I.message size={20} />
                <span>Hablar con Aliado</span>
              </span>
              <I.arrowRight size={18}/>
            </button>
            <button style={{
              padding: '18px 22px', borderRadius: 18, background: '#fff', color: T.ink,
              fontSize: 16, fontWeight: 600, fontFamily: 'Inter', border: `1px solid rgba(0,0,0,0.06)`, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <I.wind size={20} color={T.primary}/>
                <span>Respirar 60 segundos</span>
              </span>
              <I.arrowRight size={18} color={T.ink3}/>
            </button>
            <button style={{
              padding: '18px 22px', borderRadius: 18, background: '#fff', color: T.ink,
              fontSize: 16, fontWeight: 600, fontFamily: 'Inter', border: `1px solid rgba(0,0,0,0.06)`, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <I.heart size={20} color={T.secondary}/>
                <span>Ver mis anclas</span>
              </span>
              <I.arrowRight size={18} color={T.ink3}/>
            </button>

            <div style={{ textAlign: 'center', marginTop: 18 }}>
              <button style={{ background: 'transparent', border: 'none', color: T.ink2, fontSize: 14, fontFamily: 'Inter', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, opacity: 0.6 }}>
                Quiero entrar igual
              </button>
            </div>
          </div>
        </div>
      </InterventionBg>
    </MobileShell>
  );
}

// C2 · Short — single message + 3 buttons, faster
function InterventionShort() {
  return (
    <MobileShell>
      <InterventionBg>
        <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: '90px 24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Aliado size={104} state="rest" tone="warm" />
          <div className="ap-h1" style={{ fontSize: 30, lineHeight: 1.18, color: T.ink, marginTop: 32, fontWeight: 500 }}>
            Hey. <em style={{ fontStyle: 'italic', color: T.warm }}>Estoy aquí.</em>
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.55, color: T.ink2, marginTop: 14, maxWidth: 320 }}>
            Llevas 14 días. Respira un segundo. ¿Qué necesitas?
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
            <APButton variant="dark" size="lg" full leftIcon={<I.wind size={18}/>}>Respirar 60 segundos</APButton>
            <APButton variant="onWarm" size="lg" full leftIcon={<I.message size={18} color={T.warm}/>}>Hablar con Aliado</APButton>
            <APButton variant="onWarm" size="lg" full leftIcon={<I.heart size={18} color={T.warm}/>}>Ver mis anclas</APButton>
            <button style={{ background: 'transparent', border: 'none', color: T.ink2, fontSize: 14, fontFamily: 'Inter', cursor: 'pointer', marginTop: 8, opacity: 0.6, textDecoration: 'underline', textUnderlineOffset: 4 }}>
              Quiero entrar igual
            </button>
          </div>
        </div>
      </InterventionBg>
    </MobileShell>
  );
}

// C3 · Silent — only the breathing circle, no text
function InterventionSilent() {
  const id = React.useId().replace(/[:]/g,'');
  React.useEffect(() => {
    const s = document.createElement('style');
    s.textContent = `
      @keyframes ivb-${id} { 0%,100% { transform: scale(0.85); opacity: 0.7 } 50% { transform: scale(1.15); opacity: 1 } }
      @keyframes ivc-${id} { 0%,100% { transform: scale(1) } 50% { transform: scale(1.04) } }
    `;
    document.head.appendChild(s);
    return () => s.remove();
  }, [id]);
  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${T.warmBg} 0%, #ECDDD2 100%)`, overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: '60px 24px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ paddingTop: 20, fontSize: 12, fontWeight: 600, color: T.warm, letterSpacing: 0.4, textTransform: 'uppercase' }}>Respira</div>

          <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle, ${T.warmSoft} 0%, transparent 70%)`, animation: `ivb-${id} 8s ease-in-out infinite` }}/>
            <div style={{ width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #F2D7B0, ${T.warm})`, animation: `ivc-${id} 8s ease-in-out infinite` }}/>
            <div style={{ position: 'absolute', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.95)', letterSpacing: 0.6 }}>Inhala</div>
          </div>

          <div style={{ textAlign: 'center', maxWidth: 320 }}>
            <div style={{ fontSize: 14, color: T.ink2, lineHeight: 1.55, marginBottom: 24 }}>
              No tienes que decir nada. Solo respira conmigo.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button style={{ padding: '10px 18px', borderRadius: 99, background: 'rgba(255,255,255,0.7)', border: `1px solid rgba(0,0,0,0.06)`, fontSize: 13, color: T.ink2, fontFamily: 'Inter', cursor: 'pointer' }}>
                Quiero hablar
              </button>
              <button style={{ padding: '10px 18px', borderRadius: 99, background: 'transparent', border: 'none', fontSize: 13, color: T.ink2, fontFamily: 'Inter', cursor: 'pointer', opacity: 0.6 }}>
                Entrar igual
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

// C4 · Friction — write commitment by hand
function InterventionFriction() {
  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: '#F7F5F2' }}>
        <div style={{ paddingTop: 70, padding: '70px 24px 36px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <I.chevronLeft size={22} color={T.ink2}/>
            <span style={{ fontSize: 14, color: T.ink2 }}>Volver con Aliado</span>
          </div>

          <div className="ap-h1" style={{ fontSize: 26, lineHeight: 1.2, color: T.ink, marginBottom: 12, fontWeight: 500 }}>
            Antes de continuar.
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.55, color: T.ink2, marginBottom: 20 }}>
            Si quieres entrar igual, escribe la siguiente frase a mano. No es para juzgarte. Es para que tú lo escuches.
          </div>

          <div style={{ background: '#fff', border: `1px solid ${T.hairline}`, borderRadius: 16, padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.ink3, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 8 }}>Frase</div>
            <div className="ap-serif" style={{ fontSize: 18, lineHeight: 1.5, color: T.ink, fontStyle: 'italic' }}>
              "Voy a entrar a una web que sé que me hace daño."
            </div>
          </div>

          <div style={{ background: '#fff', border: `1.5px solid ${T.warm}`, borderRadius: 16, padding: 18, minHeight: 140 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.warm, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 10 }}>Tu turno · escríbelo</div>
            <div style={{ fontSize: 16, color: T.ink, lineHeight: 1.5, fontFamily: 'Inter' }}>
              Voy a entrar a una web que sé que<span style={{ display: 'inline-block', width: 1, height: 18, background: T.warm, marginLeft: 1, verticalAlign: -3 }}/>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <APButton variant="warm" size="lg" full disabled>Continuar (incompleto)</APButton>
            <APButton variant="ghost" size="md" full>No, mejor no</APButton>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

Object.assign(window, {
  MobileShell, OnboardingWelcome, OnboardingName, OnboardingMotivation, OnboardingFaith, OnboardingPermissions,
  InterventionConversational, InterventionShort, InterventionSilent, InterventionFriction,
});
