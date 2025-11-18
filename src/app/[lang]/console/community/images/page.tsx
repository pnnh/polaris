import React from 'react'
import styles from './page.module.scss'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getPathname} from "@/components/server/pathname";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {calcPagination} from "@/atom/common/utils/pagination";
import {langEn} from "@/atom/common/language";
import {useServerConfig} from "@/components/server/config";
import {css} from "@/components/server/component";
import ConsoleImageLayout from "@/components/server/console/images/layout";
import {ConsoleImageFilterBar} from "./filter";
import {ConsoleImageMiddleBody} from "./image";

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

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')

    const serverConfig = await useServerConfig()

    const libName = searchParamsValue.libName
    const pagination = calcPagination(page, 100, pageSize)
    return <ConsoleImageLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                               metadata={metadata} styleItems={pageStyle}>
        <div className={styles.contentContainer}>
            <ConsoleImageFilterBar lang={lang} keyword={searchParamsValue.keyword}/>
            <div className={styles.conMiddle}>
                <ConsoleImageMiddleBody libKey={libName} lang={lang}
                                        portalUrl={serverConfig.PUBLIC_PORTAL_URL}/>
                <div className={styles.middlePagination}>
                    <PaginationServer lang={lang} pagination={pagination}
                                      pageLinkFunc={(page) =>
                                          `/${lang}/console/articles` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
        </div>
    </ConsoleImageLayout>
}
