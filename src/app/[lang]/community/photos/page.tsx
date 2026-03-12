import React from 'react'

import {getPathname} from "@/components/server/pathname";
import {calcPagination, langEn, replaceSearchParams, SymbolUnknown} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import {css} from "@/gen/styled/css";
import CommunityLayout from "@/components/server/community/layout";
import {CommunityImageNodeService} from "@/components/community/images";
import {ConsolePhotoFilterBar} from "./filter";
import {ConsolePhotoMiddleBody} from "./photo";
import {PaginationServer} from "@/components/server/pagination";

export const dynamic = "force-dynamic";

const pageStyles = {
    photosPage: css`
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
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
    const searchText = searchParamsValue.keyword

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        keyword: searchText
    }
    const serverConfig = await useServerConfig()
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL

    const selectData = await CommunityImageNodeService.consoleQueryImages(internalStargateUrl, lang, selectQuery)

    const pagination = calcPagination(page, selectData.count, pageSize)
    return <CommunityLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
    >
        <div className={pageStyles.photosPage}>
            <div className={pageStyles.contentContainer}>
                <ConsolePhotoFilterBar lang={lang} keyword={searchParamsValue.keyword}/>
                <div className={pageStyles.conMiddle}>
                    <ConsolePhotoMiddleBody selectData={selectData} lang={lang} stargateUrl={publicStargateUrl}/>
                    <div className={pageStyles.middlePagination}>
                        <PaginationServer lang={lang} pagination={pagination}
                                          pageLinkFunc={(page) =>
                                              `/${lang}/community/photos` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                    </div>
                </div>
            </div>
        </div>
    </CommunityLayout>
}

