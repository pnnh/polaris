'use client'

import {getCookie, setCookie} from "@/services/client/cookie";

export const ThemeKey = 'PSTheme'

export type ThemeType = 'light' | 'dark' | 'auto'

function getInitialTheme(): ThemeType {
    const storageThemeName = getCookie(ThemeKey) as string
    let targetTheme: ThemeType = 'auto'
    if (storageThemeName === 'light' || storageThemeName === 'dark') {
        targetTheme = storageThemeName
    } else {
        // 默认跟随系统
        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        targetTheme = isDark ? 'dark' : 'light'
    }
    return targetTheme
}

const initialTheme = getInitialTheme()

export function clientGetCurrentTheme(): ThemeType {
    const saveLang = getCookie(ThemeKey)
    if (!saveLang || (saveLang !== 'light' && saveLang !== 'dark')) {
        return initialTheme as ThemeType
    }
    return saveLang as ThemeType
}

export function clientSetCurrentTheme(theme: ThemeType) {
    setCookie(ThemeKey, theme, 365 * 24 * 60 * 60)
}
