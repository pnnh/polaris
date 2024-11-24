import { headers } from "next/headers"

export function userRole() {
    const headersList = headers()
    const plSchema = headersList.get('PSRole') || 'polaris' 
    return plSchema
}