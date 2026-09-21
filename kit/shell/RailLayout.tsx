import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import { itensDaBarra } from "./navegacao";
import type { Conta, GrupoNav, ItemNav } from "./navegacao";

/** O que as telas recebem da coluna, pelo `useOutletContext`. */
export type RailOutletContext = {
  /** Abre a gaveta do celular — o botão mora no cabeçalho (`PageShell`). */
  abrirMenu: () => void;
  /** O que a barra de baixo mostra, já na ordem e no recorte certos. */
  itens: ItemNav[];
  conta?: Conta;
  onSair?: () => void;
};

interface RailLayoutProps {
  grupos: GrupoNav[];
  /**
   * As `key`s dos destinos da barra de baixo do celular, **na ordem em que
   * devem aparecer**. Até cinco; o resto é ignorado pela barra.
   *
   * Sem isto, a barra mostra os cinco primeiros itens dos grupos achatados — o
   * que segue a ordem da coluna, pensada para tela grande. Mas quem usa o
   * celular costuma ser outra pessoa, com outra tarefa: o app de campo raramente
   * quer na barra os mesmos cinco, na mesma ordem, que a coluna do escritório.
   */
  barraCelular?: string[];
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
export default function RailLayout({ grupos, barraCelular, conta, onSair, logo }: RailLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const contexto = useMemo<RailOutletContext>(
    () => ({
      abrirMenu: () => setMenuOpen(true),
      itens: itensDaBarra(grupos, barraCelular),
      conta,
      onSair,
    }),
    [grupos, barraCelular, conta, onSair],
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
