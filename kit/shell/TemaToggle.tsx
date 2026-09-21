import { useEffect, useState } from "react";
import { aplicarTema, definirTema, observarSistema, temaEfetivo, type Tema } from "../lib/tema";

interface TemaToggleProps {
  /** Tinta do ícone — o cabeçalho usa o verde da marca; a tela de entrada, a do texto. */
  className?: string;
}

/**
 * Alterna entre claro e escuro. Enquanto o usuário não tocar aqui, o tema
 * segue o do aparelho; o primeiro clique fixa a escolha dele.
 */
export default function TemaToggle({ className = "text-primary-900" }: TemaToggleProps) {
  const [atual, setAtual] = useState<"claro" | "escuro">(() => temaEfetivo());

  useEffect(() => {
    // O script de `index.html` já pintou a tela; isto só alinha o estado do
    // componente e acompanha o aparelho enquanto a escolha for "sistema".
    aplicarTema();
    setAtual(temaEfetivo());
    return observarSistema(() => setAtual(temaEfetivo()));
  }, []);

  function alternar() {
    const proximo: Tema = atual === "escuro" ? "claro" : "escuro";
    definirTema(proximo);
    setAtual(proximo);
  }

  const paraEscuro = atual === "claro";

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={paraEscuro ? "Usar o tema escuro" : "Usar o tema claro"}
      title={paraEscuro ? "Tema escuro" : "Tema claro"}
      className={`press grid h-10 w-10 cursor-pointer place-items-center rounded-full transition-colors hover:bg-primary-900/[0.07] ${className}`}
    >
      <i className={paraEscuro ? "ri-moon-line text-[18px]" : "ri-sun-line text-[18px]"} aria-hidden="true" />
    </button>
  );
}
