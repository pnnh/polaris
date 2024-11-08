export const CodeOk = 200
export const CodeFailed = 500
export const CodeBadRequest = 400
export const CodeNotFound = 404
export const CodeUnauthorized = 401

export interface PLBizError extends Error {
    code: number
    message: string
}

export function PLParseBizError(error: Error) {
    const text = error.message
    try {
        return JSON.parse(text) as PLBizError
    } catch (e) {
        return {
            message: text
        } as PLBizError
    }
}

export interface PLSelectData<T> {
    page: number
    size: number
    count: number
    range: T[]
}

export type PLSelectResult<T> = CommonResult<PLSelectData<T>>

export class CommonResult<T> {
    code = 0
    message = ''
    data: T = {} as T
}

