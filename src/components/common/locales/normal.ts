import {langEsES, langFrFR, langJaJP, langZhCN} from "../language"
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

// 用以翻译占位，后续换成其它函数
export function transTodo(zhText: string): string {
    return zhText
}
