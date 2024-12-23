export async function clientMakeHttpGet<T>(url: string): Promise<T> {


    const response = await fetch(url, {
        credentials: 'include',
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    })
    return response.json()
}

export async function clientMakeHttpPut<T>(url: string, params: unknown): Promise<T> {
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(params),
    }) as T
    return response
}
