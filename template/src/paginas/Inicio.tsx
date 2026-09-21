import { AnimatedNumber, GlassCard, MeterBar, PageShell, Reveal, StatCard, stagger } from "@/ui";

const CAPACIDADE = [
  { rotulo: "Norte", pct: 92 },
  { rotulo: "Centro", pct: 74 },
  { rotulo: "Sul", pct: 58 },
  { rotulo: "Leste", pct: 41 },
];

const moeda = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Inicio() {
  const mes = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <PageShell detalhe={mes} aoVivo>
      {/* `pb-28` no celular: a barra de baixo flutua sobre o conteúdo. */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Atendimentos"
            value={<AnimatedNumber value={1284} />}
            icon="check-double"
            foot="+12% sobre o mês anterior"
            delay={stagger(0)}
          />
          <StatCard
            label="Em aberto"
            value={<AnimatedNumber value={37} />}
            icon="calendar"
            tone="amber"
            foot="7 vencem esta semana"
            delay={stagger(1)}
          />
          <StatCard
            label="Equipe ativa"
            value={<AnimatedNumber value={46} />}
            icon="users"
            tone="mint"
            foot="4 admissões no mês"
            delay={stagger(2)}
          />
          <StatCard
            label="Repasse"
            value={<AnimatedNumber value={184320} format={moeda} />}
            icon="hand-coin"
            compact
            foot="Fecha dia 30"
            delay={stagger(3)}
          />
        </div>

        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-[1.6fr_1fr]">
          <GlassCard className="p-[26px]" delay={stagger(4)}>
            <h2 className="text-[17px] font-bold tracking-[-0.01em] text-foreground-950">Ocupação por unidade</h2>
            <p className="mt-1 text-[13px] text-foreground-500">
              As barras crescem quando entram na tela, uma vez só.
            </p>
            <div className="mt-5 flex flex-col gap-4">
              {CAPACIDADE.map((u, i) => (
                <div key={u.rotulo}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-[13px] font-medium text-foreground-700">{u.rotulo}</span>
                    <span className="text-[13px] font-semibold text-foreground-900">{u.pct}%</span>
                  </div>
                  {/* Nada abaixo de `primary-500`: o preenchimento some no trilho. */}
                  <MeterBar pct={u.pct} delay={stagger(i, 90)} label={`Ocupação ${u.rotulo}`} />
                </div>
              ))}
            </div>
          </GlassCard>

          <Reveal delay={stagger(5)} className="flex flex-col gap-3.5">
            <GlassCard interactive sheen className="p-[26px]">
              <h3 className="text-[15px] font-bold text-foreground-950">Cartão que levanta</h3>
              <p className="mt-1.5 text-[13px] text-foreground-500">
                <code className="rounded bg-foreground-950/[0.06] px-1">interactive</code> levanta no hover e{" "}
                <code className="rounded bg-foreground-950/[0.06] px-1">sheen</code> passa um brilho diagonal.
              </p>
            </GlassCard>
            <GlassCard tone="medium" className="p-[26px]">
              <h3 className="text-[15px] font-bold text-foreground-950">Três intensidades</h3>
              <p className="mt-1.5 text-[13px] text-foreground-500">
                <code className="rounded bg-foreground-950/[0.06] px-1">soft</code> ·{" "}
                <code className="rounded bg-foreground-950/[0.06] px-1">medium</code> ·{" "}
                <code className="rounded bg-foreground-950/[0.06] px-1">strong</code> — 55%, 62% e 85% de vidro.
              </p>
              <div className="glass-inset mt-4 rounded-[18px] p-4 text-[12.5px] text-foreground-600">
                <code>.glass-inset</code> é a superfície de um cartão dentro de outro.
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </main>
    </PageShell>
  );
}
