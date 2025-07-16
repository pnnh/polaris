import React from 'react'
import {PageMetadata, pageTitle} from "@/utils/page";
import {getPathname} from "@/services/server/pathname";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {langEn} from "@/atom/common/language";
import styles from './page.module.scss'
import ConsoleLayout from "@/components/server/console/layout";
import {ConsoleSidebar} from "@/components/server/console/sidebar";


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
            点击左侧菜单
        </div>
    </ConsoleLayout>
}


