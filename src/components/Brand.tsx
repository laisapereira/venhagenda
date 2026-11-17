import { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { T } from '../theme/terra'

/* Peças de marca compartilhadas pela landing, login, setup e painéis,
   pra todas as páginas terem o mesmo logo, topo, largura e tipografia. */

export function Logo({ light = false, size = 22, to = '/' }: { light?: boolean; size?: number; to?: string | null }) {
  const content = (
    <>
      {light
        ? <span style={{ background: '#FAF4EE', borderRadius: size * 0.5, padding: size * 0.22, display: 'flex' }}>
            <img src="/agenda_icon.png" alt="" style={{ height: size * 1.3, display: 'block' }} />
          </span>
        : <img src="/agenda_icon.png" alt="" style={{ height: size * 1.55, display: 'block' }} />}
      <span style={{ fontFamily: T.body, fontWeight: 800, fontSize: size, letterSpacing: -0.4, color: light ? '#fff' : T.green, lineHeight: 1 }}>venhagenda</span>
    </>
  )
  const style: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: size * 0.45, textDecoration: 'none' }
  return to === null
    ? <span style={style}>{content}</span>
    : <Link to={to} aria-label="venhagenda, início" style={style}>{content}</Link>
}

/** Container centralizado com o mesmo respiro lateral da landing. */
export function Container({ children, max = T.maxWidth, style }: { children: ReactNode; max?: number; style?: CSSProperties }) {
  return <div style={{ maxWidth: max, margin: '0 auto', padding: '0 clamp(16px,5vw,56px)', width: '100%', ...style }}>{children}</div>
}

/** Barra branca do topo: logo à esquerda, ações à direita. */
export function TopBar({ right, left, max }: { right?: ReactNode; left?: ReactNode; max?: number }) {
  return (
    <header style={{ background: T.surface, borderBottom: `1px solid ${T.lineSoft}`, flexShrink: 0 }}>
      <Container max={max} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 68 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          {left}
          <Logo size={20} />
        </div>
        {right && <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px,2.5vw,20px)', flexShrink: 0 }}>{right}</div>}
      </Container>
    </header>
  )
}

/** Título de página: rótulo pequeno + título em Cormorant + linha de apoio. */
export function PageTitle({ eyebrow, title, sub, align = 'left' }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; align?: 'left' | 'center' }) {
  return (
    <div style={{ textAlign: align }}>
      {eyebrow && <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: T.primaryText, marginBottom: 6 }}>{eyebrow}</div>}
      <h1 style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 'clamp(30px,4vw,42px)', lineHeight: 1.05, letterSpacing: -0.5, color: T.ink, margin: 0 }}>{title}</h1>
      {sub && <p style={{ fontSize: 15.5, lineHeight: 1.55, color: T.inkSoft, margin: '10px 0 0' }}>{sub}</p>}
    </div>
  )
}

/* ---------- folhas / modais ---------- */

const SHEET_CSS = `
.vh-overlay{position:fixed;inset:0;background:rgba(30,18,14,.42);z-index:50;display:flex;align-items:flex-end;justify-content:center}
.vh-sheet{width:100%;max-height:92vh;overflow:auto}
@media (min-width:720px){
  .vh-overlay{align-items:center;padding:32px}
  .vh-sheet > *{border-radius:24px !important;padding-bottom:28px !important}
}
`

/** Folha que sobe do rodapé no celular e vira janela centralizada no desktop. */
export function SheetOverlay({ children, onClose, max = 560 }: { children: ReactNode; onClose: () => void; max?: number }) {
  return (
    <div className="vh-overlay" onClick={onClose}>
      <style>{SHEET_CSS}</style>
      <div className="vh-sheet" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{ maxWidth: max }}>
        {children}
      </div>
    </div>
  )
}

/* ---------- formulários ---------- */

export const fieldStyle: CSSProperties = {
  width: '100%', padding: '14px 16px', border: `1.5px solid ${T.line}`, borderRadius: 12,
  fontSize: 16, color: T.ink, background: T.surface, fontFamily: T.body, outline: 'none',
}

export const labelStyle: CSSProperties = {
  display: 'block', fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 7,
}

export function primaryButtonStyle(disabled = false): CSSProperties {
  return {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    background: T.primary, color: T.primaryInk, border: 'none', borderRadius: 14,
    padding: '16px', fontSize: 16.5, fontWeight: 800, fontFamily: T.body,
    cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.55 : 1,
    boxShadow: disabled ? 'none' : '0 12px 28px rgba(168,80,47,.25)',
  }
}

