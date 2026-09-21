import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "ghost";
  fullWidth?: boolean;
  loading?: boolean;
}

/**
 * Botão do sistema — pílula, como todo controle pequeno do design. O primário
 * é o verde profundo da marca com a mesma sombra do item ativo da coluna.
 */
export default function Button({
  // Padrão explícito: sem ele o botão vira "submit" dentro de um <form> e
  // envia o formulário sem querer. Quem precisa enviar passa type="submit".
  type = "button",
  variant = "primary",
  fullWidth,
  loading,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    "press inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-primary-900 text-primary-50 shadow-nav-active hover:bg-primary-800",
    accent: "bg-accent-600 text-accent-50 hover:bg-accent-700",
    secondary: "bg-secondary-100 text-secondary-800 hover:bg-secondary-200",
    ghost: "bg-transparent text-primary-800 hover:bg-primary-900/[0.07]",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <i className="ri-loader-4-line animate-spin text-base" aria-hidden="true" />}
      {children}
    </button>
  );
}
