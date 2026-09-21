import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../hooks/useInView";

interface RevealProps {
  children: ReactNode;
  /** Atraso da entrada, em ms — escalone com `stagger(i)`. */
  delay?: number;
  className?: string;
}

/**
 * Envelope de entrada para o que não é um `GlassCard`: sobe e aparece quando
 * entra na tela, com o mesmo tempo e a mesma curva dos cartões.
 */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${inView ? "animate-rise" : "opacity-0"} ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
