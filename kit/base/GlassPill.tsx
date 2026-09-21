import type { CSSProperties, ReactNode } from "react";

interface GlassPillProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Pílula de vidro — a cápsula flutuante que o design usa no cabeçalho
 * (contexto à esquerda, conta à direita) e nos filtros.
 */
export default function GlassPill({ children, className = "", style }: GlassPillProps) {
  return (
    <div
      className={`glass-pill inline-flex items-center gap-2.5 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
