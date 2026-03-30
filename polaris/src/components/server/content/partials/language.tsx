'use client';

import {css} from "@/gen/styled/css";
import * as React from 'react';
import {getLangInfo, replaceLangInUrl, supportedLanguages} from "@/components/common/language";
import {Languages} from 'lucide-react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/client/dropmenu";

export function PSLanguageSelector({lang, currentUrl}: { lang: string, currentUrl: string }) {
    const langInfo = getLangInfo(lang)
    if (!langInfo) {
        throw new Error('Invalid language: ' + lang)
    }
    const goUrl = (targetLang: string) => {
        const targetUrl = replaceLangInUrl(window.location.href, targetLang);
        window.location.href = targetUrl;
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={styles.langSelector}>
                    <Languages size={20} aria-hidden={undefined}/>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {supportedLanguages.map(language => (
                    <DropdownMenuItem
                        key={language.key}
                        onClick={() => goUrl(language.key)}
                        data-selected={lang === language.key || undefined}
                        className="data-[selected]:font-semibold"
                    >
                        {language.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const styles = {
    langSelector: css`
        display: inline-flex;
        height: 1.5rem;
        flex-direction: row;
        gap: 0.3rem;
        justify-items: center;
        cursor: pointer;

        & svg {
            height: 20px;
            width: 20px;
            color: var(--text-primary-color);
            fill: var(--text-primary-color);
            stroke: var(--text-primary-color);
        }
    `,
    langItem: css`
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        height: 1.5rem;
        gap: 0.3rem;
        cursor: pointer;
        font-size: 0.9rem;
        color: var(--text-primary-color);
        background-color: var(--background-color);

        & svg {
            height: 24px;
            width: 24px;
            color: var(--text-primary-color);
            fill: var(--text-primary-color);
            stroke: var(--text-primary-color);
        }
    `,
};
