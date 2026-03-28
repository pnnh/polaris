'use client';

import {ThemeKey} from "@/components/common/theme";
import {psSetCookie} from "@/components/client/cookie";

export type ThemeType = 'light' | 'dark' | 'auto'

export function clientSetCurrentTheme(theme: ThemeType) {
    psSetCookie(ThemeKey, theme, 365 * 24 * 60 * 60)
}

