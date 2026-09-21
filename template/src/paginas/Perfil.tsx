import { Avatar, Button, GlassCard, PageShell, TextField, toast } from "@/ui";
import { CONTA } from "../navegacao";

export default function Perfil() {
  return (
    <PageShell titulo="Meu perfil">
      <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <GlassCard className="p-[26px]">
          <div className="flex items-center gap-4">
            <Avatar nome={CONTA.nome} size={64} />
            <div>
              <h2 className="text-[19px] font-bold tracking-[-0.01em] text-foreground-950">{CONTA.nome}</h2>
              <p className="text-[13px] text-foreground-500">{CONTA.papel}</p>
            </div>
          </div>

          <form
            className="mt-6 grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast("Perfil salvo");
            }}
          >
            <TextField label="Nome" defaultValue={CONTA.nome} icon="ri-user-line" />
            <TextField label="E-mail" type="email" defaultValue="voce@exemplo.com" icon="ri-mail-line" />
            <TextField
              label="Telefone"
              defaultValue="(85) 90000-0000"
              icon="ri-phone-line"
              className="sm:col-span-2"
            />
            <div className="sm:col-span-2">
              {/* `type="submit"` explícito: o padrão do `<Button>` é "button". */}
              <Button type="submit">Salvar alterações</Button>
            </div>
          </form>
        </GlassCard>
      </main>
    </PageShell>
  );
}
