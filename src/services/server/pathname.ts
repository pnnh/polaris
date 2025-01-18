import {headers} from "next/headers";

export async function getPathname(): Promise<string> {
    const headersList = await headers();
    let pathname = headersList.get('x-pathname') || "";
    if (pathname) {
        return pathname;
    }
    pathname = headersList.get("x-invoke-path") || "";
    if (pathname) {
        return pathname;
    }
    const fullUrl = headersList.get('referer') || "";
    if (fullUrl) {
        const url = new URL(fullUrl)
        return url.pathname
    }
    const headerUrl = headersList.get('x-url') || "";
    if (headerUrl) {
        return headerUrl;
    }
    return headersList.get('next-url') ?? ""
}

export async function getClientIp(): Promise<string> {
    const headersList = await headers()
    return  headersList.get('x-ip') || 'unknown'
}