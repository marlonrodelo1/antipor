// Chat, Home, Journal, Anchors, Urge, Settings, Auth screens

// ═══════════════════ CHAT ═══════════════════
function ChatHeader({ dark }) {
  const ink = dark ? T.dkInk : T.ink;
  const muted = dark ? T.dkInk2 : T.ink3;
  const bg = dark ? T.dkBg : T.bg;
  const border = dark ? T.dkHairline : T.hairline;
  return (
    <div style={{
      paddingTop: 56, padding: '56px 16px 12px',
      background: bg, borderBottom: `1px solid ${border}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <I.chevronLeft size={24} color={muted}/>
      <Aliado size={36} state="rest" tone={dark ? 'night' : 'sage'} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: ink, letterSpacing: -0.1 }}>Aliado</div>
        <div style={{ fontSize: 11, color: T.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: T.secondary }}/>
          aquí, contigo
        </div>
      </div>
      <I.more size={22} color={muted}/>
    </div>
  );
}

function Bubble({ from, children, dark, action }) {
  const isAl = from === 'aliado';
  if (action) {
    return (
      <div style={{ alignSelf: 'flex-start', maxWidth: 280, marginLeft: 44 }}>
        <div style={{
          background: dark ? T.dkSurface2 : '#fff', border: `1px solid ${dark ? T.dkHairline : T.hairline}`,
          borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: T.secondary + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {action.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: dark ? T.dkInk : T.ink }}>{action.title}</div>
            <div style={{ fontSize: 11, color: dark ? T.dkInk2 : T.ink3 }}>{action.subtitle}</div>
          </div>
          <I.chevronRight size={16} color={dark ? T.dkInk2 : T.ink3}/>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', justifyContent: isAl ? 'flex-start' : 'flex-end', alignItems: 'flex-end', gap: 8 }}>
      {isAl && <Aliado size={28} state="rest" tone={dark ? 'night' : 'sage'} noAnim/>}
      <div style={{
        maxWidth: 280, padding: '12px 16px', borderRadius: 20,
        borderBottomLeftRadius: isAl ? 6 : 20, borderBottomRightRadius: isAl ? 20 : 6,
        background: isAl ? (dark ? T.dkSurface2 : '#fff') : T.primary,
        color: isAl ? (dark ? T.dkInk : T.ink) : '#fff',
        fontSize: 15, lineHeight: 1.45,
        border: isAl ? `1px solid ${dark ? T.dkHairline : T.hairline}` : 'none',
      }}>{children}</div>
    </div>
  );
}

function ChatComposer({ dark }) {
  const bg = dark ? T.dkBg : T.bg;
  const surf = dark ? T.dkSurface2 : '#fff';
  const border = dark ? T.dkHairline : T.hairline;
  const muted = dark ? T.dkInk2 : T.ink3;
  return (
    <div style={{ position: 'absolute', bottom: 34, left: 0, right: 0, padding: '12px 14px 10px', background: bg, borderTop: `1px solid ${border}` }}>
      {/* quick-replies */}
      <div style={{ display: 'flex', gap: 6, overflow: 'hidden', marginBottom: 10 }}>
        {['Estoy cansado', 'Me siento solo', 'Llévame fuera', 'No sé por qué'].map(q => (
          <div key={q} style={{
            padding: '8px 12px', fontSize: 13, color: dark ? T.dkInk : T.ink2,
            background: surf, border: `1px solid ${border}`, borderRadius: 99, whiteSpace: 'nowrap',
          }}>{q}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{
          flex: 1, height: 44, borderRadius: 22, background: surf, border: `1px solid ${border}`,
          padding: '0 16px', display: 'flex', alignItems: 'center',
          fontSize: 15, color: muted,
        }}>
          Mensaje
        </div>
        <button style={{
          width: 44, height: 44, borderRadius: 22, background: T.primary, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I.mic size={20} color="#fff"/>
        </button>
      </div>
    </div>
  );
}

function ChatScreen({ dark }) {
  return (
    <MobileShell dark={dark}>
      <div style={{ position: 'absolute', inset: 0, background: dark ? T.dkBg : T.bg, display: 'flex', flexDirection: 'column' }}>
        <ChatHeader dark={dark}/>
        <div style={{ flex: 1, padding: '20px 16px 220px', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
          <Bubble from="aliado" dark={dark}>Hola Marlon. ¿Qué tal estás llegando aquí ahora?</Bubble>
          <Bubble from="user" dark={dark}>Cansado. Mucho.</Bubble>
          <Bubble from="aliado" dark={dark}>Te creo. Llevas un día largo. ¿Hace cuánto que no comes algo decente?</Bubble>
          <Bubble from="user" dark={dark}>desde mediodía</Bubble>
          <Bubble from="aliado" dark={dark}>Eso pesa. El cansancio + hambre suelen disparar esto en ti, ya lo hemos visto.</Bubble>
          <Bubble from="aliado" dark={dark}>¿Qué te parece si paramos antes? Te pongo un timer corto para que comas algo y volvemos.</Bubble>
        </div>
        <ChatComposer dark={dark}/>
      </div>
    </MobileShell>
  );
}

function ChatScreenAction() {
  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: T.bg, display: 'flex', flexDirection: 'column' }}>
        <ChatHeader dark={false}/>
        <div style={{ flex: 1, padding: '20px 16px 220px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Bubble from="aliado">¿Necesitas salir de casa 10 minutos? Te abro la cámara y caminamos hasta el final de tu calle.</Bubble>
          <Bubble from="user">Vale</Bubble>
          <Bubble from="aliado">Te pongo el timer y te llamo cuando vuelvas.</Bubble>
          <Bubble from="aliado" action={{ icon: <I.timer size={18} color={T.secondary}/>, title: 'Timer · 10 minutos', subtitle: 'Camina sin móvil. Yo espero aquí.' }}/>
          <Bubble from="aliado" action={{ icon: <I.music size={18} color={T.primary}/>, title: 'Spotify · Caminata calma', subtitle: 'Playlist guardada · 32 min' }}/>
          <Bubble from="aliado">Cuando vuelvas, me cuentas cómo fue.</Bubble>
        </div>
        <ChatComposer dark={false}/>
      </div>
    </MobileShell>
  );
}

// ═══════════════════ HOME / TODAY ═══════════════════
function StreakPlant({ days = 14, size = 140 }) {
  // Organic plant — circles representing leaves growing as streak progresses
  const id = React.useId().replace(/[:]/g,'');
  const leaves = Math.min(7, Math.floor(days / 2) + 1);
  return (
    <svg width={size} height={size} viewBox="0 0 140 140">
      <defs>
        <radialGradient id={`pot-${id}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#EFC9B6"/>
          <stop offset="100%" stopColor="#D97757"/>
        </radialGradient>
      </defs>
      {/* pot */}
      <path d="M40 105 L100 105 L92 130 L48 130 Z" fill={`url(#pot-${id})`} />
      <ellipse cx="70" cy="105" rx="30" ry="4" fill="rgba(0,0,0,0.1)"/>
      {/* stem */}
      <path d="M70 105 Q68 80 70 60 Q72 40 70 28" stroke={T.secondary} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* leaves */}
      {Array.from({length: leaves}).map((_, i) => {
        const y = 100 - i * 12;
        const left = i % 2 === 0;
        return (
          <ellipse key={i} cx={left ? 56 : 84} cy={y} rx="14" ry="6" transform={`rotate(${left?-30:30} ${left?56:84} ${y})`} fill={T.secondary} opacity={0.85 - i*0.05}/>
        );
      })}
      {/* top bud */}
      <circle cx="70" cy="26" r="6" fill={T.accent}/>
    </svg>
  );
}

function HomeScreen({ dark = false, faith = false }) {
  const bg = dark ? T.dkBg : T.bg;
  const surf = dark ? T.dkSurface : '#fff';
  const ink = dark ? T.dkInk : T.ink;
  const muted = dark ? T.dkInk2 : T.ink3;
  const border = dark ? T.dkHairline : T.hairline;
  const moods = [
    { e: '😌', l: 'Calma' },
    { e: '😟', l: 'Inquieto' },
    { e: '😔', l: 'Triste' },
    { e: '😴', l: 'Cansado' },
    { e: '💪', l: 'Fuerte' },
  ];
  return (
    <MobileShell dark={dark}>
      <div style={{ position: 'absolute', inset: 0, background: bg, paddingTop: 56, paddingBottom: 130, overflow: 'hidden' }}>
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontSize: 13, color: muted, marginBottom: 4 }}>domingo, 27 abril</div>
          <div className="ap-h1" style={{ fontSize: 30, lineHeight: 1.15, color: ink, fontWeight: 500 }}>
            Buenos días, <em style={{ fontStyle: 'italic' }}>Marlon.</em>
          </div>
          <div style={{ fontSize: 14, color: muted, marginTop: 6, lineHeight: 1.5 }}>
            Hoy duermes mejor que la semana pasada. Buena señal.
          </div>
        </div>

        {/* Streak card */}
        <div style={{ margin: '20px 16px 0', padding: 22, borderRadius: 22, background: surf, border: `1px solid ${border}`, display: 'flex', gap: 16, alignItems: 'center' }}>
          <StreakPlant days={14} size={110}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.secondary, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6 }}>Tu racha</div>
            <div className="ap-h1" style={{ fontSize: 40, lineHeight: 1, color: ink, fontWeight: 500 }}>14 <span style={{ fontSize: 16, color: muted, fontWeight: 400 }}>días</span></div>
            <div style={{ fontSize: 12, color: muted, marginTop: 6, lineHeight: 1.4 }}>Tu mejor racha hasta ahora.</div>
          </div>
        </div>

        {/* Mood */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: ink, marginBottom: 12 }}>¿Cómo te sientes ahora?</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
            {moods.map((m, i) => (
              <button key={i} style={{
                flex: 1, padding: '12px 4px', borderRadius: 14, background: surf, border: `1px solid ${i===0 ? T.primary : border}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer',
              }}>
                <span style={{ fontSize: 22 }}>{m.e}</span>
                <span style={{ fontSize: 10, color: i===0 ? T.primary : muted, fontWeight: i===0 ? 600 : 400 }}>{m.l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reflection / verse */}
        <div style={{ margin: '20px 16px 0', padding: 22, borderRadius: 22, background: dark ? T.dkSurface2 : '#EAF1F8', border: `1px solid ${dark ? T.dkHairline : 'transparent'}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.primary, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            {faith ? <I.bookOpen size={13}/> : <I.feather size={13}/>}
            {faith ? 'Versículo del día' : 'Reflexión del día'}
          </div>
          <div className="ap-h1" style={{ fontSize: 19, lineHeight: 1.4, color: ink, fontWeight: 500, fontStyle: 'italic' }}>
            {faith
              ? '"Todo lo puedo en Cristo que me fortalece."'
              : 'Lo que resistes persiste. Lo que sientes se mueve.'}
          </div>
          <div style={{ fontSize: 12, color: muted, marginTop: 8 }}>
            {faith ? 'Filipenses 4:13' : 'Una cosa a la vez. Hoy: comer bien.'}
          </div>
        </div>
      </div>

      {/* sticky CTA — terracota only when high risk; here neutral but persistent */}
      <div style={{ position: 'absolute', bottom: 90, left: 16, right: 16, zIndex: 5 }}>
        <button style={{
          width: '100%', height: 56, borderRadius: 28, background: T.warm, color: '#fff',
          border: 'none', fontSize: 16, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 6px 20px rgba(217,119,87,0.35)',
        }}>
          <I.zap size={18}/>
          Tengo un impulso ahora
        </button>
      </div>

      <APTabBar active="home" dark={dark}/>
    </MobileShell>
  );
}

// ═══════════════════ JOURNAL ═══════════════════
function JournalMonth() {
  // Build a grid for April 2026 (start sun)
  const days = Array.from({length: 30}, (_, i) => i + 1);
  // status: 0 unknown, 1 clean (green), 2 resisted (amber), 3 relapse (terra), 4 future
  const statusFor = (d) => {
    if (d > 27) return 4;
    if ([5, 17].includes(d)) return 3;
    if ([3, 9, 14, 22].includes(d)) return 2;
    if (d > 4) return 1;
    return 0;
  };
  const colorFor = (s) => ({1: '#7BA888', 2: '#E8B96A', 3: '#D9775770'}[s] || 'transparent');

  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: T.bg, paddingTop: 56, paddingBottom: 100, overflow: 'auto' }}>
        <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <I.chevronLeft size={22} color={T.ink2}/>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Diario</div>
          <I.plus size={22} color={T.ink2}/>
        </div>
        <div style={{ padding: '20px 20px 0' }}>
          <div className="ap-h1" style={{ fontSize: 28, fontWeight: 500 }}>
            Abril <em style={{ fontStyle: 'italic', color: T.ink3 }}>2026</em>
          </div>
        </div>
        {/* calendar */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, fontSize: 11, color: T.ink3, textAlign: 'center', marginBottom: 8 }}>
            {['L','M','X','J','V','S','D'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {/* leading blanks: April 1 = wednesday → 2 blanks (M,T; week starts Monday) */}
            {Array.from({length: 2}).map((_,i) => <div key={`b${i}`}/>)}
            {days.map(d => {
              const s = statusFor(d);
              return (
                <div key={d} style={{
                  aspectRatio: '1', borderRadius: 12, background: colorFor(s),
                  border: s === 4 ? `1px dashed ${T.hairlineStrong}` : `1px solid ${T.hairline}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 500, color: s === 0 || s === 4 ? T.ink3 : (s === 1 ? '#fff' : T.ink),
                  position: 'relative',
                }}>
                  {d}
                  {d === 27 && <div style={{ position: 'absolute', inset: 0, borderRadius: 12, border: `2px solid ${T.primary}` }}/>}
                </div>
              );
            })}
          </div>
        </div>
        {/* legend */}
        <div style={{ padding: '20px 20px 0', display: 'flex', gap: 14, fontSize: 12, color: T.ink2, flexWrap: 'wrap' }}>
          {[
            { c: '#7BA888', l: 'Limpio' },
            { c: '#E8B96A', l: 'Impulso resistido' },
            { c: '#D9775770', l: 'Recaída' },
          ].map(x => (
            <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 4, background: x.c }}/>{x.l}
            </div>
          ))}
        </div>
        {/* current week summary */}
        <div style={{ margin: '24px 16px 0', padding: 18, borderRadius: 18, background: '#fff', border: `1px solid ${T.hairline}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.ink3, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>Esta semana</div>
          <div className="ap-h1" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.3 }}>
            5 limpios, 2 impulsos resistidos.
          </div>
          <div style={{ fontSize: 13, color: T.ink2, marginTop: 6, lineHeight: 1.5 }}>
            Sigues construyendo. Los domingos son tu día más sensible — lo notamos.
          </div>
        </div>
      </div>
      <APTabBar active="journal"/>
    </MobileShell>
  );
}

function JournalPatterns() {
  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: T.bg, paddingTop: 56, paddingBottom: 100, overflow: 'auto' }}>
        <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <I.chevronLeft size={22} color={T.ink2}/>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Patrones</div>
        </div>
        <div style={{ padding: '20px 20px 0' }}>
          <div className="ap-h1" style={{ fontSize: 26, fontWeight: 500, lineHeight: 1.2 }}>
            Lo que hemos <em style={{ fontStyle: 'italic' }}>aprendido juntos.</em>
          </div>
        </div>
        {/* hour heatmap */}
        <div style={{ margin: '20px 16px 0', padding: 18, borderRadius: 18, background: '#fff', border: `1px solid ${T.hairline}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.ink3, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 12 }}>Por hora del día</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100 }}>
            {[8,12,18,22,30,40,55,72,90,75,52,30,18,12,8,8,12,22,40,60,80,95,72,40].map((v, i) => (
              <div key={i} style={{ flex: 1, height: `${v}%`, background: v > 70 ? T.warm : v > 40 ? T.accent : T.secondary + '99', borderRadius: 3, opacity: v < 20 ? 0.4 : 1 }}/>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.ink3, marginTop: 8 }}>
            <span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>23h</span>
          </div>
        </div>
        {/* triggers */}
        <div style={{ margin: '16px 16px 0', padding: 18, borderRadius: 18, background: '#fff', border: `1px solid ${T.hairline}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.ink3, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 12 }}>Triggers principales</div>
          {[
            { l: 'Cansancio', v: 42, c: T.warm },
            { l: 'Soledad', v: 28, c: T.primary },
            { l: 'Aburrimiento', v: 18, c: T.accent },
            { l: 'Estrés laboral', v: 12, c: T.secondary },
          ].map(t => (
            <div key={t.l} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: T.ink }}>{t.l}</span>
                <span style={{ color: T.ink3 }}>{t.v}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: T.hairline, overflow: 'hidden' }}>
                <div style={{ width: `${t.v*2}%`, height: '100%', background: t.c, borderRadius: 3 }}/>
              </div>
            </div>
          ))}
        </div>
        {/* insight */}
        <div style={{ margin: '16px 16px 0', padding: 18, borderRadius: 18, background: '#EAF1F8' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.primary, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <I.sparkles size={13}/>Aliado nota
          </div>
          <div className="ap-h1" style={{ fontSize: 17, lineHeight: 1.45, color: T.ink, fontStyle: 'italic', fontWeight: 500 }}>
            "Sueles tener impulsos los domingos por la noche cuando registras 'aburrimiento'."
          </div>
        </div>
      </div>
      <APTabBar active="journal"/>
    </MobileShell>
  );
}

