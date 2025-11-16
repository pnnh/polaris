import {langEnUS, langEsES, langFrFR, langJaJP, LangTextValue, langZhCN} from "../language"
import {TransTexts} from "@/components/common/locales/texts";

export function transKey(lang: string, keyName: keyof typeof TransTexts): string {
    const langText = TransTexts[keyName]
    if (!langText) {
        throw new Error('Translation key not found: ' + keyName)
    }
    switch (lang) {
        case langZhCN:
            return langText.zh
        case langJaJP:
            return langText.ja
        case langEsES:
            return langText.es
        case langFrFR:
            return langText.fr
    }
    // Fallback to English
    return langText.en
}

export function transText(lang: string, zhText: string, enText: string): string {
    if (lang === langZhCN) {
        return zhText
    }
    return enText
}

export function transExtra(lang: string, zhText: string, enText: string,
                           keyName: keyof typeof TransTexts): string {
    if (lang === langZhCN) {
        return zhText
    } else if (lang === langEnUS) {
        return enText
    }
    if (!keyName) {
        return enText
    }
    const langText = TransTexts[keyName]
    if (!langText) {
        throw new Error('Translation key not found: ' + keyName)
    }
    switch (lang) {
        case langZhCN:
            return langText.zh
        case langJaJP:
            return langText.ja
        case langEsES:
            return langText.es
        case langFrFR:
            return langText.fr
    }
    // Fallback to English
    return langText.en
}
