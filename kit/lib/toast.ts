// Avisos passageiros. Um store minúsculo em vez de contexto do React: quem
// dispara um aviso quase nunca é um componente (é o `catch` de um envio, o
// retorno de uma ação), e um contexto obrigaria tudo isso a virar hook.

export interface Toast {
  id: string;
  titulo: string;
  corpo?: string;
  /** Milissegundos na tela. */
  duracao?: number;
  /** Chamado no clique do aviso. */
  onClick?: () => void;
}

type Ouvinte = (t: Toast) => void;

const ouvintes = new Set<Ouvinte>();

export function assinarToasts(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

export function toast(titulo: string, corpo?: string, extra?: Omit<Toast, "id" | "titulo" | "corpo">) {
  const t: Toast = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, titulo, corpo, ...extra };
  ouvintes.forEach((o) => o(t));
}
