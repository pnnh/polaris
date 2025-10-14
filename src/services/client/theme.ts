'use client'

import {setCookie} from "@/services/client/cookie";
import {ThemeKey} from "@/services/common/theme";

export type ThemeType = 'light' | 'dark' | 'auto'

export function clientSetCurrentTheme(theme: ThemeType) {
    setCookie(ThemeKey, theme, 365 * 24 * 60 * 60)
}
