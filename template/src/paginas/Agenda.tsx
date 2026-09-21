import { Calendar, GlassCard, GlassPill, Glyph, PageShell, stagger } from "@/ui";

const COMPROMISSOS = [
  { hora: "08:00", titulo: "Reunião de abertura", local: "Unidade Norte", estado: "confirmado" as const },
  { hora: "10:30", titulo: "Revisão de indicadores", local: "Remoto", estado: "confirmado" as const },
  { hora: "14:00", titulo: "Visita técnica", local: "Unidade Sul", estado: "pendente" as const },
  { hora: "16:30", titulo: "Fechamento do mês", local: "Centro", estado: "pendente" as const },
];

/** Dias com compromisso, em AAAA-MM-DD — os três próximos, a partir de hoje. */
const MARCADOS = [0, 2, 5, 9].map((n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
});

const SELO = {
  confirmado: "bg-primary-100 text-primary-800",
  pendente: "bg-orange-100 text-orange-700",
};

export default function Agenda() {
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

  return (
    <PageShell titulo="Agenda" detalhe={hoje}>
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <div className="grid gap-3.5 lg:grid-cols-[1fr_1.3fr]">
          <GlassCard className="h-fit p-[22px]">
            <Calendar marcados={MARCADOS} />
          </GlassCard>

          <div className="flex flex-col gap-2.5">
            {COMPROMISSOS.map((c, i) => (
              <GlassCard
                key={c.hora}
                interactive
                delay={stagger(i)}
                className="flex items-center gap-4 p-[22px]"
              >
                <span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-primary-50 text-[13px] font-bold text-primary-800">
                  {c.hora}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-foreground-950">{c.titulo}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-foreground-500">
                    <Glyph name="calendar" size={13} />
                    {c.local}
                  </p>
                </div>
                <GlassPill className={`shrink-0 px-3 py-1.5 text-[11.5px] font-semibold ${SELO[c.estado]}`}>
                  {c.estado === "confirmado" ? "Confirmado" : "Pendente"}
                </GlassPill>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  );
}
