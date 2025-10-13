'use client'

import {getCookie, setCookie} from "@/services/client/cookie";
import {defaultLanguage, getTargetLang} from "@/services/common/language";

export const LanguageKey = 'PSLanguage'

export function clientGetCurrentLanguage(): string {
    const initialLanguage = getTargetLang(navigator.language, defaultLanguage)
    return getCookie(LanguageKey) || initialLanguage;
}

export function clientSetCurrentLanguage(language: string): void {
    setCookie(LanguageKey, language, 365 * 24 * 60 * 60);
}