// ═══════════════════ ANCHORS ═══════════════════
function AnchorTile({ tag, color, children, big }) {
  return (
    <div style={{
      aspectRatio: big ? '1.4 / 1' : '1', borderRadius: 18, background: color, position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 14, color: '#fff',
    }}>
      {children}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.25)', letterSpacing: 0.4, textTransform: 'uppercase', backdropFilter: 'blur(8px)' }}>{tag}</span>
      </div>
    </div>
  );
}

function AnchorsGrid() {
  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: T.bg, paddingTop: 56, paddingBottom: 100, overflow: 'auto' }}>
        <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <I.chevronLeft size={22} color={T.ink2}/>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Mis anclas</div>
          <I.search size={22} color={T.ink2}/>
        </div>
        <div style={{ padding: '20px 20px 0' }}>
          <div className="ap-h1" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.2, marginBottom: 6 }}>
            Lo que <em style={{ fontStyle: 'italic' }}>te ata</em> aquí.
          </div>
          <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.5 }}>Aliado puede invocar uno cuando lo necesites.</div>
        </div>
        <div style={{ padding: '20px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ aspectRatio: '2 / 1', borderRadius: 18, background: 'linear-gradient(135deg,#7BA888,#3B6EA8)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 16, color: '#fff' }}>
              <I.image size={20} color="rgba(255,255,255,0.7)"/>
              <div>
                <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>Mateo, 4 años</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.25)', letterSpacing: 0.4, textTransform: 'uppercase' }}>Familia</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>foto</span>
                </div>
              </div>
            </div>
          </div>
          <AnchorTile tag="Salud" color="#D97757">
            <I.heart size={20} color="rgba(255,255,255,0.7)" style={{ marginBottom: 'auto' }}/>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Volver al gimnasio en mayo.</div>
          </AnchorTile>
          <AnchorTile tag="Audio" color={T.primary}>
            <I.volume size={20} color="rgba(255,255,255,0.7)" style={{ marginBottom: 'auto' }}/>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Voz de mamá · 0:34</div>
          </AnchorTile>
          <AnchorTile tag="Fe" color="#5B86B6">
            <I.bookOpen size={20} color="rgba(255,255,255,0.7)" style={{ marginBottom: 'auto' }}/>
            <div style={{ fontSize: 13, fontWeight: 600, fontStyle: 'italic', lineHeight: 1.35, marginBottom: 6 }}>"No me dejes caer en tentación."</div>
          </AnchorTile>
          <AnchorTile tag="Futuro" color={T.secondary}>
            <I.calendar size={20} color="rgba(255,255,255,0.7)" style={{ marginBottom: 'auto' }}/>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Boda con Lara, sept 2027</div>
          </AnchorTile>
        </div>
      </div>
      {/* FAB */}
      <button style={{
        position: 'absolute', bottom: 110, right: 20, zIndex: 5,
        width: 56, height: 56, borderRadius: 28, background: T.ink, color: '#fff', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
      }}>
        <I.plus size={24}/>
      </button>
      <APTabBar active="journal"/>
    </MobileShell>
  );
}

