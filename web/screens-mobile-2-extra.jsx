// Settings · Auth · stub fillers (Landing & Email & Web defined elsewhere)

// ═══════════════════ SETTINGS ═══════════════════
function SettingsRow({ icon, title, detail, hint, danger, isLast, toggle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '14px 16px', minHeight: 56,
      gap: 12, borderBottom: isLast ? 'none' : `0.5px solid ${T.hairline}`,
    }}>
      {icon && (
        <div style={{ width: 32, height: 32, borderRadius: 8, background: danger ? T.warm + '22' : T.primary + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {React.cloneElement(icon, { size: 18, color: danger ? T.warm : T.primary })}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, color: danger ? T.warm : T.ink, fontWeight: 400 }}>{title}</div>
        {hint && <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{hint}</div>}
      </div>
      {toggle !== undefined ? (
        <div style={{ width: 44, height: 26, borderRadius: 13, padding: 2, background: toggle ? T.primary : T.hairlineStrong, transition: '.2s', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', marginLeft: toggle ? 18 : 0 }}/>
        </div>
      ) : (
        <>
          {detail && <span style={{ fontSize: 14, color: T.ink3 }}>{detail}</span>}
          <I.chevronRight size={14} color={T.hairlineStrong}/>
        </>
      )}
    </div>
  );
}

function SettingsGroup({ title, children }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: T.ink3, padding: '0 24px 8px' }}>{title}</div>
      <div style={{ background: '#fff', borderRadius: 16, margin: '0 16px', overflow: 'hidden', border: `1px solid ${T.hairline}` }}>
        {children}
      </div>
    </div>
  );
}

function SettingsMain() {
  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: T.bg, paddingTop: 56, paddingBottom: 100, overflow: 'auto' }}>
        <div style={{ padding: '20px 24px 0' }}>
          <div className="ap-h1" style={{ fontSize: 34, fontWeight: 500 }}>Ajustes</div>
        </div>

        {/* Profile card */}
        <div style={{ margin: '20px 16px 0', padding: 18, borderRadius: 18, background: '#fff', border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: 'linear-gradient(135deg,#7BA888,#3B6EA8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 600, fontFamily: 'Fraunces, serif' }}>M</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Marlon</div>
            <div style={{ fontSize: 13, color: T.ink3 }}>marlon@hey.com · ES</div>
          </div>
          <I.chevronRight size={16} color={T.ink3}/>
        </div>

        <SettingsGroup title="Acompañamiento">
          <SettingsRow icon={<I.message/>} title="Aliado" detail="Cercano · ÉL"/>
          <SettingsRow icon={<I.bookOpen/>} title="Capa espiritual" detail="Activada · evangélica"/>
          <SettingsRow icon={<I.shield/>} title="Modo intervención" detail="Conversacional" isLast/>
        </SettingsGroup>

        <SettingsGroup title="Protección">
          <SettingsRow icon={<I.lock/>} title="Screen Time (iOS)" detail="Activado"/>
          <SettingsRow icon={<I.globe/>} title="Lista de dominios" detail="2 481"/>
          <SettingsRow icon={<I.calendar/>} title="Modo viaje" hint="Bloqueo intenso por días" toggle={false} isLast/>
        </SettingsGroup>

        <SettingsGroup title="Notificaciones">
          <SettingsRow icon={<I.bell/>} title="Recordatorios" detail="3 al día"/>
          <SettingsRow icon={<I.moon/>} title="Modo silencioso" hint="00:00 – 07:00" toggle={true} isLast/>
        </SettingsGroup>

        <SettingsGroup title="Privacidad">
          <SettingsRow icon={<I.eyeOff/>} title="Política de privacidad"/>
          <SettingsRow icon={<I.download/>} title="Exportar mis datos"/>
          <SettingsRow icon={<I.trash/>} title="Borrar mi cuenta" danger isLast/>
        </SettingsGroup>

        <div style={{ padding: '24px 24px 16px', textAlign: 'center', fontSize: 12, color: T.ink3, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 500, color: T.ink2 }}>Cero URLs viajan a nuestros servidores.</div>
          <div style={{ marginTop: 4 }}>v1.0.0 · Apoya el proyecto →</div>
        </div>
      </div>
      <APTabBar active="settings"/>
    </MobileShell>
  );
}

