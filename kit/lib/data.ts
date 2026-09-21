/**
 * Data local em `AAAA-MM-DD`.
 *
 * NÃO use `toISOString()` para isto: ele converte para UTC, e num fuso negativo
 * (o Brasil inteiro) o dia vira o seguinte a partir das 21h — "hoje" acenderia
 * no dia errado toda noite.
 *
 * Mora aqui, e não dentro do `Calendar`, porque quem consome o calendário
 * precisa dela: `marcados` são strings e `onDayClick` devolve um `Date`, então
 * casar um com o outro sem esta função obriga cada tela a reimplementá-la — e
 * a reimplementação óbvia é justamente a errada.
 */
export function diaISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
