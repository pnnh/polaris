export const CodeOk = 200
export const CodeNotFound = 404
export const CodeUnauthorized = 401

export class CommonResult<T> {
    code = 0
    message = ''
    data: T = {} as T
}

export interface PLSelectResult<T> {
    page: number
    size: number
    count: number
    range: T[]
}

export function emptySelectResult<T>(): PLSelectResult<T> {
    return {
        page: 0,
        size: 0,
        count: 0,
        range: []
    }
}
