'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/client/dropmenu";
import { Contrast } from 'lucide-react';
import { clientSetCurrentTheme, ThemeType } from "@/components/client/theme";
import { transKey } from "@/components/common/locales/normal";
import { css } from "@/gen/styled/css";


export function ThemeSwitch({ themeName, lang }: { themeName: string, lang: string }) {
    const switchTheme = (targetTheme: ThemeType) => {
        clientSetCurrentTheme(targetTheme)
        window.location.reload()
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={themeStyles.themeSelector}>
                    <Contrast className="themeIcon" aria-hidden={undefined} size={20} style={{ cursor: 'pointer' }} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchTheme('auto')}
                    data-selected={themeName === 'auto' || undefined}
                    className="data-[selected]:font-semibold">
                    {transKey(lang, "AutoTheme")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchTheme('light')}
                    data-selected={themeName === 'light' || undefined}
                    className="data-[selected]:font-semibold">
                    {transKey(lang, "LightTheme")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchTheme('dark')}
                    data-selected={themeName === 'dark' || undefined}
                    className="data-[selected]:font-semibold">
                    {transKey(lang, "DarkTheme")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const themeStyles = {
    themeSelector: css`
        cursor: pointer;
        display: flex;
        flex-direction: row;
        gap: 0.2rem;

        & .themeIcon {
            color: var(--text-primary-color);
            background: var(--background-color);
        }
    `
}
