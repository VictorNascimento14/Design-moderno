import type { ReactNode } from "react";

import type { GlyphName } from "../base/Glyph";

/** Um destino da navegação. */
export type ItemNav = {
  /** Identificador estável — é a `key` do React, não aparece na tela. */
  key: string;
  label: string;
  path: string;
  icon: GlyphName;
  /**
   * Ativo só no caminho exato. Ligue na raiz (`/`) e em qualquer rota que
   * seja prefixo de outra, senão ela fica marcada como ativa o tempo todo.
   */
  exact?: boolean;
};

/** Uma seção dobrável da coluna. Um grupo só é o caso comum. */
export type GrupoNav = {
  chave: string;
  rotulo: string;
  itens: ItemNav[];
};

/** O bloco de conta no pé da coluna e na pílula do cabeçalho. */
export type Conta = {
  /** Nome completo; o primeiro nome é o que aparece. */
  nome: string;
  /** Linha de baixo: cargo, papel, e-mail — o que identificar a sessão. */
  papel?: string;
  /** Para onde o bloco leva. Sem ele, o bloco não é clicável. */
  href?: string;
  /** Sobrescreve o disco de iniciais (uma foto, um `<Avatar src>`). */
  avatar?: ReactNode;
};

/** Ativo no caminho atual? Regra única, usada pela coluna e pela barra de baixo. */
export function itemAtivo(item: ItemNav, pathname: string): boolean {
  if (item.exact || item.path === "/") return pathname === item.path;
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

/**
 * Os destinos da barra de baixo do celular.
 *
 * Com `chaves`, a ordem é a pedida e cada `key` é procurada entre todos os
 * itens; `key` que não existe é **ignorada**, em vez de virar um buraco na
 * barra — errar o nome de um destino não pode derrubar a navegação inteira.
 *
 * Sem `chaves`, o padrão de sempre: os itens achatados, na ordem da coluna.
 */
export function itensDaBarra(grupos: GrupoNav[], chaves?: string[]): ItemNav[] {
  const todos = grupos.flatMap((g) => g.itens);
  if (!chaves) return todos;
  return chaves
    .map((k) => todos.find((i) => i.key === k))
    .filter((i): i is ItemNav => i !== undefined);
}
