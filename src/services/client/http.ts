export async function makePost<T>(url: string, params: unknown): Promise<T> {
    const response = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
    return response.json()
}

export async function makeGet<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        credentials: 'include',
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
    return response.json()
}

