import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { RailLayout, ToastHost, toast } from "@/ui";
import { CONTA, GRUPOS } from "./navegacao";
import Agenda from "./paginas/Agenda";
import Componentes from "./paginas/Componentes";
import Equipe from "./paginas/Equipe";
import Inicio from "./paginas/Inicio";
import Perfil from "./paginas/Perfil";

/**
 * Toda tela com coluna lateral é filha da rota do `RailLayout`: ele monta a
 * coluna UMA vez e passa navegação, conta e "sair" às telas pelo contexto.
 * Montar a coluna dentro de cada página a recria a cada clique.
 *
 * `element` em JSX (`<Inicio />`), nunca a referência (`Inicio`) — a segunda
 * forma compila e quebra só em runtime.
 */
const router = createBrowserRouter([
  {
    element: (
      <RailLayout grupos={GRUPOS} conta={CONTA} onSair={() => toast("Sessão encerrada", "Até logo.")} />
    ),
    children: [
      { path: "/", element: <Inicio /> },
      { path: "/componentes", element: <Componentes /> },
      { path: "/agenda", element: <Agenda /> },
      { path: "/equipe", element: <Equipe /> },
      { path: "/perfil", element: <Perfil /> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastHost />
    </>
  );
}
