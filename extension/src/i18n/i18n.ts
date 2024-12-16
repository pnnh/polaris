import i18n, {FlatNamespace, KeyPrefix} from "i18next";
import {
    FallbackNs, initReactI18next, UseTranslationOptions,
    useTranslation as useTranslationOrg,
    UseTranslationResponse
} from "react-i18next";
import resources from './translations.json' with {type: "json"}
import {useEffect, useState} from "react";
import acceptLanguage from 'accept-language'
import {getNavigatorLang} from "@/utils/lang.ts";

export const fallbackLng = 'en'
export const languages = [fallbackLng, 'zh']

acceptLanguage.languages(languages)


export function getAppLang() {
    const navLang = getNavigatorLang()
    return acceptLanguage.get(navLang) || fallbackLng
}


i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export function useTranslation<
    Ns extends FlatNamespace,
    KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined
>(
    lng: string,
    ns?: Ns,
    options?: UseTranslationOptions<KPrefix>,
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> {
    const ret = useTranslationOrg(ns, options)
    const {i18n} = ret
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
    useEffect(() => {
        if (activeLng === i18n.resolvedLanguage) return
        setActiveLng(i18n.resolvedLanguage)
    }, [activeLng, i18n.resolvedLanguage])
    useEffect(() => {
        if (!lng || i18n.resolvedLanguage === lng) return
        i18n.changeLanguage(lng).then(() => {
        })
    }, [lng, i18n])
    return ret
}

export default i18n;
