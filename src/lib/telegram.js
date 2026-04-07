/** Public Telegram channel — override with NEXT_PUBLIC_TELEGRAM_URL in .env */
export const TELEGRAM_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_TELEGRAM_URL) ||
  'https://t.me/Themusafx'
