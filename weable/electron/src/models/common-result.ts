export const CodeOk = 200
export const CodeNotFound = 404

export const CodeUnauthorized = 401

export interface PLInsertResult {
    pk: string
    changes: number
}

export interface PLDeleteResult {
    pk: string
    changes: number
}

export interface PLUpdateResult {
    pk: string
    changes: number
}

export interface PLBizError extends Error {
    code: number
    message: string
}

export function NewBizError(code: number, message: string): Error {
    const fullMessage = JSON.stringify({
        code,
        message
    })
    return new Error(fullMessage)
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

export function plAssertBizError(error: Error) {
    if (error) {
        throw new Error(error.toString())
    }
}

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

