export const fallbackLng = 'en'
export const languages = [fallbackLng, 'zh']
export const defaultNS = 'translation'
import localeZh from '@/services/common/i18n/locales/zh/translation.json' with {type: 'json'}
import localeEn from '@/services/common/i18n/locales/en/translation.json' with {type: 'json'}

export function getOptions(lng = fallbackLng, ns = defaultNS) {
    return {
        supportedLngs: languages,
        fallbackLng,
        lng,
        fallbackNS: defaultNS,
        defaultNS,
        ns,
    }
}

export function localeResource(language: string, namespace: string) {
    if (language === 'zh') {
        return localeZh
    }
    return localeEn
}
