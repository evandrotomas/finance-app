export const getTransactionDate = (transaction) => {
  if (!transaction || !transaction.date) return null

  // Extrai apenas a parte da data (AAAA-MM-DD)
  const [year, month, day] = transaction.date
    .split('T')[0]
    .split('-')
    .map(Number)

  // Cria a data no fuso LOCAL (sem deslocar para UTC)
  const localDate = new Date(year, month - 1, day, 0, 0, 0, 0)

  return localDate
}
