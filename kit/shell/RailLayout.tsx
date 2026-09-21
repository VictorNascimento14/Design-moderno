import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import type { Conta, GrupoNav, ItemNav } from "./navegacao";

/** O que as telas recebem da coluna, pelo `useOutletContext`. */
export type RailOutletContext = {
  /** Abre a gaveta do celular — o botão mora no cabeçalho (`PageShell`). */
  abrirMenu: () => void;
  /** Todos os destinos, achatados: é o que a barra de baixo mostra. */
  itens: ItemNav[];
  conta?: Conta;
  onSair?: () => void;
};

interface RailLayoutProps {
  grupos: GrupoNav[];
  conta?: Conta;
  onSair?: () => void;
  logo?: ReactNode;
}

/**
 * Rota de layout das telas com coluna lateral. A coluna é montada UMA vez
 * aqui; trocar de tela troca apenas o `<Outlet>`.
 *
 * Quando cada tela montava a própria coluna, todo clique a recriava: os itens
 * repetiam a animação de entrada, a coluna sumia enquanto a página carregava e
 * o marcador do item ativo não tinha de onde deslizar.
 *
 *     { element: <RailLayout grupos={GRUPOS} conta={conta} />, children: [...] }
 */
export default function RailLayout({ grupos, conta, onSair, logo }: RailLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const contexto = useMemo<RailOutletContext>(
    () => ({
      abrirMenu: () => setMenuOpen(true),
      itens: grupos.flatMap((g) => g.itens),
      conta,
      onSair,
    }),
    [grupos, conta, onSair],
  );

  return (
    <>
      <Sidebar
        grupos={grupos}
        conta={conta}
        onSair={onSair}
        logo={logo}
        mobileOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <Outlet context={contexto} />
    </>
  );
}
