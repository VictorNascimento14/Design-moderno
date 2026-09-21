import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  aberto: boolean;
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
  /** Largura máxima do painel. */
  largura?: "md" | "lg" | "xl";
  /** Faixa fixa no pé do painel (botões). */
  rodape?: ReactNode;
}

const LARGURA = { md: "max-w-md", lg: "max-w-2xl", xl: "max-w-4xl" } as const;

/**
 * Casca dos modais do painel: cortina escurecida, vidro mais opaco, título e
 * botão de fechar — a mesma receita que os modais das abas já usavam. Fecha no
 * Escape e no clique fora; o foco entra no painel e volta para quem abriu.
 * Pode ser usado dentro de qualquer cartão: renderiza em portal no `<body>`.
 */
export default function Modal({ aberto, titulo, onFechar, children, largura = "md", rodape }: ModalProps) {
  const tituloId = useId();
  const fecharRef = useRef<HTMLButtonElement>(null);
  // Em ref: um `onFechar` novo a cada render (função inline) não pode
  // re-rodar o efeito — ele devolveria o foco ao "Fechar" no meio da digitação.
  const onFecharRef = useRef(onFechar);
  onFecharRef.current = onFechar;

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    fecharRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onFecharRef.current();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      anterior?.focus?.();
    };
  }, [aberto]);

  if (!aberto) return null;

  // Em portal, direto no <body>: dentro de um `.glass*`, o `backdrop-filter`
  // vira bloco de contenção do `fixed` e a cortina ficaria do tamanho do cartão.
  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        className={`glass-strong animate-rise flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden ${LARGURA[largura]}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-foreground-950/[0.06] px-[26px] py-5">
          <h4 id={tituloId} className="text-[17px] font-bold tracking-[-0.01em] text-foreground-950">
            {titulo}
          </h4>
          <button
            ref={fecharRef}
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="press grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-foreground-600 transition-colors hover:bg-primary-900/[0.07] hover:text-primary-900"
          >
            <i className="ri-close-line text-lg" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-[26px]">{children}</div>
        {rodape && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-foreground-950/[0.06] px-[26px] py-4">
            {rodape}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
