# vidro-orgânico

Sistema visual completo — cor, vidro, movimento, primitivos e a casca do app (coluna lateral,
cabeçalho, barra de baixo do celular) — extraído do COMINT para ser instalado em qualquer projeto
React + Vite + Tailwind.

**Não é uma descrição do visual: são os arquivos.** O que você instala é o mesmo código que roda no
COMINT — mesma curva, mesmas durações, mesmo marcador que desliza, mesma espiada por hover.

```
kit/        o sistema (o que é copiado para src/ui/ do projeto)
template/   o scaffolding de um projeto novo (Vite + React + TS, sem legado)
instalar.sh copia um, o outro, ou os dois
docs/       DESIGN-SYSTEM.md (as invariantes) e AGENTS-SNIPPET.md
```

---

## Projeto novo

```bash
cd ~/Documentos/DEV
git clone <este-repo> vidro-organico     # ou copie a pasta
./vidro-organico/instalar.sh ~/Documentos/DEV/meu-app --nome "Acme" --slug acme
cd ~/Documentos/DEV/meu-app && npm install && npm run dev
```

Sobe em `localhost:3000` com cinco telas de demonstração: painel com indicadores, vitrine de
componentes, agenda, equipe e perfil. **Apague `src/paginas/` quando começar o de verdade** — elas
existem para você ver o sistema funcionando, não para virar o app.

Depois, dois arquivos:

- **`src/navegacao.tsx`** — os itens da coluna. Mexer aqui muda a coluna, a gaveta do celular e a
  barra de baixo de uma vez.
- **`src/ui/lib/marca.ts`** — nome, slug e monograma. O slug prefixa o `localStorage`; se mudar
  depois, mude também no script do `<head>` do `index.html`.

## Projeto que já existe

```bash
./vidro-organico/instalar.sh ~/Documentos/DEV/app-antigo --nome "Antigo" --slug antigo
```

Injeta só o kit em `src/ui/` e imprime as três linhas que faltam ligar (o import do CSS, o script do
tema no `<head>`, o CDN do Remix Icon). Nada do projeto é sobrescrito sem uma cópia `.bak` ao lado.

Requisitos: React 19, `react-router-dom` 7 (a coluna, o `PageShell` e a barra de baixo usam),
Tailwind 3.4 com `darkMode: 'class'`, e o `content` cobrindo `./src/**/*.{js,ts,jsx,tsx}`.

---

## O que vem

**Fundação** — `index.css` (7 rampas OKLCH, tema escuro, vidro, animações, micro-interações,
`::picker(select)`, `prefers-reduced-motion`, regras de impressão) · `tailwind.config.ts` ·
`postcss.config.ts`

**Primitivos** (`src/ui/base/`)

| | |
|---|---|
| `GlassCard` | cartão de vidro em 3 intensidades, entra subindo quando aparece |
| `GlassPill` | cápsula flutuante do cabeçalho e dos filtros |
| `StatCard` | indicador: rótulo, ícone em pastilha, número grande, rodapé |
| `MeterBar` | barra que cresce da esquerda ao entrar na tela |
| `AnimatedNumber` | conta de zero até o valor, com par `sr-only` |
| `Button` | pílula em 4 variantes, `type="button"` por padrão |
| `TextField` | campo em pílula com ícone, dica, erro e sucesso |
| `Modal` | cortina + vidro forte, em portal, fecha no Escape e no clique fora |
| `Dropdown` | painel que desdobra e dobra, fica montado fechado |
| `Glyph` | 23 ícones próprios, traçado 2.5 em caixa 24 |
| `Avatar` | disco de iniciais com cor derivada do nome |
| `Reveal` | envelope de entrada para o que não é cartão |
| `Calendar` | calendário mensal: hoje em pílula verde, dia marcado com ponto |

O instalador também escreve (ou anexa a) o **`CLAUDE.md`** do projeto com as invariantes — é o que
mantém o agente escrevendo telas dentro do sistema em vez de inventar uma segunda linguagem ao lado.

**Casca** (`src/ui/shell/`) — `RailLayout` (monta a coluna uma vez) · `Sidebar` (76↔236px, marcador
que desliza, espiada por hover, gaveta do celular) · `PageShell` (moldura da tela) · `AppHeader` ·
`BottomNav` · `BrandMark` · `TemaToggle` · `ToastHost`

**Utilidades** (`src/ui/lib/`, `src/ui/hooks/`) — `motion` (curva, durações, `stagger`,
`usePrefersReducedMotion`) · `tema` (claro/escuro/sistema) · `sidebarCollapsed` (store do colapso) ·
`toast` · `useInView`

Dependências do kit: `react`, `react-dom`, `react-router-dom`. Nada mais.

---

## Antes de mexer

Leia **[docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)**. São ~20 invariantes, e cada uma é um bug que
já aconteceu — `animation-fill-mode: both` matando o `:hover`, classe do Tailwind montada em runtime
que some no build, `{open && …}` matando a animação de saída, `fixed` dentro de `.glass` medindo o
cartão em vez da tela.

Num projeto com agente, cole **[docs/AGENTS-SNIPPET.md](docs/AGENTS-SNIPPET.md)** no `CLAUDE.md` /
`AGENTS.md` do projeto: é a versão curta das mesmas regras, escrita para ser lida antes de editar.

## Atualizar um projeto já instalado

Rodar o instalador de novo troca `src/ui/` inteiro (guardando `src/ui.bak`) e reescreve
`src/ui/lib/marca.ts` com o nome e o slug passados. Se você editou algo dentro de `src/ui/`, compare
com o `.bak` antes de seguir — o kit não faz merge.
