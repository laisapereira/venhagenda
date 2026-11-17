import { useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { api, ClientAppointment } from "../lib/api";
import { Icon } from "../components/Icon";
import { TopBar, PageTitle, ErrorBox, fieldStyle, labelStyle, primaryButtonStyle } from "../components/Brand";
import { T } from "../theme/terra";

const brl = (n: number) => `R$ ${Number(n).toFixed(2).replace(".", ",")}`;
const MON = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const DOW = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function fmtDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  const dow = DOW[new Date(iso + "T00:00:00").getDay()];
  return `${dow}, ${d} ${MON[m - 1]}`;
}

function applyPhoneMask(digits: string): string {
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
}

interface Studio { id: number; name: string; slug: string }

export default function MyAppointments() {
  const { slug } = useParams<{ slug: string }>();
  const [phone,       setPhone]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [clientName,  setClientName]  = useState<string | null>(null);
  const [appts,       setAppts]       = useState<ClientAppointment[]>([]);
  const [selected,    setSelected]    = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function handleClientCancel(apptId: string) {
    const rawPhone = phone.replace(/\D/g, '');
    setCancellingId(apptId);
    try {
      await api.appointments.clientCancel(apptId, rawPhone);
      setAppts(prev => prev.map(a => a.id === apptId ? { ...a, status: 'cancelled' } : a));
    } catch {
      alert('Não foi possível cancelar. Tente novamente.');
    } finally {
      setCancellingId(null);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { client_name, appointments } = await api.client.lookup(phone);
      if (appointments.length === 0) {
        setError("Nenhum agendamento encontrado para esse telefone.");
        return;
      }
      setClientName(client_name ?? appointments[0]?.studio_name ?? "Cliente");
      setAppts(appointments);
      const fromStudio = appointments.find(a => a.studio_slug === slug);
      setSelected(fromStudio?.studio_id ?? appointments[0]?.studio_id ?? null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Nenhum agendamento encontrado.");
    } finally {
      setLoading(false);
    }
  }

  const studios: Studio[] = appts.reduce<Studio[]>((acc, a) => {
    if (!acc.find(s => s.id === a.studio_id))
      acc.push({ id: a.studio_id, name: a.studio_name, slug: a.studio_slug });
    return acc;
  }, []);

  const today     = new Date().toISOString().slice(0, 10);
  const filtered  = appts.filter(a => a.studio_id === selected);
  const upcoming  = filtered.filter(a => a.date >= today && a.status !== 'cancelled').reverse();
  const past      = filtered.filter(a => a.date < today  && a.status !== 'cancelled');
  const cancelled = filtered.filter(a => a.status === 'cancelled');

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.body, display: "flex", flexDirection: "column" }}>
      <TopBar />

      <div style={{ flex: 1, maxWidth: 640, width: "100%", margin: "0 auto", padding: "clamp(28px,5vw,56px) clamp(16px,5vw,32px) 48px" }}>
        <div style={{ marginBottom: 28 }}>
          <PageTitle
            eyebrow="Área da cliente"
            title={clientName ? `Olá, ${clientName.split(" ")[0]}!` : "Meus agendamentos"}
            sub={clientName ? "Aqui estão seus horários. Você pode remarcar ou cancelar por aqui." : "Digite o telefone que você usou pra agendar. Sem senha, sem cadastro."}
          />
        </div>

        {/* Formulário de busca */}
        {!clientName && (
          <>
            {error && <ErrorBox>{error}</ErrorBox>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, background: T.surface, border: `1px solid ${T.lineSoft}`, borderRadius: 20, padding: "clamp(20px,4vw,32px)" }}>
              <div>
                <label htmlFor="my-phone" style={labelStyle}>Seu WhatsApp</label>
                <input
                  id="my-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(71) 99999-0001"
                  value={phone}
                  onChange={e => setPhone(applyPhoneMask(e.target.value.replace(/\D/g, "")))}
                  required
                  style={fieldStyle}
                />
              </div>
              <button type="submit" disabled={loading} style={primaryButtonStyle(loading)}>
                {loading ? "Buscando…" : "Ver meus agendamentos"}
                {!loading && <Icon name="arrowRight" size={19} color="currentColor" sw={2.2} />}
              </button>
            </form>
          </>
        )}

        {/* Resultados */}
        {clientName && (
          <>
            {/* Studio cards — só aparece se tiver mais de 1 */}
            {studios.length > 1 && (
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, marginBottom: 20 }}>
                {studios.map(s => (
                  <button key={s.id} onClick={() => setSelected(s.id)} style={{
                    flexShrink: 0, padding: "10px 16px", borderRadius: T.radius,
                    border: `2px solid ${selected === s.id ? T.primary : T.line}`,
                    background: selected === s.id ? T.primarySoft : T.surface,
                    color: selected === s.id ? T.primary : T.ink,
                    fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: T.body,
                  }}>
                    {s.name}
                  </button>
                ))}
              </div>
            )}

            {/* Studio label único */}
            {studios.length === 1 && (
              <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: T.radius, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="polish" size={20} color={T.primary} sw={1.5} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{studios[0].name}</div>
                  <div style={{ fontSize: 12, color: T.inkSoft }}>/{studios[0].slug}</div>
                </div>
              </div>
            )}

            {upcoming.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Próximos agendamentos</div>
                {upcoming.map(a => (
                  <ApptCard
                    key={a.id}
                    appt={a}
                    cancelling={cancellingId === a.id}
                    onCancel={a.status === 'confirmed' ? () => handleClientCancel(a.id) : undefined}
                  />
                ))}
              </>
            )}

            {past.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft, textTransform: "uppercase", letterSpacing: 1, margin: "22px 0 10px" }}>Agendamentos passados</div>
                {past.map(a => <ApptCard key={a.id} appt={a} muted />)}
              </>
            )}

            {cancelled.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#c2453b", textTransform: "uppercase", letterSpacing: 1, margin: "22px 0 10px" }}>Cancelados</div>
                {cancelled.map(a => <ApptCard key={a.id} appt={a} muted cancelled />)}
              </>
            )}

            <button onClick={() => { setClientName(null); setAppts([]); setPhone(""); }} style={{ marginTop: 24, width: "100%", background: "transparent", border: "none", color: T.inkSoft, fontSize: 13.5, cursor: "pointer", fontFamily: T.body }}>
              Buscar outro número
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ApptCard({ appt: a, muted, cancelled: isCancelled, onCancel, cancelling }: {
  appt: ClientAppointment; muted?: boolean; cancelled?: boolean
  onCancel?: () => void; cancelling?: boolean
}) {
  const [open, setOpen] = useState(false);

  const svcs    = a.all_services?.length ? a.all_services : [{ id: a.service_id, name: a.service_name, price: a.service_price, emoji: a.service_emoji, duration: a.service_duration }];
  const title   = svcs.map(s => s.name).join(" + ");
  const emojis  = svcs.map(s => s.emoji).join(" ");
  const total   = svcs.reduce((sum, s) => sum + Number(s.price), 0);

  return (
    <div style={{ background: T.surface, border: `1px solid ${open ? T.primary : T.line}`, borderRadius: T.radius, marginBottom: 10, opacity: muted ? 0.65 : 1, overflow: "hidden" }}>
      {/* Cabeçalho clicável */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", fontFamily: T.body, textAlign: "left" }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 12, background: a.service_color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
          {emojis}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.ink }}>{title}</div>
          <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 2 }}>
            {fmtDate(a.date)} · {a.start_time} → {a.end_time}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          {a.status === "confirmed"  && <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", background: "#dcfce7", borderRadius: 6, padding: "3px 8px" }}>confirmado</span>}
          {a.status === "completed"  && <span style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft, background: T.line, borderRadius: 6, padding: "3px 8px" }}>concluído</span>}
          {isCancelled               && <span style={{ fontSize: 11, fontWeight: 700, color: "#c2453b", background: "#fee2e2", borderRadius: 6, padding: "3px 8px" }}>cancelado</span>}
          <span style={{ fontSize: 11, color: T.inkSoft }}>{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Detalhes expandidos */}
      {open && (
        <div style={{ borderTop: `1px solid ${T.lineSoft}`, padding: "14px 16px" }}>
          {svcs.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 8 }}>
              <span>{s.emoji} {s.name}</span>
              <span style={{ color: T.inkSoft }}>{brl(Number(s.price))}</span>
            </div>
          ))}
          {svcs.length > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, fontWeight: 700, borderTop: `1px solid ${T.lineSoft}`, paddingTop: 8, marginTop: 4 }}>
              <span>Total</span>
              <span>{brl(total)}</span>
            </div>
          )}
          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <a
              href={`/book/${a.studio_slug}`}
              style={{ flex: 1, background: T.primarySoft, color: T.primary, border: "none", borderRadius: T.radiusSm, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: T.body, textAlign: "center", textDecoration: "none", display: "block" }}
            >
              Remarcar 📅
            </a>
            {onCancel && (
              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) onCancel()
                }}
                disabled={cancelling}
                style={{ flex: 1, background: "transparent", color: "#c2453b", border: "1.5px solid #e7b3ae", borderRadius: T.radiusSm, padding: "11px", fontSize: 14, fontWeight: 700, cursor: cancelling ? "default" : "pointer", fontFamily: T.body, opacity: cancelling ? 0.6 : 1 }}
              >
                {cancelling ? "Cancelando…" : "Cancelar ✕"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
