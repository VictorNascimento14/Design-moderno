#!/usr/bin/env bash
#
# Instala o sistema visual "vidro orgânico" num projeto.
#
#   ./instalar.sh ~/projetos/novo-app --nome "Acme" --slug acme
#
# Destino vazio (ou inexistente) → projeto novo: template + kit, pronto para
# `npm install && npm run dev`.
# Destino com package.json → injeta só o kit em `src/ui/` e diz o que falta
# ligar à mão. Nada do projeto é sobrescrito sem cópia de segurança.

set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DESTINO=""
NOME=""
SLUG=""

while [ $# -gt 0 ]; do
  case "$1" in
    --nome) NOME="${2:?--nome precisa de um valor}"; shift 2 ;;
    --slug) SLUG="${2:?--slug precisa de um valor}"; shift 2 ;;
    -h|--help) sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    -*) echo "Opção desconhecida: $1" >&2; exit 2 ;;
    *) DESTINO="$1"; shift ;;
  esac
done

if [ -z "$DESTINO" ]; then
  echo "Uso: ./instalar.sh <pasta-do-projeto> [--nome \"Acme\"] [--slug acme]" >&2
  exit 2
fi

mkdir -p "$DESTINO"
DESTINO="$(cd "$DESTINO" && pwd)"

# Nome e slug: o que foi passado, senão o nome da pasta.
BASE="$(basename "$DESTINO")"
[ -n "$NOME" ] || NOME="$BASE"
if [ -z "$SLUG" ]; then
  SLUG="$(printf '%s' "$BASE" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed 's/^-//; s/-$//')"
fi
MONO="$(printf '%s' "$NOME" | cut -c1 | tr '[:lower:]' '[:upper:]')"

PROJETO_NOVO=0
[ -f "$DESTINO/package.json" ] || PROJETO_NOVO=1

# Guarda uma cópia antes de escrever por cima de algo que já existia.
preservar() {
  if [ -e "$1" ]; then
    cp -r "$1" "$1.bak"
    echo "   ↩︎  $(basename "$1") já existia — cópia em $(basename "$1").bak"
  fi
}

echo "▸ Sistema visual → $DESTINO"
echo "   nome: $NOME · slug: $SLUG"
echo

if [ "$PROJETO_NOVO" = 1 ]; then
  echo "▸ Projeto novo: copiando o template"
  cp -r "$AQUI/template/." "$DESTINO/"
fi

echo "▸ Copiando o kit para src/ui/"
mkdir -p "$DESTINO/src"
preservar "$DESTINO/src/ui"
rm -rf "$DESTINO/src/ui"
cp -r "$AQUI/kit" "$DESTINO/src/ui"

echo "▸ Configurando Tailwind e PostCSS"
# O `content` do Tailwind precisa varrer src/ — é lá que o kit pousa.
TAILWIND_SUBSTITUIDO=0
[ -e "$DESTINO/tailwind.config.ts" ] && TAILWIND_SUBSTITUIDO=1
preservar "$DESTINO/tailwind.config.ts"
mv "$DESTINO/src/ui/tailwind.config.ts" "$DESTINO/tailwind.config.ts"
if [ ! -f "$DESTINO/postcss.config.ts" ] && [ ! -f "$DESTINO/postcss.config.js" ]; then
  mv "$DESTINO/src/ui/postcss.config.ts" "$DESTINO/postcss.config.ts"
else
  rm -f "$DESTINO/src/ui/postcss.config.ts"
  echo "   ↩︎  postcss.config já existe — mantido como está"
fi

echo "▸ Ensinando as regras ao agente (CLAUDE.md)"
# Sem isto, o agente do projeto novo escreve telas fora do sistema: `bg-white`
# sólido no lugar do vidro, `{open && …}` no lugar do <Dropdown>, coluna montada
# dentro da página. Foi assim que o projeto de origem juntou 145 `bg-white` em
# 37 arquivos antes de importar o design.
REGRAS="$AQUI/docs/AGENTS-SNIPPET.md"
BLOCO="$(sed -n '/^## 🎨 Sistema visual/,$p' "$REGRAS")"
if [ -f "$DESTINO/CLAUDE.md" ]; then
  if grep -q "Sistema visual — invariantes" "$DESTINO/CLAUDE.md"; then
    echo "   ↩︎  CLAUDE.md já tem as invariantes — mantido como está"
  else
    printf '\n\n%s\n' "$BLOCO" >> "$DESTINO/CLAUDE.md"
    echo "   +  bloco anexado ao CLAUDE.md que já existia"
  fi
