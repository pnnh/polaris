'use client';

import {createTheme} from '@mui/material/styles';

import {ThemeKey} from "@/components/common/theme";
import {psSetCookie} from "@/components/client/cookie";

export type ThemeType = 'light' | 'dark' | 'auto'

export function clientSetCurrentTheme(theme: ThemeType) {
    psSetCookie(ThemeKey, theme, 365 * 24 * 60 * 60)
}

const lightTheme = createTheme({
    cssVariables: true,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // 全局禁用文字大写
                },
            },
        },
    },
    palette: {
        mode: 'light',
    },
});

const darkTheme = createTheme({
    cssVariables: true,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // 全局禁用文字大写
                },
            },
        },
    },
    palette: {
        mode: 'dark',
    },
})

export {lightTheme, darkTheme};

