import {css} from "@/gen/styled/css";

export const langEnUS = 'en'
export const langEsES = 'es' // Spanish
export const langFrFR = 'fr' // French
export const langDeDE = 'de-DE' // German
export const langJaJP = 'ja' // Japanese
export const langPtPT = 'pt-PT' // Portuguese
export const langZhCN = 'zh'
export const langZhTW = 'zh-TW' // Traditional Chinese
export type LangKeyType = typeof langEnUS | typeof langEsES | typeof langFrFR | typeof langJaJP |
    typeof langZhCN | typeof langDeDE | typeof langPtPT | typeof langZhTW

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
    {
        key: langDeDE, name: 'Deutsch'
    },
    {
        key: langPtPT, name: 'Português'
    },
    {
        key: langJaJP, name: '日本語'
    },
    {
        key: langZhCN, name: '简体中文'
    },
    {
        key: langZhTW, name: '繁體中文'
    },
]

const styles = {
    langSelector: css`
        display: inline-block;
        height: 1.5rem;
        width: 1.5rem;
        opacity: 0.8;
        & img {
            width: 100%;
            height: 100%;
        }
    `,
};

export function getLangInfo(lang: string): { key: string, name: string } | undefined {
    const targetLang = getTargetLang(lang, defaultLanguage)
    return supportedLanguages.find(item => item.key === targetLang)
}

export function getTargetLang(wantLang: string, fallbackLang: string): string {
    wantLang = wantLang.trim()
    if (supportedLanguages.findIndex(item => item.key === wantLang) !== -1) {
        return wantLang
    }
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

export function PSLanguageSelector({lang, currentUrl}: { lang: string, currentUrl: string }) {
    let currentLang = lang
    if (!currentLang || currentLang !== langZhCN) {
        currentLang = langEnUS;
    }
    const targetLang = currentLang === langEnUS ? langZhCN : langZhCN;
    let targetUrl = '';
    if (currentUrl === '/') {
        // 访问首页的情况
        targetUrl = `/${targetLang}`;
    } else if (currentUrl.startsWith('/?')) {
        // 访问首页带参数的情况
        targetUrl = currentUrl.replace(`/?`, `/${targetLang}?`);
    } else {
        // 访问其他页面的情况
        targetUrl = currentUrl.replace(`/${lang}`, `/${targetLang}`);
    }
    const linkTip = lang === langZhCN ? '访问英文页面' : 'Switch to Chinese page';
    return <div className={styles.langSelector}>
        <a href={targetUrl} title={linkTip}>
            <img src={lang === langEnUS ? '/icons/language/langEn.svg' : '/icons/language/langZh.svg'} alt={'lang'}/>
        </a>
    </div>
}
