const currencyFormatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
})

/**
 * Formats a numeric price as a shekel currency string, e.g. 18.5 -> "₪18.50".
 * Returns a placeholder for null/undefined values.
 */
export function formatPrice(value) {
  if (value === null || value === undefined) return '—'
  return currencyFormatter.format(value)
}
