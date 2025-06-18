import {NextRequest, NextResponse} from 'next/server';
import {getLanguageFromPathname, langEn, langZh} from "@/atom/common/language";

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const url = new URL(request.url);
    const origin = url.origin;
    const pathname = url.pathname;
    requestHeaders.set('x-url', request.url);
    requestHeaders.set('x-origin', origin);
    requestHeaders.set('x-pathname', pathname);
    requestHeaders.set('x-search', url.search);

    let ip = requestHeaders.get("x-forwarded-for");
    if (ip) {
        requestHeaders.set("x-ip", ip);
    } else {
        ip = requestHeaders.get("cf-connecting-ip");
        if (ip) {
            requestHeaders.set("x-ip", ip);
        } else {
            ip = requestHeaders.get("x-real-ip");
            if (ip) {
                requestHeaders.set("x-ip", ip);
            }
        }
    }
    let lang = getLanguageFromPathname(pathname)
    if (!lang) {
        if (pathname === '/') {
            lang = langEn;  // Default to English if no language is specified
        } else {
            return new NextResponse('Page Not Found', {status: 404});
        }
    }
    if (lang !== langEn && lang !== langZh) {
        return new NextResponse('Page Not Found', {status: 404});
    }
    requestHeaders.set('x-lang', lang)

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })
}

export const config = {
    matcher: [
        '/((?!_next|images|fonts|icons|pwa|ads.txt|favicon.ico|polaris).*)'
    ],
}
