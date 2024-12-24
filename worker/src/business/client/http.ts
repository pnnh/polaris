export async function clientMakeHttpGet<T>(url: string): Promise<T> {
    const response = await fetch(url, {}) as T
    return response
}

export async function clientMakeHttpPut<T>(url: string, params: unknown): Promise<T> {
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(params),
    })
    return response as T
}
