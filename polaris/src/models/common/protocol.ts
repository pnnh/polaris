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

export interface PLInsertData<T> {
    changes: number
    urn: string
}

export type PLInsertResult<T> = CommonResult<PLInsertData<T>>

export type PLSelectResult<T> = CommonResult<PLSelectData<T>>

export function emptySelectResult() {
    return {
        code: CodeOk,
        message: '',
        data: {
            page: 1,
            size: 0,
            count: 0,
            range: []
        }
    }
}

export interface CommonResult<T> {
    code : number
    message : string
    data: T
}