else
  printf '# %s\n\n%s\n' "$NOME" "$BLOCO" > "$DESTINO/CLAUDE.md"
fi

echo "▸ Escrevendo a marca"
cat > "$DESTINO/src/ui/lib/marca.ts" <<EOF
// A única coisa que cada projeto troca ao instalar o sistema visual.
//
// \`SLUG\` prefixa tudo que vai para o \`localStorage\` (tema, colapso da coluna).
// Dois apps no mesmo domínio com o mesmo slug brigariam pela mesma chave, e o
// usuário veria a coluna de um recolhida porque recolheu a do outro.

/** Identificador curto, em minúsculas, sem espaço. Prefixo do \`localStorage\`. */
export const SLUG = "$SLUG";

/** Nome que aparece no logotipo escrito, ao lado do monograma. */
export const NOME = "$NOME";

/** Letra do monograma no disco verde. Uma só — duas não cabem em 28px. */
export const MONOGRAMA = "$MONO";
EOF

if [ "$PROJETO_NOVO" = 1 ]; then
  # O script anti-flash do index.html lê a chave do tema antes do React montar:
  # o prefixo dele tem que ser o mesmo SLUG.
  sed -i "s/'app-tema'/'$SLUG-tema'/; s|<title>App</title>|<title>$NOME</title>|" "$DESTINO/index.html"
  sed -i "s/\"name\": \"app\"/\"name\": \"$SLUG\"/" "$DESTINO/package.json"
fi

echo
if [ "$PROJETO_NOVO" = 1 ]; then
  cat <<EOF
✓ Projeto novo pronto.

   cd $DESTINO
   npm install
   npm run dev

Depois: src/navegacao.tsx (os itens da coluna) e src/ui/lib/marca.ts (a marca).

O CLAUDE.md já foi escrito com as invariantes do sistema — é o que faz o agente
deste projeto novo escrever telas DENTRO do design, em vez de inventar uma
segunda linguagem visual ao lado.
EOF
else
  cat <<EOF
✓ Kit instalado em src/ui/.

Falta ligar — três linhas:

 1. O CSS, no seu entrypoint (src/main.tsx):
       import "./ui/index.css";
    ⚠️  Ele já traz \`@tailwind base/components/utilities\`. Se o seu CSS atual
        também traz, apague de lá — duas vezes duplica todo o utilitário.

 2. O tema antes da primeira pintura, no <head> do index.html:
       <script>
         try {
           var e = localStorage.getItem('$SLUG-tema');
           if (e === 'escuro' || (e !== 'claro' && matchMedia('(prefers-color-scheme: dark)').matches))
             document.documentElement.classList.add('dark');
         } catch (e) {}
       </script>
    Sem isso a tela pisca clara antes de o React montar.

 3. Os ícones Remix (sol/lua do tema, fechar do modal), no <head>:
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" />

O CLAUDE.md recebeu as invariantes do sistema — é o que faz o agente escrever
telas dentro do design em vez de inventar uma segunda linguagem ao lado.

Conferir depois: \`darkMode: 'class'\` e o \`content\` do tailwind.config.ts
cobrindo ./src/**/*.{js,ts,jsx,tsx}; \`react-router-dom\` instalado (a coluna, o
PageShell e a barra de baixo usam).
EOF
  if [ "$TAILWIND_SUBSTITUIDO" = 1 ]; then
    cat <<'EOF'

⚠️  O tailwind.config.ts do projeto foi SUBSTITUÍDO pelo do sistema — as rampas
    de cor, os raios, as sombras e as curvas moram nele e o sistema não funciona
    sem. O seu está em tailwind.config.ts.bak: traga de lá, para dentro de
    `theme.extend`, o que era seu. O instalador não mescla.
EOF
  fi
fi
