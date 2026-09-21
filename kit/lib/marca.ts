// A única coisa que cada projeto troca ao instalar o sistema visual.
//
// `SLUG` prefixa tudo que vai para o `localStorage` (tema, colapso da coluna).
// Dois apps no mesmo domínio com o mesmo slug brigariam pela mesma chave, e o
// usuário veria a coluna de um recolhida porque recolheu a do outro.

/** Identificador curto, em minúsculas, sem espaço. Prefixo do `localStorage`. */
export const SLUG = "app";

/** Nome que aparece no logotipo escrito, ao lado do monograma. */
export const NOME = "APP";

/** Letra do monograma no disco verde. Uma só — duas não cabem em 28px. */
export const MONOGRAMA = NOME.charAt(0).toUpperCase();
