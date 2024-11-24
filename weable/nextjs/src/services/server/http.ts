import axios from 'axios'
import {cookies} from 'next/headers'
import 'server-only'

export async function serverMakeHttpGet<T>(url: string): Promise<T> {
    const cookieStore = cookies()
    const authHeader = cookieStore.toString()

    const response = await axios.get<T>(url, {
        headers: {
            Cookie: authHeader,
        },
    })
    return response.data
}
