import React from 'react'
import styles from './page.module.scss'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getPathname} from "@/components/server/pathname";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {calcPagination} from "@/atom/common/utils/pagination";
import {langEn} from "@/atom/common/language";
import ConsoleLayout from "@/components/server/console/layout";
import {ConsoleArticleFilterBar} from "@/app/[lang]/console/articles/filter";
import {ConsoleArticleMiddleBody} from "@/app/[lang]/console/articles/article";
import {useServerConfig} from "@/components/server/config";
import {serverConsoleSelectArticles} from "@/components/server/articles/articles";
import {css, ServerComponentStyle} from "@/components/server/component";

export const dynamic = "force-dynamic";

const pageStyle = css`
    .contentContainer {
        display: flex;
        flex-direction: column;
        width: 100%;

        .conMiddle {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            scrollbar-width: thin;
            border-radius: 4px;
            overflow-y: auto;
            overflow-x: hidden;

            .middlePagination {
                width: 100%;
                background: var(--background-color);
            }
        }
    }
`

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
    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} styleItems={pageStyle}>
        <div className={styles.contentContainer}>
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
    </ConsoleLayout>
}


