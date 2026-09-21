// Estado de colapso da coluna lateral — preferência do usuário, persistida
// localmente. A coluna lê para se desenhar estreita ou larga; as páginas leem
// para deslocar o conteúdo (`md:pl-*`). Como os dois lados são componentes
// irmãos, o valor vive num pequeno store observável em vez de prop-drilling:
// sem ele, alternar o colapso redesenharia a coluna mas não o conteúdo.

import { useSyncExternalStore } from "react";

import { SLUG } from "./marca";

const STORAGE_KEY = `${SLUG}-sidebar-collapsed`;

const listeners = new Set<() => void>();
let collapsed = readStorage();
let peeking = false;
reflectOnRoot();

/**
 * Espelha a largura efetiva da coluna no `<html data-rail>`. É o que permite
 * que o conteúdo das páginas se desloque via CSS puro (`.rail-offset`), sem
 * que cada tela precise assinar o store — e é assim que a página reflui junto
 * com a coluna, como no design.
 *
 * Três estados, duas larguras: `collapsed` é estreito; `open` (fixada) e
 * `peek` (espiada por hover) são largos. A espiada é volátil de propósito —
 * não vira preferência gravada.
 */
function reflectOnRoot(): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.rail = collapsed
    ? peeking
      ? "peek"
      : "collapsed"
    : "open";
}

function readStorage(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function isSidebarCollapsed(): boolean {
  return collapsed;
}

export function setSidebarCollapsed(value: boolean): void {
  if (collapsed === value) return;
  collapsed = value;
  try {
    if (value) {
      localStorage.setItem(STORAGE_KEY, "1");
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Modo privativo / storage bloqueado: a preferência vale só nesta sessão.
  }
  reflectOnRoot();
  listeners.forEach((l) => l());
}

/**
 * Liga/desliga a espiada por hover. Só tem efeito com a coluna recolhida:
 * fixada aberta, ela já está larga. A coluna assina (`useRailPeek`) a mesma
 * fonte que desloca a página, então as duas nunca divergem.
 */
export function setRailPeek(value: boolean): void {
  if (peeking === value) return;
  peeking = value;
  reflectOnRoot();
  listeners.forEach((l) => l());
}

export function isRailPeeking(): boolean {
  return peeking;
}

/** Assina o estado de colapso — redesenha quem usa quando ele muda. */
export function useSidebarCollapsed(): boolean {
  return useSyncExternalStore(subscribe, isSidebarCollapsed, () => false);
}

/** Assina a espiada — a coluna redesenha larga ou estreita quando ela muda. */
export function useRailPeek(): boolean {
  return useSyncExternalStore(subscribe, isRailPeeking, () => false);
}

// Larguras da coluna flutuante: 76px recolhida, 236px fixada aberta, com
// 16px de folga de cada lado (a coluna flutua sobre o fundo, não encosta).
export const RAIL_WIDTH_COLLAPSED = 76;
export const RAIL_WIDTH_OPEN = 236;

/**
 * Classe única de deslocamento do conteúdo. Qual valor ela vale (108px
 * recolhida, 268px aberta) é decidido no CSS a partir de `html[data-rail]`,
 * então nenhuma página precisa reagir ao store — e a mudança é animada.
 */
export function sidebarMdClass(): string {
  return "rail-offset";
}
