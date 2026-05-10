// App entry — mounts the design canvas and pulls all the artboards together.

const { DesignCanvas, DCSection, DCArtboard, DCPostIt } = window;

function AntiportApp() {
  return (
    <DesignCanvas minScale={0.15} maxScale={3}>

      <DCSection id="overview" title="Antiport" subtitle="App móvil de acompañamiento conversacional · v1 hi-fi · móvil + landing + emails + panel web">
        <DCArtboard id="cover" label="Visión" width={780} height={520}>
          <CoverCard />
        </DCArtboard>
        <DCArtboard id="palette" label="Sistema visual" width={520} height={520}>
          <PaletteCard />
        </DCArtboard>
        <DCArtboard id="aliado-states" label="Aliado · 3 estados" width={620} height={520}>
          <AliadoStatesCard />
        </DCArtboard>
      </DCSection>

      <DCSection id="landing" title="A · Landing pública" subtitle="antiport.app — desktop + mobile">
        <DCArtboard id="landing-desktop" label="Landing · desktop" width={1280} height={3200}>
          <LandingDesktop />
        </DCArtboard>
        <DCArtboard id="landing-mobile" label="Landing · mobile" width={402} height={1800}>
          <LandingMobile />
        </DCArtboard>
      </DCSection>

      <DCSection id="onboarding" title="B · Onboarding" subtitle="5 pantallas clave de las 7 — secuencial">
        <DCArtboard id="ob-1" label="1 · Bienvenida" width={402} height={874}><OnboardingWelcome /></DCArtboard>
        <DCArtboard id="ob-2" label="2 · Nombre" width={402} height={874}><OnboardingName /></DCArtboard>
        <DCArtboard id="ob-3" label="3 · Qué te trae" width={402} height={874}><OnboardingMotivation /></DCArtboard>
        <DCArtboard id="ob-4" label="4 · Capa espiritual" width={402} height={874}><OnboardingFaith /></DCArtboard>
        <DCArtboard id="ob-5" label="5 · Permisos" width={402} height={874}><OnboardingPermissions /></DCArtboard>
      </DCSection>

      <DCSection id="intervention" title="C · Pantalla de intervención" subtitle="LA pantalla crítica · 3 modos seleccionables en ajustes">
        <DCArtboard id="iv-conversational" label="C1 · Conversacional" width={402} height={874}><InterventionConversational /></DCArtboard>
        <DCArtboard id="iv-short" label="C2 · Corta" width={402} height={874}><InterventionShort /></DCArtboard>
        <DCArtboard id="iv-silent" label="C3 · Silenciosa (solo respiración)" width={402} height={874}><InterventionSilent /></DCArtboard>
        <DCArtboard id="iv-friction" label="C4 · Fricción de salida" width={402} height={874}><InterventionFriction /></DCArtboard>
      </DCSection>

      <DCSection id="chat" title="D · Conversación con Aliado">
        <DCArtboard id="chat-light" label="Chat · claro" width={402} height={874}><ChatScreen dark={false} /></DCArtboard>
        <DCArtboard id="chat-dark" label="Chat · oscuro" width={402} height={874}><ChatScreen dark={true} /></DCArtboard>
        <DCArtboard id="chat-action" label="Chat · acción ejecutada" width={402} height={874}><ChatScreenAction /></DCArtboard>
      </DCSection>

      <DCSection id="home" title="E · Home / Hoy">
        <DCArtboard id="home-light" label="Hoy · claro" width={402} height={874}><HomeScreen dark={false} /></DCArtboard>
        <DCArtboard id="home-dark" label="Hoy · oscuro" width={402} height={874}><HomeScreen dark={true} /></DCArtboard>
        <DCArtboard id="home-faith" label="Hoy · capa espiritual on" width={402} height={874}><HomeScreen dark={false} faith={true} /></DCArtboard>
      </DCSection>

      <DCSection id="journal" title="F · Diario / Progreso">
        <DCArtboard id="journal-month" label="Mes" width={402} height={874}><JournalMonth /></DCArtboard>
        <DCArtboard id="journal-patterns" label="Patrones" width={402} height={874}><JournalPatterns /></DCArtboard>
      </DCSection>

      <DCSection id="anchors" title="G · Mis anclas">
        <DCArtboard id="anchors-grid" label="Grid" width={402} height={874}><AnchorsGrid /></DCArtboard>
        <DCArtboard id="anchors-detail" label="Detalle" width={402} height={874}><AnchorsDetail /></DCArtboard>
      </DCSection>

      <DCSection id="urge" title="H · Urge surfing">
        <DCArtboard id="urge-breathe" label="Respiración 4-7-8" width={402} height={874}><UrgeBreathe /></DCArtboard>
        <DCArtboard id="urge-done" label="Lo lograste" width={402} height={874}><UrgeDone /></DCArtboard>
      </DCSection>

      <DCSection id="settings" title="I · Ajustes">
        <DCArtboard id="settings-main" label="Principal" width={402} height={874}><SettingsMain /></DCArtboard>
        <DCArtboard id="settings-aliado" label="Aliado" width={402} height={874}><SettingsAliado /></DCArtboard>
        <DCArtboard id="settings-faith" label="Capa espiritual" width={402} height={874}><SettingsFaith /></DCArtboard>
      </DCSection>

      <DCSection id="auth" title="J · Auth">
        <DCArtboard id="auth-login" label="Login" width={402} height={874}><AuthLogin /></DCArtboard>
        <DCArtboard id="auth-signup" label="Crear cuenta" width={402} height={874}><AuthSignup /></DCArtboard>
      </DCSection>

      <DCSection id="email" title="K · Emails (Resend)" subtitle="Plantillas HTML mobile-friendly">
        <DCArtboard id="email-welcome" label="Bienvenida" width={600} height={780}><EmailWelcome /></DCArtboard>
        <DCArtboard id="email-inactivity" label="Inactividad 7 días" width={600} height={620}><EmailInactivity /></DCArtboard>
        <DCArtboard id="email-weekly" label="Resumen semanal" width={600} height={920}><EmailWeekly /></DCArtboard>
      </DCSection>

      <DCSection id="web" title="L · Panel web">
        <DCArtboard id="web-dashboard" label="Dashboard" width={1280} height={820}><WebDashboard /></DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AntiportApp />);
