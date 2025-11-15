import React from 'react'
import styles from './page.module.scss'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getPathname} from "@/components/server/pathname";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {calcPagination} from "@/atom/common/utils/pagination";
import {langEn} from "@/atom/common/language";
import {ConsoleArticleFilterBar} from "./filter";
import {ConsoleArticleMiddleBody} from "./article";
import {useServerConfig} from "@/components/server/config";
import {serverConsoleSelectArticles} from "@/components/server/articles/articles";
import GlobalLayout from "@/components/server/global";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = searchParamsValue.channel

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk
    }
    const serverConfig = await useServerConfig()

    const selectData = await serverConsoleSelectArticles(serverConfig.PUBLIC_PORTAL_URL,
        lang, selectQuery)

    const pagination = calcPagination(page, selectData.count, pageSize)
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.articlesPage}>
            <div className={styles.pageContainer}>
                <ConsoleArticleFilterBar lang={lang} keyword={searchParamsValue.keyword}/>
                <div className={styles.conMiddle}>
                    <ConsoleArticleMiddleBody selectData={selectData} lang={lang}
                                              portalUrl={serverConfig.PUBLIC_PORTAL_URL}/>
                    <div className={styles.middlePagination}>
                        <PaginationServer lang={lang} pagination={pagination}
                                          pageLinkFunc={(page) =>
                                              `/${lang}/console/articles` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                    </div>
                </div>
            </div>
        </div>
    </GlobalLayout>
}


