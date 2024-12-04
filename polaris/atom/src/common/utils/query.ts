import queryString, { ParsedQuery } from 'query-string'

export function replaceSearchParams (searchParams: Record<string, string>, key: string, value: string): string {
  // 先序列化再反序列化避免修改原对象
  const newQueryParams = queryString.parse(queryString.stringify(searchParams))
  newQueryParams[key] = value
  return '?' + queryString.stringify(newQueryParams)
}

export function replaceParsedQuery (parsedQuery: ParsedQuery<string>, key: string, value: string): string {
  // 先序列化再反序列化避免修改原对象
  const newQueryParams = queryString.parse(queryString.stringify(parsedQuery))
  newQueryParams[key] = value
  return '?' + queryString.stringify(newQueryParams)
}

// deprecated
export function replaceQueryString (rawQuery: string, key: string, value: string): string {
  // 先序列化再反序列化避免修改原对象
  const newQueryParams = queryString.parse(rawQuery)
  newQueryParams[key] = value
  return '?' + queryString.stringify(newQueryParams)
}

export function replaceQueryStringNew (rawQuery: string, key: string, value: string): string {
  // 先序列化再反序列化避免修改原对象
  const newQueryParams = queryString.parse(rawQuery)
  newQueryParams[key] = value
  return queryString.stringify(newQueryParams)
}
