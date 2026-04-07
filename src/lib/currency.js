import { countryData } from './countrydata.js'

/**
 * Converts a USD amount to the user's localized currency based on their country.
 * Uses a caching strategy to fetch the latest exchange rates.
 * 
 * @param {number} usdAmount - The amount in USD
 * @param {string} countryName - The name of the country (e.g. from user.Country)
 * @returns {Promise<{amount: number, symbol: string, code: string, formatted: string}>}
 */
export async function getUserCurrency(usdAmount, countryName) {
  // Fallback to purely USD if no country is specified
  const fallback = {
    amount: usdAmount || 0,
    symbol: '$',
    code: 'USD',
    formatted: `$${(usdAmount || 0).toLocaleString()}`
  }

  if (!countryName) return fallback

  // Find the exact country match ignoring case
  const country = countryData.find(c => c.name.toLowerCase() === countryName.toLowerCase())

  if (!country || !country.currency || !country.currency.code || country.currency.code === 'USD') {
    return fallback
  }

  const currencyCode = country.currency.code.toLowerCase()

  try {
    // Fetch live rates, caching for 1 hour to reduce API hits and improve speed
    const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json', {
      next: { revalidate: 3600 }
    })

    if (!res.ok) throw new Error('Failed to fetch exchange rates')

    const data = await res.json()
    const rate = data.usd[currencyCode]

    if (!rate) throw new Error(`Exchange rate for ${currencyCode} not found`)

    const convertedAmount = (usdAmount || 0) * rate

    // Some symbols in the data are "false" or empty, so we fallback to the currency code
    const symbol = country.currency.symbol || `${currencyCode.toUpperCase()} `

    return {
      amount: convertedAmount,
      symbol,
      code: currencyCode.toUpperCase(),
      formatted: `${symbol}${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    }

  } catch (err) {
    console.error('Currency Conversion Error:', err.message)
    return fallback
  }
}
