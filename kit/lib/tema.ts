// Tema claro/escuro. O tema mora numa classe `dark` no <html> — é o que as
// rampas de `src/index.css` e o `darkMode: 'class'` do Tailwind observam.
//
// A escolha do usuário fica no `localStorage`; sem escolha, vale a preferência
// do sistema, e ela continua valendo se o sistema mudar no meio da sessão.
// Um script em `index.html` aplica a classe antes da primeira pintura, senão a
// tela pisca branca antes do React montar.

import { SLUG } from "./marca";

export type Tema = "claro" | "escuro" | "sistema";

export const CHAVE_TEMA = `${SLUG}-tema`;

function ehTema(v: unknown): v is Tema {
  return v === "claro" || v === "escuro" || v === "sistema";
}

/** O que o usuário escolheu; "sistema" enquanto ele não escolheu nada. */
export function temaEscolhido(): Tema {
  try {
    const v = localStorage.getItem(CHAVE_TEMA);
    return ehTema(v) ? v : "sistema";
  } catch {
    return "sistema";
  }
}

/** O aparelho está no escuro? */
export function sistemaEscuro(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches;
}

/** O tema que está valendo agora, já resolvido. */
export function temaEfetivo(escolhido: Tema = temaEscolhido()): "claro" | "escuro" {
  if (escolhido === "sistema") return sistemaEscuro() ? "escuro" : "claro";
  return escolhido;
}

/** Escreve (ou tira) a classe `dark` no <html>. */
export function aplicarTema(escolhido: Tema = temaEscolhido()): void {
  document.documentElement.classList.toggle("dark", temaEfetivo(escolhido) === "escuro");
}

/** Guarda a escolha e aplica na hora. */
export function definirTema(escolhido: Tema): void {
  try {
    if (escolhido === "sistema") localStorage.removeItem(CHAVE_TEMA);
    else localStorage.setItem(CHAVE_TEMA, escolhido);
  } catch {
    // Sem storage a escolha não sobrevive ao recarregar, mas vale na sessão.
  }
  aplicarTema(escolhido);
}

/**
 * Acompanha a preferência do sistema enquanto o usuário não escolheu um tema.
 * Devolve a função que desliga o acompanhamento.
 */
export function observarSistema(aoMudar: () => void): () => void {
  if (typeof matchMedia !== "function") return () => {};
  const mq = matchMedia("(prefers-color-scheme: dark)");
  const ouvinte = () => {
    if (temaEscolhido() === "sistema") {
      aplicarTema("sistema");
      aoMudar();
    }
  };
  mq.addEventListener("change", ouvinte);
  return () => mq.removeEventListener("change", ouvinte);
}
