// Email templates (Resend) + web panel dashboard

// ═══════════════════ EMAILS ═══════════════════
function EmailShell({ children, preheader }) {
  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'auto',
      background: '#EEEAE3', padding: '32px 0',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        maxWidth: 520, margin: '0 auto',
        background: '#fff', borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(28,33,40,0.06)',
      }}>
        <div style={{ padding: '28px 32px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <APWordmark size={20}/>
          <span style={{ fontSize: 11, color: T.ink3 }}>{preheader}</span>
        </div>
        {children}
        <div style={{ padding: '24px 32px', borderTop: `1px solid ${T.hairline}`, fontSize: 11, color: T.ink3, lineHeight: 1.6 }}>
          Recibes este email porque tienes una cuenta en Antiport. <span style={{ textDecoration: 'underline' }}>Gestionar emails</span> · <span style={{ textDecoration: 'underline' }}>Privacidad</span><br/>
          Antiport · Madrid, España · <em>Cero URLs viajan a nuestros servidores.</em>
        </div>
      </div>
    </div>
  );
}

function EmailWelcome() {
  return (
    <EmailShell preheader="Has dado el primer paso">
      <div style={{ padding: 32 }}>
        <div className="ap-h1" style={{ fontSize: 30, fontWeight: 400, lineHeight: 1.15 }}>
          Has dado el <em style={{ fontStyle: 'italic', color: T.primary }}>primer paso</em>.
        </div>
        <p style={{ fontSize: 15, color: T.ink2, lineHeight: 1.6, marginTop: 16 }}>
          Hola Marlon. Soy Aliado. Estaré ahí cuando lo necesites — sin juicio, sin presión, paso a paso.
        </p>
        <p style={{ fontSize: 15, color: T.ink2, lineHeight: 1.6 }}>
          Lo más útil que puedes hacer ahora es activar la protección. Solo tarda 30 segundos y es lo que permite que esté contigo en el momento exacto del impulso.
        </p>
        <div style={{ marginTop: 24 }}>
          <APButton variant="primary" size="lg">Activar protección</APButton>
        </div>
        <div style={{ marginTop: 28, padding: 18, borderRadius: 14, background: T.bg, border: `1px solid ${T.hairline}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <I.lock size={18} color={T.primary}/>
          <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.5 }}>
            <strong style={{ color: T.ink }}>Tu privacidad es radical.</strong> El historial de URLs nunca sale de tu móvil. En este servidor solo está tu email.
          </div>
        </div>
      </div>
    </EmailShell>
  );
}

function EmailInactivity() {
  return (
    <EmailShell preheader="¿Cómo va?">
      <div style={{ padding: 32 }}>
        <div className="ap-h1" style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.15 }}>
          Hace una semana que no nos vemos.
        </div>
        <p style={{ fontSize: 16, color: T.ink2, lineHeight: 1.6, marginTop: 14, fontStyle: 'italic' }}>
          ¿Cómo va?
        </p>
        <p style={{ fontSize: 15, color: T.ink2, lineHeight: 1.6 }}>
          No te escribo para regañarte ni para cargarte de culpa. Solo para recordarte que sigo aquí. Si quieres contarme, abre la app.
        </p>
        <div style={{ marginTop: 24 }}>
          <APButton variant="primary" size="md">Abrir Antiport</APButton>
        </div>
      </div>
    </EmailShell>
  );
}

function EmailWeekly() {
  const stat = (label, value, color) => (
    <div style={{ flex: 1, padding: 18, borderRadius: 14, background: T.bg, border: `1px solid ${T.hairline}` }}>
      <div className="ap-h1" style={{ fontSize: 28, fontWeight: 500, color }}>{value}</div>
      <div style={{ fontSize: 12, color: T.ink3, marginTop: 4 }}>{label}</div>
    </div>
  );
  return (
    <EmailShell preheader="Tu semana, en privado">
      <div style={{ padding: 32 }}>
        <div className="ap-h1" style={{ fontSize: 26, fontWeight: 400, lineHeight: 1.2 }}>
          Tu semana, <em style={{ fontStyle: 'italic', color: T.secondary }}>en privado</em>.
        </div>
        <p style={{ fontSize: 14, color: T.ink3, marginTop: 8 }}>21 — 27 abril, 2026</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          {stat('Días limpios', '6', T.secondary)}
          {stat('Impulsos resistidos', '4', T.accent)}
          {stat('Min. con Aliado', '23', T.primary)}
        </div>
        <div style={{ marginTop: 28, padding: 18, borderRadius: 14, background: T.warmBg, border: `1px solid ${T.warmSoft}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: T.warm, marginBottom: 8 }}>Patrón detectado</div>
          <div style={{ fontSize: 15, color: T.ink, lineHeight: 1.5 }}>
            Tus impulsos suelen llegar los <strong>domingos por la noche</strong>, cuando registras "aburrimiento". Esta semana intenta tener algo planeado entre las 22h y 24h.
          </div>
        </div>
        <div style={{ marginTop: 28, padding: 22, borderRadius: 14, borderLeft: `3px solid ${T.primary}`, background: T.primary + '08' }}>
          <div className="ap-serif" style={{ fontSize: 17, fontStyle: 'italic', color: T.ink, lineHeight: 1.5 }}>
            "Lo importante no es no caer nunca. Es levantarse cada vez que cae uno."
          </div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 8 }}>Reflexión de la semana</div>
        </div>
        <div style={{ marginTop: 24 }}>
          <APButton variant="secondary" size="md">Ver el diario completo</APButton>
        </div>
      </div>
    </EmailShell>
  );
}

