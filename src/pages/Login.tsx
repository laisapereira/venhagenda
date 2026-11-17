import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Icon } from "../components/Icon";
import { AuthLayout, ErrorBox, PasswordField, fieldStyle, labelStyle, primaryButtonStyle } from "../components/Brand";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token } = await api.auth.login(email, password);
      localStorage.setItem("token", token);
      const { studio_slug } = JSON.parse(atob(token.split('.')[1]))
      navigate(`/${studio_slug}/admin`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Credenciais incorretas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Entrar no seu estúdio"
      sub="Acesse sua agenda, seus serviços e os avisos de agendamento."
      sideTitle={<>Bom te ver de volta. <span style={{ fontStyle: "italic", color: "#F2C9A8" }}>Sua agenda te espera.</span></>}
      sidePoints={[
        "Resumo do dia toda manhã no seu WhatsApp",
        "Aviso a cada agendamento, remarcação ou cancelamento",
        "Bloqueie folgas e feriados em segundos",
      ]}
      footer={<>Ainda não tem estúdio? <Link to="/setup">Criar grátis</Link></>}
    >
      {error && <ErrorBox>{error}</ErrorBox>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label htmlFor="login-email" style={labelStyle}>E-mail</label>
          <input id="login-email" style={fieldStyle} type="email" autoComplete="email" placeholder="voce@seuestudio.com"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="login-pass" style={labelStyle}>Senha</label>
          <PasswordField id="login-pass" value={password} onChange={setPassword} show={showPass}
            onToggle={() => setShowPass((s) => !s)} autoComplete="current-password" placeholder="Sua senha" />
        </div>

        <button type="submit" disabled={loading} style={{ ...primaryButtonStyle(loading), marginTop: 6 }}>
          {loading ? "Entrando…" : "Entrar"}
          {!loading && <Icon name="arrowRight" size={19} color="currentColor" sw={2.2} />}
        </button>
      </form>
    </AuthLayout>
  );
}
