import {NextResponse} from 'next/server';

export function middleware(request: Request) {
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

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    });
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
