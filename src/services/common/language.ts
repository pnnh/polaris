// import langEnUSData from '@/services/common/locales/en_US/messages.json' with {type: 'json'}
// import langEsESData from '@/services/common/locales/es_ES/messages.json' with {type: 'json'}
// import langFrFRData from '@/services/common/locales/fr_FR/messages.json' with {type: 'json'}
// import langJaJPData from '@/services/common/locales/ja_JP/messages.json' with {type: 'json'}
// import langZhCNData from '@/services/common/locales/zh_CN/messages.json' with {type: 'json'}

export const langEnUS = 'en'
export const langEsES = 'es' // Spanish
export const langFrFR = 'fr' // French
// export const langDeDE = 'de-DE' // German
export const langJaJP = 'ja' // Japanese
// export const langRuRU = 'ru-RU' // Russian
// export const langHiIN = 'hi-IN' // Hindi
// export const langPtPT = 'pt-PT' // Portuguese
export const langZhCN = 'zh'
// export const langZhTW = 'zh-TW' // Traditional Chinese
export type LangKeyType = typeof langEnUS | typeof langEsES | typeof langFrFR | typeof langJaJP | typeof langZhCN

export type LangTextValue = {
    [key in LangKeyType]: string
}

export const defaultLanguage = langEnUS
export const unknownLanguage = 'unknown'

export const supportedLanguages = [
    {
        key: langEnUS, name: 'English'
    },
    {
        key: langEsES, name: 'Español'
    },
    {
        key: langFrFR, name: 'Français'
    },
    // {
    //     key: langDeDE, name: 'Deutsch'
    // },
    // {
    //     key: langPtPT, name: 'Português'
    // },
    // {
    //     key: langRuRU, name: 'Русский'
    // },
    // {
    //     key: langHiIN, name: 'हिन्दी'
    // },
    {
        key: langJaJP, name: '日本語'
    },
    {
        key: langZhCN, name: '简体中文'
    },
    // {
    //     key: langZhTW, name: '繁體中文'
    // },
]

// export const languageDataMap: { [key: string]: typeof langEnUSData } = {
//     [langEnUS]: langEnUSData,
//     [langEsES]: langEsESData,
//     [langFrFR]: langFrFRData,
//     // [langDeDE]: langDeDEData,
//     [langJaJP]: langJaJPData,
//     // [langRuRU]: langRuRUData,
//     // [langHiIN]: langHiINData,
//     [langZhCN]: langZhCNData,
//     // [langZhans]: langZhCNData,
//     // [langZhant]: langZhTWData,
//     // [langZhCN]: langZhCNData,
//     // [langZhTW]: langZhTWData,
//     // [langPtPT]: langPtPTData,
// }

export function getLangInfo(lang: string): { key: string, name: string } | undefined {
    const targetLang = getTargetLang(lang, defaultLanguage)
    return supportedLanguages.find(item => item.key === targetLang)
}

// export function getLanguageData(lang: string): typeof langEnUSData {
//     const targetLang = getTargetLang(lang, defaultLanguage)
//     const langData = languageDataMap[targetLang]
//     if (langData) {
//         return langData
//     }
//     return languageDataMap[defaultLanguage]
// }

export function getTargetLang(wantLang: string, fallbackLang: string): string {
    wantLang = wantLang.trim()
    if (supportedLanguages.findIndex(item => item.key === wantLang) !== -1) {
        return wantLang
    }
    // if (wantLang === 'zh-CN' || wantLang === 'zh-SG' || wantLang === 'zh-Hans') {
    //     return langZhCN
    // }
    // if (wantLang === 'zh-TW' || wantLang === 'zh-HK' || wantLang === 'zh-MO' || wantLang === 'zh-Hant') {
    //     return langZhCN
    // }
    // for (const item of supportedLanguages) {
    //     if (wantLang.startsWith(`${item.key}-`)) {
    //         return item.key
    //     }
    // }
    return fallbackLang
}

export function getLangFromUrl(url: string): string | undefined {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split('/')
    let hasLang = false
    for (const item of supportedLanguages) {
        if (segments[1] === item.key) {
            hasLang = true
        }
    }
    if (hasLang) {
        return segments[1]
    }
    return undefined
}

export function replaceLangInUrl(url: string, lang: string): string {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split('/')
    if (segments.length >= 1) {
        let hasLang = false
        for (const item of supportedLanguages) {
            if (segments[1] === item.key) {
                hasLang = true
            }
        }
        if (hasLang) {
            urlObj.pathname = `/${lang}` + urlObj.pathname.substring(segments[1].length + 1)
        } else {
            urlObj.pathname = `/${lang}` + urlObj.pathname
        }
    } else {
        urlObj.pathname = `/${lang}`
    }
    return urlObj.toString()
}
