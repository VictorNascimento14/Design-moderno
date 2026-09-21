import type { Conta, GrupoNav } from "@/ui";

/**
 * A navegação do app — a única coisa que a coluna lateral, a gaveta do celular
 * e a barra de baixo leem. Mexer aqui muda as três de uma vez.
 *
 * `icon` sai do conjunto `Glyph` (`src/ui/base/Glyph.tsx`); um ícone novo é um
 * `path` a mais lá dentro, no mesmo traçado de 2.5.
 */
export const GRUPOS: GrupoNav[] = [
  {
    chave: "menu",
    rotulo: "Menu principal",
    itens: [
      // `exact` porque "/" é prefixo de toda rota: sem ele, "Início" fica
      // marcado como ativo em todas as telas.
      { key: "inicio", label: "Início", path: "/", icon: "grid", exact: true },
      { key: "componentes", label: "Componentes", path: "/componentes", icon: "chart" },
      { key: "agenda", label: "Agenda", path: "/agenda", icon: "calendar" },
      { key: "equipe", label: "Equipe", path: "/equipe", icon: "users" },
    ],
  },
];

/** Quem está na sessão. Num app de verdade, vem do backend. */
export const CONTA: Conta = {
  nome: "Victor Nascimento",
  papel: "Administração",
  href: "/perfil",
};
