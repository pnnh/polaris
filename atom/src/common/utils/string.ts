export function generatorRandomString (length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export function STSubString (str: string | undefined, length: number,
  suffix: string = '...') {
  if (!str || length <= 0) return ''
  return str.length > 100 ? str.slice(0, length) + suffix : str
}
