import {createInstance} from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import {initReactI18next} from 'react-i18next/initReactI18next'
import {fallbackLng, getOptions, LangCookieName, languages, localeResource,} from '@/services/common/i18n/settings'
import acceptLanguage from "accept-language";
import {cookies, headers} from "next/headers";

// 配置语言
acceptLanguage.languages(languages)

const initI18next = async (lng: string, ns?: string) => {
    const i18nInstance = createInstance()
    await i18nInstance
        .use(initReactI18next)
        .use(resourcesToBackend(localeResource))
        .init(getOptions(lng, ns))
    return i18nInstance
}

export async function useServerTranslation(lng: string, ns?: string, options?: { keyPrefix: string }) {
    const i18nextInstance = await initI18next(lng, ns)
    return {
        t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options?.keyPrefix),
        i18n: i18nextInstance
    }
}

export function getAcceptLanguage(exceptLang: string) {
    return acceptLanguage.get(exceptLang)
}

export function getActualLang(targetLang: string) {
    let lang
    const findLang = languages.find((l: string) => targetLang === l)
    if (findLang) {
        lang = getAcceptLanguage(findLang)
    }
    if (!lang) lang = fallbackLng
    return lang
}

// 从请求头或者cookie中获取语言信息
export async function getLangAnyway() {
    const headersList = await headers()

    let lang = getAcceptLanguage(headersList.get('Accept-Language') || '')
    if (!lang) {
        const cookieStore = await cookies()
        lang = cookieStore.get(LangCookieName)?.value || ''
    }
    if (!lang) lang = fallbackLng
    return lang
}

export function isEn(lang: string) {
    return lang === 'en'
}

export function isZh(lang: string) {
    return lang === 'zh'
}
