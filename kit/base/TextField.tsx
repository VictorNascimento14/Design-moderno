import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
  hint?: string;
  error?: string;
  success?: boolean;
  right?: ReactNode;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, icon, hint, error, success, right, id, className = "", ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-foreground-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {/* `z-10`: o `backdrop-blur` do campo cria contexto de empilhamento, e o
            campo — que vem depois no DOM — pintava POR CIMA do ícone. */}
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 z-10 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-base text-foreground-400">
            <i className={icon} aria-hidden="true" />
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-full border bg-surface/70 px-[18px] py-3 text-sm text-foreground-950 backdrop-blur-sm transition-colors duration-200 placeholder:text-foreground-400 ${
            icon ? "pl-11" : ""
          } ${right ? "pr-12" : ""} ${
            error
              ? "border-red-400 focus:border-red-500"
              : success
              ? "border-primary-500 focus:border-primary-600"
              : "border-foreground-950/[0.10] hover:border-foreground-950/25 focus:border-primary-600"
          }`}
          {...rest}
        />
        {right}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-foreground-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default TextField;