// ═══════════════════ WEB PANEL ═══════════════════
function WebSidebar() {
  const items = [
    { icon: I.home, label: 'Hoy', active: true },
    { icon: I.book, label: 'Diario' },
    { icon: I.heart, label: 'Anclas' },
    { icon: I.message, label: 'Aliado' },
    { icon: I.shield, label: 'Protección' },
    { icon: I.settings, label: 'Ajustes' },
  ];
  return (
    <div style={{ width: 240, padding: '28px 16px', borderRight: `1px solid ${T.hairline}`, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '0 12px 28px' }}>
        <APWordmark size={22}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map(it => (
          <div key={it.label} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 10,
            background: it.active ? T.primary + '12' : 'transparent',
            color: it.active ? T.primary : T.ink2,
            fontSize: 14, fontWeight: it.active ? 600 : 500,
          }}>
            <it.icon size={18}/>
            {it.label}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', padding: 14, borderRadius: 12, background: T.bg, fontSize: 12, color: T.ink2, lineHeight: 1.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <I.lock size={14} color={T.secondary}/>
          <strong style={{ color: T.ink }}>Privado</strong>
        </div>
        Cero URLs en el servidor.
      </div>
    </div>
  );
}

function WebDashboard() {
  return (
    <div style={{ display: 'flex', height: '100%', background: '#fff', fontFamily: 'Inter, sans-serif', color: T.ink }}>
      <WebSidebar/>
      <div style={{ flex: 1, padding: '32px 40px', overflow: 'auto', background: T.bg }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 13, color: T.ink3, fontWeight: 600 }}>Buenos días, Marlon</div>
            <h1 className="ap-h1" style={{ fontSize: 38, fontWeight: 400, lineHeight: 1.1, margin: '8px 0 0' }}>
              Llevas <em style={{ fontStyle: 'italic', color: T.secondary }}>14 días</em> contigo.
            </h1>
          </div>
          <APButton variant="warm" size="md" leftIcon={<I.flame size={16}/>}>Tengo un impulso</APButton>
        </div>

        {/* 3-col stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Racha actual', value: '14', unit: 'días', color: T.secondary, icon: I.leaf },
            { label: 'Mejor racha', value: '32', unit: 'días', color: T.accent, icon: I.award },
            { label: 'Resistidos', value: '46', unit: 'este mes', color: T.primary, icon: I.shield },
            { label: 'Con Aliado', value: '2h 14m', unit: 'esta semana', color: T.warm, icon: I.message },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', padding: 20, borderRadius: 16, border: `1px solid ${T.hairline}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase', color: T.ink3 }}>{s.label}</div>
                <s.icon size={16} color={s.color}/>
              </div>
              <div className="ap-h1" style={{ fontSize: 32, fontWeight: 500, color: s.color, marginTop: 10 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: T.ink3 }}>{s.unit}</div>
            </div>
          ))}
        </div>

        {/* Chart + sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginTop: 14 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: `1px solid ${T.hairline}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div className="ap-h1" style={{ fontSize: 18, fontWeight: 500 }}>Patrón de impulsos · últimas 4 semanas</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: T.ink3 }}>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 8, height: 8, background: T.warm, borderRadius: 2 }}/>Resistidos</span>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 8, height: 8, background: T.secondary, borderRadius: 2 }}/>Días limpios</span>
              </div>
            </div>
            {/* Simple chart */}
            <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 8, paddingTop: 16, borderBottom: `1px solid ${T.hairline}` }}>
              {[42,28,55,38,72,45,60,32,68,50,80,55,90,62,48,66,58,72,40,85,50,76,40,58,30,68,45,82].map((v,i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 2 }}>
                  <div style={{ height: `${v * 0.5}%`, background: i % 7 === 0 ? T.warm : T.warmSoft, borderRadius: 3 }}/>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.ink3, marginTop: 8 }}>
              <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
            </div>
          </div>
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: `1px solid ${T.hairline}` }}>
            <div className="ap-h1" style={{ fontSize: 18, fontWeight: 500 }}>Tus triggers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
              {[
                { name: 'Aburrimiento', pct: 38 },
                { name: 'Cansancio', pct: 28 },
                { name: 'Soledad', pct: 22 },
                { name: 'Estrés', pct: 12 },
              ].map(t => (
                <div key={t.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: T.ink2, fontWeight: 500 }}>{t.name}</span>
                    <span style={{ color: T.ink3 }}>{t.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: T.hairline, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: t.pct + '%', height: '100%', background: T.primary, borderRadius: 3 }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insight + reflection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
          <div style={{ background: T.warmBg, padding: 22, borderRadius: 16, border: `1px solid ${T.warmSoft}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: T.warm, marginBottom: 8 }}>Patrón detectado</div>
            <div style={{ fontSize: 15, color: T.ink, lineHeight: 1.55 }}>
              Sueles tener impulsos los <strong>domingos por la noche</strong> cuando registras "aburrimiento". Esta semana planea algo entre las 22 y 24h.
            </div>
          </div>
          <div style={{ background: T.primary + '0E', padding: 22, borderRadius: 16, borderLeft: `3px solid ${T.primary}` }}>
            <div className="ap-serif" style={{ fontSize: 17, fontStyle: 'italic', color: T.ink, lineHeight: 1.5 }}>
              "Lo importante no es no caer nunca. Es levantarse cada vez que cae uno."
            </div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 10 }}>Reflexión del día · {' '}<span style={{ color: T.primary, fontWeight: 600 }}>Capa espiritual on</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EmailWelcome, EmailInactivity, EmailWeekly, WebDashboard });
