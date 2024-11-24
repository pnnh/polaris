export const CodeOk = 200
export const CodeNotFound = 404
export const CodeUnauthorized = 401

export interface PLSelectResult<T> {
    page: number
    size: number
    count: number
    range: T[]
}

export class CommonResult<T> {
    code = 0
    message = ''
    data: T = {} as T
}
