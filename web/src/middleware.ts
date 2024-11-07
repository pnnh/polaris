import {NextRequest, NextResponse} from 'next/server';
import {fallbackLng, languages} from '@/services/common/i18n/settings'
import {getAcceptLanguage} from "@/services/server/i18n";


export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const url = new URL(request.url);
    const origin = url.origin;
    const pathname = url.pathname;
    requestHeaders.set('x-url', request.url);
    requestHeaders.set('x-origin', origin);
    requestHeaders.set('x-pathname', pathname);

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


    let lang
    const langInPathname = languages.find((l: string) => request.nextUrl.pathname.startsWith(`/${l}`))
    if (langInPathname) {
        lang = getAcceptLanguage(langInPathname)
    }
    if (!lang) lang = getAcceptLanguage(request.headers.get('Accept-Language') || '')
    if (!lang) lang = fallbackLng

    if (
        !langInPathname &&
        !request.nextUrl.pathname.startsWith('/_next')
    ) {
        const newPath = `/${lang}${request.nextUrl.pathname}`
        return NextResponse.redirect(new URL(newPath, request.url))
    }

    requestHeaders.set('x-lang', lang)
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|assets|restful|static|favicon.ico).*)'],
}
