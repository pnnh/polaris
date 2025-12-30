export async function clientMakeHttpGet<T>(url: string): Promise<T> {
    const response = await fetch(url, {})
    return await response.json() as T
}

export async function clientMakeHttpPut<T>(url: string, params: unknown): Promise<T> {
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(params),
    }) as T
    return response
}
