import React from 'react'

import {getPathname} from "@/components/server/pathname";
import {calcPagination, langEn, replaceSearchParams, SymbolUnknown, tryBase58ToUuid} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import {css} from "@/gen/styled/css";
import ConsoleLayout from "@/components/server/console/layout";
import {CommunityFileNodeService} from "@/components/community/files";
import {ConsoleFileFilterBar} from "./filter";
import {ConsoleFileMiddleBody} from "./file-list";
import {PaginationServer} from "@/components/server/pagination";

export const dynamic = "force-dynamic";

const pageStyles = {
    filesPage: css`
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        width: 100%;
    `,
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
    params: Promise<{ lang: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const parentStr = searchParamsValue.parent || ''
    const parentUid = parentStr ? tryBase58ToUuid(parentStr) : undefined

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        keyword: searchParamsValue.keyword,
        parent: parentUid || undefined
    }
    const serverConfig = await useServerConfig()
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL

    const selectData = await CommunityFileNodeService.consoleQueryFiles(internalStargateUrl, lang, selectQuery)

    const pagination = calcPagination(page, selectData.count, pageSize)
    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
    >
        <div className={pageStyles.filesPage}>
            <div className={pageStyles.contentContainer}>
                <ConsoleFileFilterBar lang={lang} keyword={searchParamsValue.keyword}/>
                <div className={pageStyles.conMiddle}>
                    <ConsoleFileMiddleBody selectData={selectData} lang={lang} stargateUrl={publicStargateUrl}/>
                    <div className={pageStyles.middlePagination}>
                        <PaginationServer lang={lang} pagination={pagination}
                                          pageLinkFunc={(page) =>
                                              `/${lang}/community/files` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                    </div>
                </div>
            </div>
        </div>
    </ConsoleLayout>
}
