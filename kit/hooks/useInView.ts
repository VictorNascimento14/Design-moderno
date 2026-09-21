import { useEffect, useRef, useState } from "react";

/**
 * Dispara uma única vez quando o elemento entra na viewport. Usado pelas
 * barras e contadores: animar o que está fora da tela desperdiça quadros e,
 * pior, o usuário chega depois da animação já ter acabado.
 *
 * Sem `IntersectionObserver` (ou em ambiente sem DOM) devolve `true` de saída,
 * para o conteúdo nunca ficar preso no estado inicial.
 */
export function useInView<T extends HTMLElement>(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      // threshold 0: um cartão mais alto que a viewport nunca alcançaria uma
      // fração mínima visível e ficaria preso em opacity-0. Quem decide o
      // ponto de disparo é o rootMargin.
      { rootMargin, threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}