export function ErrorBox({ children }: { children: ReactNode }) {
  return (
    <div role="alert" style={{ background: '#FDECEA', color: '#8F2A1F', border: '1px solid #F3B9B0', borderRadius: 12, padding: '12px 14px', fontSize: 14.5, marginBottom: 20 }}>
      {children}
    </div>
  )
}

/* ---------- login / setup ---------- */

const AUTH_CSS = `
.auth{display:grid;grid-template-columns:minmax(0,1fr);min-height:100vh;background:${T.bg}}
.auth-side{display:none}
.auth-top{display:flex}
@media (min-width:900px){
  .auth{grid-template-columns:minmax(380px,5fr) 6fr}
  .auth-side{display:flex}
  .auth-top{display:none}
}
.auth a{color:${T.primary};font-weight:700;text-decoration:none}
.auth a:hover{color:${T.primaryHover};text-decoration:underline}
`

/** Tela dividida: painel de marca à esquerda (desktop) e formulário à direita. */
export function AuthLayout({ title, sub, children, footer, sideTitle, sidePoints }: {
  title: string; sub?: ReactNode; children: ReactNode; footer?: ReactNode
  sideTitle: ReactNode; sidePoints: string[]
}) {
  return (
    <div className="auth">
      <style>{AUTH_CSS}</style>

      <aside className="auth-side" style={{ background: T.green, color: '#F3ECE4', flexDirection: 'column', justifyContent: 'space-between', padding: 'clamp(36px,4vw,56px)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'rgba(242,201,168,.07)', right: -140, bottom: -120 }} />
        <Logo light size={22} />
        <div style={{ position: 'relative', maxWidth: 440 }}>
          <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 'clamp(36px,3.4vw,50px)', lineHeight: 1.05, letterSpacing: -0.5, marginBottom: 28 }}>{sideTitle}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sidePoints.map(p => (
              <li key={p} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 16, lineHeight: 1.45 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(242,201,168,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="check" size={14} color="#F2C9A8" sw={2.6} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ fontSize: 13.5, color: '#B9CFC7', position: 'relative' }}>Agendamento com aviso no WhatsApp, pra quem cuida de gente.</div>
      </aside>

      <main style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="auth-top" style={{ alignItems: 'center', padding: '20px clamp(20px,5vw,40px)', background: T.surface, borderBottom: `1px solid ${T.lineSoft}` }}>
          <Logo size={20} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px,6vw,72px) clamp(20px,5vw,40px)' }}>
          <div style={{ width: '100%', maxWidth: 440 }}>
            <h1 style={{ fontFamily: T.heading, fontWeight: 700, fontSize: 'clamp(34px,4vw,44px)', lineHeight: 1.05, letterSpacing: -0.5, color: T.ink }}>{title}</h1>
            {sub && <p style={{ fontSize: 16, lineHeight: 1.55, color: T.inkSoft, margin: '10px 0 32px' }}>{sub}</p>}
            {children}
            {footer && <div style={{ marginTop: 28, fontSize: 15, color: T.inkSoft, textAlign: 'center' }}>{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  )
}

/** Campo de senha com botão mostrar/ocultar. */
export function PasswordField({ id, value, onChange, show, onToggle, placeholder, autoComplete, invalid }: {
  id: string; value: string; onChange: (v: string) => void; show: boolean; onToggle?: () => void
  placeholder?: string; autoComplete: string; invalid?: boolean
}) {
  return (
    <div style={{ position: 'relative' }}>
      <input id={id} style={{ ...fieldStyle, paddingRight: onToggle ? 84 : 16, borderColor: invalid ? '#E58F82' : T.line }}
        type={show ? 'text' : 'password'} autoComplete={autoComplete} placeholder={placeholder}
        value={value} onChange={e => onChange(e.target.value)} required aria-invalid={invalid || undefined} />
      {onToggle && (
        <button type="button" onClick={onToggle} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
          style={{ position: 'absolute', right: 8, top: 8, bottom: 8, padding: '0 12px', border: 'none', borderRadius: 8, background: T.surfaceAlt, color: T.ink, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: T.body }}>
          {show ? 'ocultar' : 'mostrar'}
        </button>
      )}
    </div>
  )
}
