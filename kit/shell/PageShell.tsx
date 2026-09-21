import type { ReactNode } from "react";
import { useOutletContext } from "react-router-dom";

import { sidebarMdClass } from "../lib/sidebarCollapsed";
import AppHeader from "./AppHeader";
import BottomNav from "./BottomNav";
import type { RailOutletContext } from "./RailLayout";

interface PageShellProps {
  /** Nome da tela na pílula da esquerda. */
  titulo?: string;
  /** Contexto à direita do título (um mês, um filtro, um total). */
  detalhe?: string;
  aoVivo?: boolean;
  /** Faixa que gruda junto com o cabeçalho — as abas da tela. */
  toolbar?: ReactNode;
  /** Entra na pílula da direita: sino, busca, filtro. */
  acoes?: ReactNode;
  /** O `<main>` da tela: largura, recuos e animação de entrada são dela. */
  children: ReactNode;
}

/**
 * Moldura de toda tela com coluna lateral: cabeçalho de pílulas que gruda no
 * topo, conteúdo deslocado pela coluna e a barra de baixo do celular. É o que
 * mantém as telas iguais entre si.
 *
 * A coluna em si não mora aqui: ela é do `RailLayout`, montada uma vez para
 * todas estas telas. Conta, navegação e "sair" chegam pelo contexto dele —
 * a tela não repete nada disso.
 *
 * ⚠️ Tela com coluna não tem rodapé. Montar um aqui desloca o conteúdo duas
 * vezes e abre uma faixa clara à esquerda.
 */
export default function PageShell({ titulo, detalhe, aoVivo, toolbar, acoes, children }: PageShellProps) {
  const coluna = useOutletContext<RailOutletContext | undefined>();

  return (
    <div className={`flex min-h-screen flex-col ${sidebarMdClass()}`}>
      {/* Cabeçalho e abas grudam JUNTOS, num bloco só: a altura do cabeçalho
          varia (as pílulas quebram linha no celular), então um offset fixo
          para as abas as deixaria escondidas atrás dele. O véu suave evita
          que o conteúdo rolando apareça na fresta. */}
      <div className="sticky top-0 z-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background-50 via-background-50/85 to-transparent"
        />
        <AppHeader
          titulo={titulo}
          detalhe={detalhe}
          aoVivo={aoVivo}
          conta={coluna?.conta}
          onSair={coluna?.onSair}
          onMenuOpen={coluna?.abrirMenu}
          acoes={acoes}
        />
        {toolbar}
      </div>

      {children}

      <BottomNav itens={coluna?.itens ?? []} />
    </div>
  );
}
