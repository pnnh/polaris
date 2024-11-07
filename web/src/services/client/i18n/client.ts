'use client'

import {useEffect, useState} from 'react'
import i18next, {FlatNamespace, KeyPrefix} from 'i18next'
import {
    initReactI18next,
    useTranslation as useTranslationOrg,
    UseTranslationOptions,
    UseTranslationResponse,
    FallbackNs
} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import {getOptions, languages, localeResource,} from '@/services/common/i18n/settings'

const runsOnServerSide = typeof window === 'undefined'

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(resourcesToBackend(localeResource))
    .init({
        ...getOptions(),
        lng: undefined,
        detection: {
            order: ['path', 'htmlTag', 'cookie', 'navigator'],
        },
        preload: runsOnServerSide ? languages : []
    }).then(r => {
})

export function useClientTranslation<
    Ns extends FlatNamespace,
    KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined
>(
    lng: string,
    ns?: Ns,
    options?: UseTranslationOptions<KPrefix>,
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> {
    const ret = useTranslationOrg(ns, options)
    const {i18n} = ret
    if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
        i18n.changeLanguage(lng).then(r => {
        })
    } else {
        const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
        useEffect(() => {
            if (activeLng === i18n.resolvedLanguage) return
            setActiveLng(i18n.resolvedLanguage)
        }, [activeLng, i18n.resolvedLanguage])
        useEffect(() => {
            if (!lng || i18n.resolvedLanguage === lng) return
            i18n.changeLanguage(lng).then(r => {
            })
        }, [lng, i18n])
    }
    return ret
}
