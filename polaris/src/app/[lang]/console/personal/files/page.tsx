import React from 'react'

import {getPathname} from "@/components/server/pathname";
import {calcPagination, langEn, replaceSearchParams, SymbolUnknown} from "@pnnh/atom";
import {PaginationServer} from "@/components/widget/pagination";
import {ConsoleFileFilterBar} from "./filter";
import {ConsoleFileMiddleBody} from "./file";
import {css} from "@/gen/styled/css";
import ConsoleLayout from "@/components/server/console/layout";
import {CommunityFileNodeService} from "@/components/community/files";
import {useServerConfig} from "@/components/server/config";

export const dynamic = "force-dynamic";

const pageStyles = {
    contentContainer: css`
        display: flex;
        flex-direction: column;
        width: 100%;
    `,
    conMiddle: css`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        scrollbar-width: thin;
        border-radius: 4px;
        overflow-y: auto;
        overflow-x: hidden;
    `,
    middlePagination: css`
        width: 100%;
        background: var(--background-color);
    `
}

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
    const pageSize = 16


    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
    }
    const serverConfig = await useServerConfig()

    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL
    const selectData = await CommunityFileNodeService.consoleQueryFiles(internalStargateUrl, lang, selectQuery)

    const libName = searchParamsValue.libName
    const pagination = calcPagination(page, 100, pageSize)
    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
    >
        <div className={pageStyles.contentContainer}>
            <ConsoleFileFilterBar lang={lang} keyword={searchParamsValue.keyword}/>
            <div className={pageStyles.conMiddle}>
                <ConsoleFileMiddleBody libKey={libName} lang={lang} selectData={selectData}/>
                <div className={pageStyles.middlePagination}>
                    <PaginationServer lang={lang} pagination={pagination}
                                      pageLinkFunc={(page) =>
                                          `/${lang}/console/personal/files` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
        </div>
    </ConsoleLayout>
}


