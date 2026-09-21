import { Avatar, GlassCard, PageShell, stagger } from "@/ui";

const EQUIPE = [
  { nome: "Ana Ribeiro", papel: "Coordenação" },
  { nome: "Bruno Tavares", papel: "Operações" },
  { nome: "Carla Menezes", papel: "Financeiro" },
  { nome: "Diego Alcântara", papel: "Suporte" },
  { nome: "Elisa Fontenele", papel: "Qualidade" },
  { nome: "Fábio Moura", papel: "Operações" },
];

export default function Equipe() {
  return (
    <PageShell titulo="Equipe" detalhe={`${EQUIPE.length} pessoas`}>
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPE.map((p, i) => (
            <GlassCard key={p.nome} interactive delay={stagger(i)} className="flex items-center gap-3.5 p-[22px]">
              <Avatar nome={p.nome} size={46} />
              <div className="min-w-0">
                <p className="truncate text-[14.5px] font-semibold text-foreground-950">{p.nome}</p>
                <p className="text-[12.5px] text-foreground-500">{p.papel}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
