import type { HTMLAttributes, ReactNode } from "react";

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  children: ReactNode;
}

/**
 * Painel que desdobra ao abrir e dobra ao fechar — a coreografia de todo
 * dropdown do app (`.dropdown` em `index.css`): estica da altura zero até o
 * conteúdo e os itens marcados com `.dropdown-item` entram um a um.
 *
 * Fica montado quando fechado, senão a saída não anima; `inert` o tira do
 * foco, do clique e do leitor de tela enquanto isso. Posição, vidro e padding
 * vêm do `className` de quem usa.
 */
export default function Dropdown({ open, className = "", children, ...rest }: DropdownProps) {
  return (
    <div {...rest} data-open={open} inert={!open} className={`dropdown ${className}`}>
      <div>{children}</div>
    </div>
  );
}
