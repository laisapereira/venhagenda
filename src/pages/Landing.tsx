import { useState, CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Brand'
import { T } from '../theme/terra'

// Landing pública (/). Base visual: 1ª versão do protótipo no Claude Design
// (paleta quente, passo a passo numerado), na paleta Terra do app e do logo.
// Textos fiéis ao produto de hoje: número central, sem QR code, sem preço publicado.

const GREEN = T.green
const SAGE = T.sage
const SAGE_SOFT = T.sageSoft
const MUTED = T.inkSoft

const wrap: CSSProperties = { maxWidth: 1120, margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }
const h2: CSSProperties = {
  fontFamily: T.heading, fontWeight: 700, fontSize: 'clamp(30px,4.2vw,44px)', lineHeight: 1.1,
  letterSpacing: -0.5, margin: '0 0 12px', textAlign: 'center', color: T.ink, textWrap: 'balance',
}
const lead: CSSProperties = { textAlign: 'center', color: MUTED, fontSize: 16.5, lineHeight: 1.55, margin: '0 auto 44px', maxWidth: 560 }

const css = `
.lp a{text-decoration:none}
.lp-cta{display:inline-flex;align-items:center;gap:10px;background:${T.primary};color:${T.primaryInk};font-weight:800;font-size:17px;padding:17px 30px;border-radius:14px;box-shadow:0 12px 28px rgba(168,80,47,.28);transition:background .15s,transform .15s}
.lp-cta:hover{background:#923F22;transform:translateY(-1px)}
.lp-cta-light{background:#fff;color:${T.primary};box-shadow:none}
.lp-cta-light:hover{background:${T.primaryInk};color:#923F22}
.lp-pill{white-space:nowrap;font-weight:800;font-size:14px;color:${T.ink};border:2px solid ${T.line};padding:9px 18px;border-radius:999px;transition:border-color .15s}
.lp-pill:hover{border-color:${T.primary}}
.lp-text{font-weight:700;font-size:14px;color:${MUTED}}
.lp-text:hover{color:${T.ink}}
.lp-btn{display:block;text-align:center;font-weight:800;font-size:16px;padding:15px;border-radius:12px;transition:background .15s,color .15s,border-color .15s}
.lp-btn-solid{background:${T.primary};color:${T.primaryInk}}
.lp-btn-solid:hover{background:#923F22}
.lp-btn-ghost{background:#fff;color:${T.ink};border:2px solid ${T.line};padding:13px}
.lp-btn-ghost:hover{border-color:${T.primary}}
.lp a:focus-visible,.lp button:focus-visible{outline:3px solid ${GREEN};outline-offset:3px}
.lp-faq button{width:100%;display:flex;justify-content:space-between;align-items:center;gap:16px;background:none;border:none;cursor:pointer;padding:20px 4px;text-align:left;font:700 17px ${T.body};color:${T.ink}}
@keyframes lpUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes lpPop{0%{opacity:0;transform:translateY(10px) scale(.96)}100%{opacity:1;transform:none}}
.lp-up{animation:lpUp .6s ease both}
.lp-pop{animation:lpPop .5s .9s ease both}
@media (prefers-reduced-motion:reduce){.lp-up,.lp-pop{animation:none}}
`

const PAINS = [
  { title: 'Mensagem fora do horário', text: 'A cliente chama às 22h, você só vê de manhã. E ela já marcou com outra.' },
  { title: 'A mesma pergunta o dia todo', text: '"Tem horário quinta?" no meio do atendimento, várias vezes por dia.' },
  { title: 'Cliente que esquece', text: 'Sem lembrete, a cliente não aparece. Horário vazio é dinheiro que não volta.' },
]

const STEPS = [
  { title: 'Crie seu estúdio', text: 'Nome, link e senha. Leva 1 minuto.' },
  { title: 'Defina horários e seu WhatsApp', text: 'Dias de atendimento e o número onde você recebe os avisos.' },
  { title: 'Cadastre seus serviços', text: 'Preço e duração. Já vem com exemplos pra você editar.' },
  { title: 'Mande seu link', text: 'A cliente agenda sozinha. O WhatsApp avisa vocês duas.' },
]

const FEATURES = [
  'Página de agendamento com o seu link',
  'Confirmação e lembrete 2 dias antes, no WhatsApp da cliente',
  'Aviso pra você a cada agendamento, remarcação ou cancelamento',
  'Resumo da agenda do dia, toda manhã',
  'Bloqueio de folgas, feriados e viagens',
  'Cliente remarca ou cancela sozinha, sem criar conta',
]

const FAQS = [
  { q: 'Preciso configurar alguma coisa no WhatsApp?', a: 'Não. Os avisos saem de um número central do venhagenda. Você só informa o número onde quer receber os seus.' },
  { q: 'Minha cliente precisa baixar app ou criar conta?', a: 'Não. Ela agenda pelo seu link e depois acompanha, remarca ou cancela só com o número de telefone. Zero login, zero senha.' },
  { q: 'Preciso saber mexer com tecnologia?', a: 'Não. Se você usa WhatsApp, consegue configurar: é preencher nome, horários e serviços. E funciona bem no celular.' },
  { q: 'E se eu tirar folga ou viajar?', a: 'Você bloqueia os dias no painel (um dia ou um período inteiro) e esses horários somem da agenda na hora.' },
]

export default function Landing() {
  const [open, setOpen] = useState(0)

  return (
    <div className="lp" style={{ background: T.bg, color: T.ink, fontFamily: T.body, minHeight: '100vh' }}>
      <style>{css}</style>

      {/* topo */}
      <header style={{ background: T.surface, borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, height: 72 }}>
          <Logo size={20} />
          <nav style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,3vw,24px)' }}>
            <Link to="/login" className="lp-text">Entrar</Link>
            <Link to="/setup" className="lp-pill">Criar grátis</Link>
          </nav>
        </div>
      </header>

      {/* hero */}
      <section style={{ background: `linear-gradient(180deg, ${T.surface} 0%, ${T.bg} 100%)` }}>
        <div style={{ ...wrap, paddingTop: 'clamp(40px,7vw,88px)', paddingBottom: 'clamp(56px,8vw,104px)', display: 'flex', flexWrap: 'wrap', gap: 'clamp(40px,6vw,80px)', alignItems: 'center' }}>
          <div className="lp-up" style={{ flex: '1 1 420px', minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.primarySoft, color: '#8A3F22', fontWeight: 800, fontSize: 13, padding: '7px 16px', borderRadius: 999, marginBottom: 22 }}>
              <Icon name="sparkle" size={15} color="#8A3F22" sw={2} />
              Para manicures, lash, sobrancelha, cabelo e estética
            </div>
            <h1 style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 'clamp(40px,6.2vw,68px)', lineHeight: 1.02, letterSpacing: -1, margin: '0 0 22px', textWrap: 'balance' }}>
              Sua cliente marca o horário sozinha, <span style={{ color: T.primary, fontStyle: 'italic' }}>enquanto você atende.</span>
            </h1>
            <p style={{ fontSize: 'clamp(17px,1.7vw,19px)', lineHeight: 1.6, color: MUTED, margin: '0 0 34px', maxWidth: 520 }}>
              Um link de agendamento que confirma, lembra e avisa pelo WhatsApp. Pronto em 5 minutos, sem instalar nada e sem trocar de número.
            </p>
            <Link to="/setup" className="lp-cta">
              Criar meu estúdio grátis <Icon name="arrowRight" size={19} color="currentColor" sw={2.2} />
            </Link>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', marginTop: 18, fontSize: 13.5, fontWeight: 700, color: MUTED }}>
              {['sem cartão de crédito', 'sem login pra cliente', 'feito pro celular'].map(t => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="check" size={15} color={SAGE} sw={2.4} />{t}
                </span>
              ))}
            </div>
          </div>

          <div className="lp-up" style={{ flex: '1 1 340px', display: 'flex', justifyContent: 'center', animationDelay: '.15s' }}>
            <BookingPreview />
          </div>
        </div>
      </section>

      {/* problema */}
      <section style={{ padding: 'clamp(56px,8vw,96px) 0' }}>
        <div style={wrap}>
          <h2 style={h2}>Você reconhece isso?</h2>
          <p style={lead}>Você não perde cliente por preço. Perde por demora.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {PAINS.map((p, i) => (
              <div key={p.title} style={{ background: T.surface, borderRadius: 20, padding: 30, border: `1px solid ${T.lineSoft}` }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: T.primarySoft, color: '#8A3F22', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  0{i + 1}
                </div>
                <h3 style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 24, margin: '0 0 8px', lineHeight: 1.15 }}>{p.title}</h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: MUTED }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* como funciona */}
      <section style={{ background: T.surfaceAlt, padding: 'clamp(56px,8vw,96px) 0' }}>
        <div style={wrap}>
          <h2 style={h2}>No ar em 5 minutos</h2>
          <p style={lead}>Sem técnico, sem instalação, sem configurar WhatsApp.</p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 32 }}>
            {STEPS.map((s, i) => (
              <li key={s.title} style={{ textAlign: 'center' }}>
                <div aria-hidden="true" style={{ width: 60, height: 60, borderRadius: '50%', background: i === STEPS.length - 1 ? GREEN : T.primary, color: '#fff', fontFamily: T.heading, fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                  {i + 1}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 17, margin: '0 0 8px' }}>{s.title}</h3>
                <p style={{ margin: '0 auto', fontSize: 15, lineHeight: 1.55, color: MUTED, maxWidth: 240 }}>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* prova */}
      <section style={{ padding: 'clamp(56px,8vw,96px) 0' }}>
        <div style={wrap}>
          <div style={{ background: GREEN, color: '#F3ECE4', borderRadius: 28, padding: 'clamp(32px,5vw,56px)', display: 'flex', flexWrap: 'wrap', gap: 'clamp(20px,4vw,48px)', alignItems: 'center' }}>
            <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 'clamp(72px,11vw,120px)', lineHeight: 0.9, color: '#F2C9A8', flexShrink: 0 }}>8h</div>
            <p style={{ flex: '1 1 320px', margin: 0, fontFamily: T.heading, fontWeight: 600, fontSize: 'clamp(24px,2.8vw,32px)', lineHeight: 1.25, textWrap: 'pretty' }}>
              por semana de volta pra manicure que inspirou o venhagenda: o tempo que ela gastava respondendo mensagem pra marcar horário.
            </p>
          </div>
        </div>
      </section>

      {/* plano */}
      <section style={{ background: T.surfaceAlt, padding: 'clamp(56px,8vw,96px) 0' }}>
        <div style={wrap}>
          <h2 style={h2}>Comece grátis, com tudo funcionando</h2>
          <p style={lead}>Sem cartão e sem fidelidade.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', alignItems: 'stretch' }}>
            <div style={{ flex: '1 1 320px', maxWidth: 460, background: T.surface, borderRadius: 22, padding: 34, border: `3px solid ${T.primary}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -14, left: 30, background: T.primary, color: T.primaryInk, fontWeight: 800, fontSize: 12, letterSpacing: 0.5, padding: '5px 14px', borderRadius: 999 }}>COMECE POR AQUI</div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>Grátis</div>
              <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 52, lineHeight: 1, marginBottom: 22 }}>R$ 0</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 15, lineHeight: 1.45 }}>
                {FEATURES.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Icon name="check" size={18} color={T.primary} sw={2.4} style={{ flexShrink: 0, marginTop: 1 }} />{f}
                  </li>
                ))}
              </ul>
              <Link to="/setup" className="lp-btn lp-btn-solid">Criar meu estúdio grátis</Link>
            </div>
            <div style={{ flex: '1 1 320px', maxWidth: 460, background: T.surface, borderRadius: 22, padding: 34, border: `1px solid ${T.line}`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: SAGE_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <Icon name="whatsapp" size={24} color={GREEN} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>Número próprio</div>
              <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 32, lineHeight: 1.1, marginBottom: 14 }}>Os avisos saindo do WhatsApp do seu estúdio</div>
              <p style={{ margin: '0 0 28px', fontSize: 15, lineHeight: 1.6, color: MUTED, flex: 1 }}>
                Pra quem quer que a cliente receba tudo do número do próprio estúdio. A gente configura com você.
              </p>
              <Link to="/setup" className="lp-btn lp-btn-ghost">Começar pelo grátis</Link>
            </div>
          </div>
        </div>
      </section>

      {/* faq */}
      <section style={{ padding: 'clamp(56px,8vw,96px) 0' }}>
        <div style={{ ...wrap, maxWidth: 820 }}>
          <h2 style={{ ...h2, marginBottom: 32 }}>Perguntas frequentes</h2>
          <div className="lp-faq">
            {FAQS.map((f, i) => {
              const isOpen = open === i
              return (
                <div key={f.q} style={{ borderBottom: `1px solid ${T.line}` }}>
                  <button type="button" aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                    {f.q}
                    <span aria-hidden="true" style={{ flex: 'none', width: 28, height: 28, borderRadius: '50%', background: T.primarySoft, color: '#8A3F22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <p id={`faq-${i}`} style={{ margin: 0, padding: '0 4px 22px', fontSize: 15.5, lineHeight: 1.6, color: MUTED, maxWidth: 660 }}>{f.a}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* cta final */}
      <section style={{ background: T.primary, color: T.primaryInk, padding: 'clamp(56px,8vw,88px) 0', textAlign: 'center' }}>
        <div style={wrap}>
          <h2 style={{ ...h2, color: '#fff', fontSize: 'clamp(32px,4.6vw,50px)', maxWidth: 720, margin: '0 auto 14px' }}>
            Pronta pra parar de marcar horário na mão?
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: 17, color: '#F7DDCD' }}>5 minutos, sem cartão, sem técnico.</p>
          <Link to="/setup" className="lp-cta lp-cta-light">
            Criar meu estúdio grátis <Icon name="arrowRight" size={19} color="currentColor" sw={2.2} />
          </Link>
        </div>
      </section>

      <footer style={{ background: T.surface }}>
        <div style={{ ...wrap, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 24, paddingBottom: 24, fontSize: 14 }}>
          <span style={{ color: MUTED }}>venhagenda · feito pra quem cuida de gente</span>
          <Link to="/meus-agendamentos" className="lp-text">Já agendei: ver meus horários</Link>
        </div>
      </footer>
    </div>
  )
}

/* Prévia do que a cliente vê em /book/:slug (mesmos tokens da página real). */
function BookingPreview() {
  const slots = ['09:00', '10:30', '13:00', '14:30', '15:30', '17:00']
  const days = [{ d: 'qui', n: 13 }, { d: 'sex', n: 14 }, { d: 'seg', n: 17 }, { d: 'ter', n: 18 }]
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 360, paddingBottom: 58 }} role="img" aria-label="Prévia da página de agendamento: a cliente escolhe o dia e o horário, e você recebe o aviso no WhatsApp">
      <div aria-hidden="true" style={{ background: T.surface, borderRadius: 32, border: `1px solid ${T.line}`, boxShadow: '0 30px 70px rgba(58,36,26,.16)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 14px', borderBottom: `1px solid ${T.lineSoft}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 0.4, textTransform: 'uppercase' }}>venhagenda.com.br/book/studio-bella</div>
          <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 24, marginTop: 4 }}>Studio Bella</div>
          <div style={{ display: 'flex', gap: 5, marginTop: 12 }}>
            {[0, 1, 2, 3].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= 1 ? T.primary : T.lineSoft }} />)}
          </div>
        </div>
        <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: T.primarySoft, border: `1.5px solid ${T.primary}`, borderRadius: T.radius, padding: '11px 13px' }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="hand" size={21} color={T.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Pé + Mão</div>
              <div style={{ fontSize: 12.5, color: MUTED }}>1h25 · R$ 45</div>
            </div>
            <Icon name="check" size={18} color={T.primary} sw={2.4} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: MUTED, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>Escolha o dia</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7 }}>
              {days.map((x, i) => {
                const sel = i === 1
                return (
                  <div key={x.n} style={{ textAlign: 'center', padding: '8px 0', borderRadius: 12, background: sel ? T.primary : T.surface, color: sel ? T.primaryInk : T.ink, border: `1.5px solid ${sel ? T.primary : T.line}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>{x.d}</div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{x.n}</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: MUTED, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>Horários livres</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
              {slots.map(s => {
                const sel = s === '15:30'
                return (
                  <div key={s} style={{ textAlign: 'center', padding: '9px 0', borderRadius: 11, fontWeight: 700, fontSize: 14, background: sel ? T.primarySoft : T.surface, color: sel ? '#8A3F22' : T.ink, border: `1.5px solid ${sel ? T.primary : T.line}` }}>{s}</div>
                )
              })}
            </div>
          </div>
          <div style={{ background: T.primary, color: T.primaryInk, borderRadius: T.radius, padding: '13px', textAlign: 'center', fontWeight: 800, fontSize: 15 }}>
            Confirmar sexta, 15:30
          </div>
        </div>
      </div>

      {/* aviso que chega pra dona */}
      <div aria-hidden="true" className="lp-pop" style={{ position: 'absolute', left: 'clamp(-28px,-4vw,-8px)', right: 24, bottom: 0, background: T.surface, borderRadius: 18, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 16px 40px rgba(31,74,69,.22)', border: `1px solid ${T.lineSoft}` }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="whatsapp" size={21} color="#fff" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: SAGE }}>WhatsApp · agora</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.35 }}>Novo agendamento: Carla, sex 15:30</div>
        </div>
      </div>
    </div>
  )
}