function AnchorsDetail() {
  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: T.bg, paddingBottom: 100 }}>
        {/* hero image area */}
        <div style={{ height: 380, background: 'linear-gradient(135deg,#7BA888,#3B6EA8)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 60, left: 16, width: 36, height: 36, borderRadius: 18, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I.chevronLeft size={20} color="#fff"/>
          </div>
          <div style={{ position: 'absolute', top: 60, right: 16, width: 36, height: 36, borderRadius: 18, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I.more size={20} color="#fff"/>
          </div>
        </div>
        <div style={{ padding: '24px 24px 0' }}>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: '#EAF1F8', color: T.primary, letterSpacing: 0.4, textTransform: 'uppercase' }}>Familia</span>
          <div className="ap-h1" style={{ fontSize: 30, fontWeight: 500, marginTop: 14, lineHeight: 1.15 }}>
            Mateo, <em style={{ fontStyle: 'italic' }}>4 años.</em>
          </div>
          <div style={{ fontSize: 15, color: T.ink2, lineHeight: 1.6, marginTop: 12 }}>
            Quiere que su papá juegue con él los sábados. No quiere a un papá ausente. Eso es por lo que estoy aquí.
          </div>
        </div>
        <div style={{ margin: '20px 20px 0', padding: 18, borderRadius: 18, background: '#FBF8F3', border: `1px solid ${T.hairline}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.ink3, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <I.zap size={13}/> Invocada
          </div>
          <div style={{ fontSize: 14, color: T.ink2 }}>3 veces este mes · siempre en momentos críticos.</div>
        </div>
      </div>
      <APTabBar active="journal"/>
    </MobileShell>
  );
}

// ═══════════════════ URGE SURFING ═══════════════════
function UrgeBreathe() {
  const id = React.useId().replace(/[:]/g,'');
  React.useEffect(() => {
    const s = document.createElement('style');
    s.textContent = `
      @keyframes ub-${id} { 0%,100% { transform: scale(0.7); } 50% { transform: scale(1.15); } }
      @keyframes ubo-${id} { 0%,100% { transform: scale(0.85); opacity: 0.4 } 50% { transform: scale(1.25); opacity: 0.8 } }
    `;
    document.head.appendChild(s);
    return () => s.remove();
  }, [id]);
  return (
    <MobileShell dark>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 35%, #1F3A5C 0%, #0F1419 70%)' }}>
        <div style={{ paddingTop: 56, padding: '56px 20px 100px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', paddingTop: 10 }}>
            <I.x size={22} color="rgba(255,255,255,0.6)"/>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontVariantNumeric: 'tabular-nums' }}>2:34 / 5:00</div>
            <I.volume size={22} color="rgba(255,255,255,0.6)"/>
          </div>

          <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle, ${T.primary}40 0%, transparent 70%)`, animation: `ubo-${id} 8s ease-in-out infinite` }}/>
            <div style={{ width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #5B86B6, #2C5485)`, boxShadow: '0 0 80px rgba(91,134,182,0.4)', animation: `ub-${id} 8s ease-in-out infinite`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 500, letterSpacing: 0.4 }}>Inhala</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', maxWidth: 320 }}>
            <div className="ap-h1" style={{ fontSize: 22, color: '#fff', lineHeight: 1.35, fontWeight: 400 }}>
              <em style={{ fontStyle: 'italic' }}>Inhala 4 ·</em> sostén 7 · exhala 8.
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 14, lineHeight: 1.55 }}>
              Tu cuerpo se calma. La ola siempre baja.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button style={{ width: 48, height: 48, borderRadius: 24, background: 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <I.pause size={18} color="#fff"/>
            </button>
            <button style={{ padding: '0 26px', height: 48, borderRadius: 24, background: '#fff', color: T.ink, border: 'none', fontSize: 14, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer' }}>
              Listo, terminar
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

function UrgeDone() {
  return (
    <MobileShell>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, #DCE9DC 0%, ${T.bg} 60%)` }}>
        <div style={{ paddingTop: 56, padding: '120px 28px 36px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Aliado size={120} state="speaking" tone="sage"/>
          <div className="ap-h1" style={{ fontSize: 34, lineHeight: 1.15, color: T.ink, marginTop: 36, fontWeight: 500, textAlign: 'center' }}>
            Lo lograste.<br/><em style={{ fontStyle: 'italic', color: T.secondary }}>Has surfeado la ola.</em>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.55, color: T.ink2, marginTop: 16, textAlign: 'center', maxWidth: 320 }}>
            Esa sensación que tenías hace 5 minutos, ya no está. ¿Cómo te sientes ahora?
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 28 }}>
            {['Calmado', 'Aliviado', 'Cansado', 'Orgulloso'].map(m => (
              <APPill key={m}>{m}</APPill>
            ))}
          </div>

          <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <APButton variant="primary" size="lg" full>Registrar cómo me siento</APButton>
            <APButton variant="ghost" size="md" full>Volver al inicio</APButton>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

Object.assign(window, {
  ChatScreen, ChatScreenAction,
  HomeScreen, JournalMonth, JournalPatterns,
  AnchorsGrid, AnchorsDetail,
  UrgeBreathe, UrgeDone,
});
