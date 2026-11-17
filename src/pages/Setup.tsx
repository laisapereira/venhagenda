import { useState, FormEvent, CSSProperties, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Icon } from '../components/Icon'
import { T } from '../theme/terra'
import { AuthLayout, ErrorBox, PasswordField, fieldStyle, labelStyle, primaryButtonStyle } from '../components/Brand'

export default function Setup() {
  const navigate = useNavigate()
  const [studioName, setStudioName] = useState('')
  const [slug, setSlug]             = useState('')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [showPass, setShowPass]     = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  function handleStudioName(val: string) {
    setStudioName(val)
    if (!slug || slug === toSlug(studioName)) {
      setSlug(toSlug(val))
    }
  }

  function toSlug(s: string) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 6) { setError('Senha deve ter ao menos 6 caracteres.'); return }
    if (password !== confirm) { setError('As senhas não coincidem.'); return }
    if (!/^[a-z0-9-]+$/.test(slug)) { setError('O link deve ter só letras minúsculas, números e hífens.'); return }

    setLoading(true)
    try {
      const { token } = await api.auth.setup(email, password, studioName, slug)
      localStorage.setItem('token', token)
      navigate(`/${slug}/admin`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta.')
    } finally {
      setLoading(false)
    }
  }

  const mismatch = !!confirm && confirm !== password
  const incomplete = !studioName || !slug || !email || !password || password !== confirm
  const host = typeof window !== 'undefined' ? window.location.host : 'venhagenda.com.br'

  return (
    <AuthLayout
      title="Crie seu estúdio"
      sub="Leva 1 minuto. Depois você define horários, serviços e o seu WhatsApp no painel."
      sideTitle={<>Sua agenda online, <span style={{ fontStyle: 'italic', color: '#F2C9A8' }}>pronta em 5 minutos.</span></>}
      sidePoints={[
        'Grátis pra começar, sem cartão de crédito',
        'Um link só seu pra mandar pras clientes',
        'Confirmação e lembrete no WhatsApp, sem configurar nada',
        'A cliente agenda sem baixar app nem criar conta',
      ]}
      footer={<>Já tem conta? <Link to="/login">Entrar</Link></>}
    >
      {error && <ErrorBox>{error}</ErrorBox>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Group step={1} title="Seu estúdio">
          <div>
            <label htmlFor="setup-name" style={labelStyle}>Nome do estúdio</label>
            <input id="setup-name" style={fieldStyle} type="text" placeholder="Ex: Studio Bella" value={studioName}
              onChange={e => handleStudioName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="setup-slug" style={labelStyle}>Seu link de agendamento</label>
            <div style={{ display: 'flex', alignItems: 'stretch', border: `1.5px solid ${T.line}`, borderRadius: 12, background: T.surface, overflow: 'hidden' }}>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 4px 0 16px', fontSize: 15, color: T.inkSoft, whiteSpace: 'nowrap', userSelect: 'none' }}>/book/</span>
              <input id="setup-slug" style={{ ...fieldStyle, border: 'none', borderRadius: 0, paddingLeft: 2, minWidth: 0 }}
                type="text" placeholder="studio-bella" value={slug} aria-describedby="setup-slug-hint"
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} required />
            </div>
            <p id="setup-slug-hint" style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 8, overflowWrap: 'anywhere' }}>
              Suas clientes agendam em <strong style={{ color: T.ink }}>{host}/book/{slug || 'seu-link'}</strong>
            </p>
          </div>
        </Group>

        <Group step={2} title="Seu acesso ao painel">
          <div>
            <label htmlFor="setup-email" style={labelStyle}>E-mail</label>
            <input id="setup-email" style={fieldStyle} type="email" autoComplete="email" placeholder="voce@email.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={stack}>
            <div>
              <label htmlFor="setup-pass" style={labelStyle}>Senha</label>
              <PasswordField id="setup-pass" value={password} onChange={setPassword} show={showPass}
                onToggle={() => setShowPass(s => !s)} autoComplete="new-password" placeholder="Mínimo 6 caracteres" />
            </div>
            <div>
              <label htmlFor="setup-confirm" style={labelStyle}>Confirme a senha</label>
              <PasswordField id="setup-confirm" value={confirm} onChange={setConfirm} show={showPass}
                autoComplete="new-password" placeholder="Repita a senha" invalid={mismatch} />
              {mismatch && <p style={{ fontSize: 13.5, color: '#8F2A1F', marginTop: 6 }}>As senhas não coincidem.</p>}
            </div>
          </div>
        </Group>

        <div>
          <button type="submit" disabled={loading || incomplete} style={primaryButtonStyle(loading || incomplete)}>
            {loading ? 'Criando estúdio…' : 'Criar estúdio e entrar'}
            {!loading && <Icon name="arrowRight" size={19} color="currentColor" sw={2.2} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14, color: T.inkSoft, fontSize: 13.5 }}>
            <Icon name="shield" size={15} color={T.sage} /> Grátis, sem cartão. Senha guardada com criptografia.
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}

const stack: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 18 }

function Group({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <legend style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 0, marginBottom: 16, fontSize: 13, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', color: T.primaryText }}>
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: T.primary, color: T.primaryInk, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{step}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  )
}
