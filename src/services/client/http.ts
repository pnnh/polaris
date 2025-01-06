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

export function getBackendUrl() {
    return 'http://127.0.0.1:8001'
}
