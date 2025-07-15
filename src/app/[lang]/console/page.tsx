import React from 'react'
import {PageMetadata, pageTitle} from "@/utils/page";
import {getPathname} from "@/services/server/pathname";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {langEn} from "@/atom/common/language";
import styles from './page.module.scss'
import ConsoleLayout from "@/components/server/content/console/layout";


export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.consolePage}>
            <a href={`/${lang}/console/articles`}>文章</a>
            <a href={`/${lang}/console/channels`}>频道</a>
        </div>
    </ConsoleLayout>
}


