import {NextRequest, NextResponse} from 'next/server';
import {getLanguageFromPathname, langEn, langZh} from "@/atom/common/language";
import {getLangFromUrl} from "@/components/common/language";

export function proxy(request: NextRequest) {
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
    // let lang = getLangFromUrl(request.url)
    // if (!lang) {
    //     if (pathname === '/') {
    //         lang = langEn;  // Default to English if no language is specified
    //     } else {
    //         return new NextResponse('Page Not Found', {status: 404});
    //     }
    // }
    // if (lang !== langEn && lang !== langZh) {
    //     return new NextResponse('Page Not Found', {status: 404});
    // }
    // requestHeaders.set('x-lang', lang)

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })
    // 返回该请求头以指示浏览器在后续请求头中附带sec-ch-prefers-color-scheme头以便获取用户的主题偏好
    response.headers.set('Accept-CH', 'Sec-CH-Prefers-Color-Scheme')
    // 设置COEP和COOP以启用跨源隔离，这两个头在使用SQLite时需要
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')

    return response;
}

// 配置哪些路径需要经过这个中间件，仅匹配路径不包括查询字符串
export const config = {
    matcher: [
        // '/((?!_next|images|fonts|icons|pwa|ads.txt|favicon.ico|polaris).*)'
        '/',
        // '/(\\w{2})',
        // '/(\\w{2}/.*)',
        '/(.*)'
    ],
}