function SettingsAliado() {
  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: T.bg, paddingTop: 56, paddingBottom: 60, overflow: 'auto' }}>
        <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <I.chevronLeft size={22} color={T.ink2}/>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Aliado</div>
        </div>

        {/* Preview card */}
        <div style={{ margin: '20px 16px 0', padding: 22, borderRadius: 22, background: '#fff', border: `1px solid ${T.hairline}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <Aliado size={88} state="rest" tone="sage"/>
          <div style={{ textAlign: 'center' }}>
            <div className="ap-h1" style={{ fontSize: 22, fontWeight: 500 }}>Aliado</div>
            <div style={{ fontSize: 13, color: T.ink3, marginTop: 4, fontStyle: 'italic' }}>"Hola Marlon. ¿Cómo vamos hoy?"</div>
          </div>
        </div>

        <SettingsGroup title="Personalización">
          <SettingsRow icon={<I.type/>} title="Nombre" detail="Aliado"/>
          <SettingsRow icon={<I.user/>} title="Género" detail="Hombre"/>
          <SettingsRow icon={<I.feather/>} title="Tono" detail="Cercano" isLast/>
        </SettingsGroup>

        <div style={{ padding: '20px 24px 0', fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: T.ink3 }}>Tono</div>
        <div style={{ display: 'flex', gap: 8, padding: '8px 16px 0', overflow: 'auto' }}>
          {['Cercano', 'Formal', 'Directo', 'Suave'].map((t, i) => (
            <APPill key={t} selected={i===0}>{t}</APPill>
          ))}
        </div>

        <div style={{ padding: '20px 24px 0', fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: T.ink3 }}>Frase de bienvenida</div>
        <div style={{ margin: '8px 16px 0', padding: 16, borderRadius: 16, background: '#fff', border: `1px solid ${T.hairline}`, fontSize: 14, color: T.ink, lineHeight: 1.5, fontStyle: 'italic' }}>
          "Hola. Estoy aquí cuando lo necesites. Sin juicio, sin presión. Vamos paso a paso."
        </div>
      </div>
    </MobileShell>
  );
}

function SettingsFaith() {
  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: T.bg, paddingTop: 56, paddingBottom: 60 }}>
        <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <I.chevronLeft size={22} color={T.ink2}/>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Capa espiritual</div>
        </div>

        <div style={{ margin: '20px 16px 0', padding: 22, borderRadius: 22, background: '#EAF1F8', border: `1px solid transparent` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.bookOpen size={22} color={T.primary}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Activada</div>
              <div style={{ fontSize: 12, color: T.ink3 }}>Aliado puede compartir versículos cuando encajen.</div>
            </div>
            <div style={{ width: 44, height: 26, borderRadius: 13, padding: 2, background: T.primary, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: '#fff', marginLeft: 18 }}/>
            </div>
          </div>
        </div>

        <SettingsGroup title="Tradición">
          <SettingsRow title="Católica"/>
          <SettingsRow title="Evangélica" detail={<I.check size={18} color={T.primary}/>}/>
          <SettingsRow title="General (cristiana)" isLast/>
        </SettingsGroup>

        <div style={{ padding: '24px 24px 0', fontSize: 13, color: T.ink3, lineHeight: 1.55 }}>
          Esto cambia las traducciones de versículos y el lenguaje de las reflexiones. Aliado nunca te impondrá temas espirituales — solo los ofrecerá cuando el momento encaje.
        </div>
      </div>
    </MobileShell>
  );
}

// ═══════════════════ AUTH ═══════════════════
function AuthLogin() {
  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: T.bg, paddingTop: 56, padding: '56px 28px 28px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingTop: 60, marginBottom: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <APWordmark size={32}/>
          <div className="ap-h1" style={{ fontSize: 30, fontWeight: 500, marginTop: 28, lineHeight: 1.18, textAlign: 'center' }}>
            Bienvenido <em style={{ fontStyle: 'italic' }}>de vuelta.</em>
          </div>
          <div style={{ fontSize: 14, color: T.ink3, marginTop: 8, textAlign: 'center' }}>Sin juicio, sin presión.</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 40 }}>
          <APButton variant="dark" size="lg" full leftIcon={<I.apple size={18}/>}>Continuar con Apple</APButton>
          <APButton variant="secondary" size="lg" full leftIcon={<I.google size={18} color={T.ink2}/>}>Continuar con Google</APButton>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', fontSize: 12, color: T.ink3 }}>
            <div style={{ flex: 1, height: 1, background: T.hairline }}/>
            <span>o</span>
            <div style={{ flex: 1, height: 1, background: T.hairline }}/>
          </div>

          <div style={{ height: 56, borderRadius: 16, border: `1px solid ${T.hairline}`, background: '#fff', padding: '0 18px', display: 'flex', alignItems: 'center', fontSize: 15, color: T.ink3 }}>
            email@ejemplo.com
          </div>
          <div style={{ height: 56, borderRadius: 16, border: `1px solid ${T.hairline}`, background: '#fff', padding: '0 18px', display: 'flex', alignItems: 'center', fontSize: 15, color: T.ink3, justifyContent: 'space-between' }}>
            <span>Contraseña</span>
            <I.eye size={18} color={T.ink3}/>
          </div>

          <APButton variant="primary" size="lg" full>Entrar</APButton>
        </div>

        <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: 24, fontSize: 13, color: T.ink2 }}>
          <div>¿No tienes cuenta? <span style={{ color: T.primary, fontWeight: 600 }}>Crear una</span></div>
          <div style={{ marginTop: 14, fontSize: 13, color: T.ink3 }}>
            o <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>continuar como invitado anónimo</span>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

function AuthSignup() {
  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: T.bg, paddingTop: 56, padding: '56px 28px 28px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingTop: 16 }}>
          <I.chevronLeft size={22} color={T.ink2}/>
        </div>
        <div style={{ paddingTop: 32 }}>
          <div className="ap-h1" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.15 }}>
            Crear una <em style={{ fontStyle: 'italic' }}>cuenta.</em>
          </div>
          <div style={{ fontSize: 14, color: T.ink3, marginTop: 8, lineHeight: 1.5 }}>
            Solo necesitamos un email. Ningún dato sensible viaja a nuestros servidores.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 32 }}>
          <APButton variant="dark" size="lg" full leftIcon={<I.apple size={18}/>}>Continuar con Apple</APButton>
          <APButton variant="secondary" size="lg" full leftIcon={<I.google size={18} color={T.ink2}/>}>Continuar con Google</APButton>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', fontSize: 12, color: T.ink3 }}>
            <div style={{ flex: 1, height: 1, background: T.hairline }}/>
            <span>o con email</span>
            <div style={{ flex: 1, height: 1, background: T.hairline }}/>
          </div>

          <div style={{ height: 56, borderRadius: 16, border: `1.5px solid ${T.primary}`, background: '#fff', padding: '0 18px', display: 'flex', alignItems: 'center', fontSize: 15, color: T.ink, justifyContent: 'space-between' }}>
            <span>marlon@hey.com</span>
            <I.check size={18} color={T.secondary}/>
          </div>
          <div style={{ height: 56, borderRadius: 16, border: `1px solid ${T.hairline}`, background: '#fff', padding: '0 18px', display: 'flex', alignItems: 'center', fontSize: 15, color: T.ink3 }}>
            Contraseña (mín. 8 caracteres)
          </div>
          <APButton variant="primary" size="lg" full>Crear cuenta</APButton>
        </div>

        <div style={{ marginTop: 'auto', fontSize: 11, color: T.ink3, lineHeight: 1.6, textAlign: 'center', paddingTop: 24 }}>
          Al continuar aceptas la <span style={{ textDecoration: 'underline' }}>política de privacidad</span> y los <span style={{ textDecoration: 'underline' }}>términos</span>. Tu historial nunca sale de tu móvil.
        </div>
      </div>
    </MobileShell>
  );
}

Object.assign(window, {
  SettingsMain, SettingsAliado, SettingsFaith,
  AuthLogin, AuthSignup,
});
