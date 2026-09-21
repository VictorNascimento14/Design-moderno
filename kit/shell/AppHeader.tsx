import type { ReactNode } from "react";

import Avatar from "../base/Avatar";
import GlassPill from "../base/GlassPill";
import Glyph from "../base/Glyph";
import { NOME } from "../lib/marca";
import BrandMark from "./BrandMark";
import TemaToggle from "./TemaToggle";
import type { Conta } from "./navegacao";

interface AppHeaderProps {
  /** Nome da tela, na pílula da esquerda. Sem ele, fica o nome do app. */
  titulo?: string;
  /** Texto de contexto à direita do título (um mês, um filtro, um total). */
  detalhe?: string;
  /** Ponto pulsante antes do detalhe — para dado que muda sozinho. */
  aoVivo?: boolean;
  conta?: Conta;
  onSair?: () => void;
  /** Abre a gaveta de navegação — só existe abaixo de `md`. */
  onMenuOpen?: () => void;
  /** Entra na pílula da direita, antes da conta: sino, busca, filtro. */
  acoes?: ReactNode;
}

/**
 * Cabeçalho de pílulas flutuantes: contexto à esquerda, conta à direita.
 * Montado pelo `PageShell` — uma tela não o usa direto.
 */
export default function AppHeader({
  titulo,
  detalhe,
  aoVivo = false,
  conta,
  onSair,
  onMenuOpen,
  acoes,
}: AppHeaderProps) {
  const primeiroNome = conta?.nome.split(" ")[0] ?? "";

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-4 pb-2 pt-4 md:px-6">
      <GlassPill className="min-w-0 gap-2.5 px-[18px] py-2.5">
        {/* No celular a coluna vira gaveta: a marca dá lugar ao botão dela. */}
        {onMenuOpen ? (
          <button
            type="button"
            onClick={onMenuOpen}
            aria-label="Abrir menu"
            className="press -ml-1.5 grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-primary-900 transition-colors hover:bg-primary-900/[0.07] md:hidden"
          >
            <Glyph name="menu" size={18} />
          </button>
        ) : (
          <BrandMark size={28} className="md:hidden" />
        )}
        <h1 className="truncate text-[14px] font-bold text-primary-900">{titulo ?? NOME}</h1>
        {detalhe && (
          <>
            {aoVivo && (
              <span
                className="animate-live h-[5px] w-[5px] shrink-0 rounded-full bg-primary-500"
                aria-hidden="true"
              />
            )}
            <span className="whitespace-nowrap text-[13px] text-foreground-500">{detalhe}</span>
          </>
        )}
      </GlassPill>

      {/* `ml-auto`: quando o cabeçalho quebra linha (celular), a pílula da
          conta continua à direita — e os painéis que abrem dela, para dentro
          da tela. `relative`: um painel ancorado se alinha por esta pílula. */}
      <GlassPill className="relative ml-auto gap-2.5 py-[7px] pl-2 pr-2">
        <TemaToggle />
        {acoes}

        {conta && (
          <>
            <div className="hidden text-right leading-tight sm:block">
              <span className="block whitespace-nowrap text-[13px] font-semibold text-foreground-900">
                {primeiroNome}
              </span>
              {conta.papel && (
                <span className="block whitespace-nowrap text-[11px] text-foreground-500">{conta.papel}</span>
              )}
            </div>
            {conta.avatar ?? <Avatar nome={conta.nome} size={34} />}
          </>
        )}

        {onSair && (
          <button
            type="button"
            onClick={onSair}
            aria-label="Sair"
            className="press inline-flex h-10 min-w-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[13px] font-semibold text-red-700 transition-colors hover:bg-red-100"
          >
            <Glyph name="logout" size={15} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        )}
      </GlassPill>
    </header>
  );
}
