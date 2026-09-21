import { useEffect, useRef, useState } from "react";

import {
  Avatar,
  Button,
  Dropdown,
  GlassCard,
  GlassPill,
  Glyph,
  Modal,
  PageShell,
  TextField,
  toast,
} from "@/ui";

const PESSOAS = ["Ana Ribeiro", "Bruno Tavares", "Carla Menezes", "Diego Alcântara"];

export default function Componentes() {
  const [modal, setModal] = useState(false);
  const [menu, setMenu] = useState(false);
  const [unidade, setUnidade] = useState("todas");
  const menuRef = useRef<HTMLDivElement>(null);

  // Clicar fora fecha. Um véu `fixed inset-0` NÃO serve aqui: dentro de um
  // `.glass*`, o `backdrop-filter` vira o bloco de contenção do `fixed` e o
  // véu nasce do tamanho da pílula, não da tela.
  useEffect(() => {
    if (!menu) return;
    function fora(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    }
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, [menu]);

  return (
    <PageShell titulo="Componentes">
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <div className="flex flex-col gap-3.5">
          <GlassCard className="p-[26px]">
            <h2 className="text-[17px] font-bold text-foreground-950">Botões</h2>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <Button onClick={() => toast("Salvo", "O aviso some em 5 segundos.")}>Primário</Button>
              <Button variant="accent">Destaque</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="ghost">Fantasma</Button>
              <Button loading>Enviando</Button>
              <Button disabled>Indisponível</Button>
            </div>
            <p className="mt-3.5 text-[12.5px] text-foreground-500">
              Todo botão é <code className="rounded bg-foreground-950/[0.06] px-1">type="button"</code> por padrão:
              dentro de um <code className="rounded bg-foreground-950/[0.06] px-1">&lt;form&gt;</code>, o default do
              HTML enviaria o formulário sem querer.
            </p>
          </GlassCard>

          <GlassCard className="p-[26px]">
            <h2 className="text-[17px] font-bold text-foreground-950">Campos</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField label="Nome" placeholder="Como te chamam" icon="ri-user-line" />
              <TextField label="E-mail" type="email" placeholder="voce@exemplo.com" icon="ri-mail-line" success />
              <TextField label="Telefone" placeholder="(85) 90000-0000" error="Número incompleto." />
              <div>
                <label
                  htmlFor="unidade"
                  className="mb-1.5 block text-sm font-medium text-foreground-700"
                >
                  Unidade
                </label>
                {/* Select sozinho numa pílula: a lista se ancora na pílula e
                    desdobra a altura ao abrir (Chrome/Edge). Nos outros
                    navegadores a lista é a do sistema, sem quebrar nada. */}
                <GlassPill className="w-full px-[18px] py-2.5">
                  <select
                    id="unidade"
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    className="w-full cursor-pointer bg-transparent text-sm font-medium text-foreground-800 outline-none"
                  >
                    <option value="todas">Todas as unidades</option>
                    <option value="norte">Norte</option>
                    <option value="centro">Centro</option>
                    <option value="sul">Sul</option>
                  </select>
                </GlassPill>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-3.5 md:grid-cols-2">
            <GlassCard className="p-[26px]">
              <h2 className="text-[17px] font-bold text-foreground-950">Painel que desdobra</h2>
              <p className="mt-1.5 text-[12.5px] text-foreground-500">
                Fica montado quando fechado — desmontar com{" "}
                <code className="rounded bg-foreground-950/[0.06] px-1">{"{open && …}"}</code> mata a animação de
                saída.
              </p>
              <div ref={menuRef} className="relative mt-4">
                <Button variant="secondary" onClick={() => setMenu((o) => !o)} aria-expanded={menu}>
                  <Glyph name="bell" size={16} />
                  Abrir painel
                </Button>
                <Dropdown open={menu} className="glass-strong absolute left-0 top-full z-50 mt-2 w-72">
                  {PESSOAS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setMenu(false)}
                      className="dropdown-item flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-primary-900/[0.05]"
                    >
                      <Avatar nome={p} size={32} />
                      <span className="text-sm font-medium text-foreground-900">{p}</span>
                    </button>
                  ))}
                </Dropdown>
              </div>
            </GlassCard>

            <GlassCard className="p-[26px]">
              <h2 className="text-[17px] font-bold text-foreground-950">Modal</h2>
              <p className="mt-1.5 text-[12.5px] text-foreground-500">
                Sai por portal no <code className="rounded bg-foreground-950/[0.06] px-1">&lt;body&gt;</code>: dentro
                de um cartão de vidro, a cortina teria o tamanho do cartão.
              </p>
              <div className="mt-4">
                <Button onClick={() => setModal(true)}>Abrir modal</Button>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-[26px]">
            <h2 className="text-[17px] font-bold text-foreground-950">Pílulas e pessoas</h2>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {PESSOAS.map((p) => (
                <GlassPill key={p} className="py-1.5 pl-1.5 pr-4">
                  <Avatar nome={p} size={30} />
                  <span className="text-[13px] font-medium text-foreground-800">{p}</span>
                </GlassPill>
              ))}
            </div>
          </GlassCard>
        </div>

        <Modal
          aberto={modal}
          titulo="Confirmar envio"
          onFechar={() => setModal(false)}
          rodape={
            <>
              <Button variant="ghost" onClick={() => setModal(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  setModal(false);
                  toast("Enviado", "Nada saiu daqui — é uma demonstração.");
                }}
              >
                Enviar
              </Button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-foreground-600">
            Fecha no Escape e no clique fora. O foco entra no painel ao abrir e volta para quem abriu ao fechar —
            teclado e leitor de tela não ficam presos atrás da cortina.
          </p>
        </Modal>
      </main>
    </PageShell>
  );
}
