'use server'

import {cookies, headers} from "next/headers";
import {serverGetCookie} from "@/services/server/cookie";
import {ThemeKey} from "@/services/common/theme";

export async function getServerTheme(): Promise<string> {
    let themeName = 'light'
    const themeValue = await serverGetCookie(ThemeKey)

    // 当cookie里有值且为light或dark时，优先使用cookie值，否则则视为自动模式，从浏览器请求头里获取
    if (themeValue === 'light' || themeValue === 'dark') {
        themeName = themeValue
    } else {
        const headersList = await headers()
        const secChPrefersColorScheme = headersList.get('sec-ch-prefers-color-scheme')
        if (secChPrefersColorScheme === 'light' || secChPrefersColorScheme === 'dark') {
            themeName = secChPrefersColorScheme
        }
    }
    return themeName
}
