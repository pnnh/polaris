import {headers} from "next/headers";

export function getPathname(): string {
    const headersList = headers();
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
