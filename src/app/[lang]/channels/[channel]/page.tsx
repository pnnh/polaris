import React from 'react'
import {css} from "@/gen/styled/css";

import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {calcPagination, langEn, replaceSearchParams, SymbolUnknown, tryBase58ToUuid} from "@pnnh/atom";
import {PaginationServer} from "@/components/server/pagination";
import {notFound} from "next/navigation";
import {PSHomeBody} from "@/components/server/body";
import {FileSelectOptions, selectFilesFromBackend} from "@/components/community/files";

const pageStyles = {
    contentContainer: css`
        flex-grow: 1;
        flex-direction: row;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin: 1rem;
    `,
    conRight: css`
        display: block;
        width: 16rem;
        flex-shrink: 0;

        @media (max-width: 48rem) {
            display: none;
        }
    `,
    conMiddle: css`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 1;
        background-color: #FFF;
        border-radius: 4px;
    `,
    middlePagination: css`
        width: 100%;
    `
}


export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const searchParamsValue = await searchParams
    const lang = paramsValue.lang || langEn

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10

    const channelParam = paramsValue.channel
    const channelUid = tryBase58ToUuid(channelParam)
    if (!channelUid) {
        notFound();
    }
    const options: FileSelectOptions = {
        page, size: pageSize, channel: channelUid,
    }
    let parent = searchParamsValue.parent
    if (parent) {
        const parentUid = tryBase58ToUuid(parent)
        if (parentUid) {
            options.parent = parentUid
        }
    }
    const selectResult = await selectFilesFromBackend(options)

    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
    >
        <div className={pageStyles.contentContainer}>
            <div className={pageStyles.conMiddle}>
                <PSHomeBody lang={lang} searchParams={searchParamsValue} selectResult={selectResult}/>

                <div className={pageStyles.middlePagination}>
                    <PaginationServer lang={lang} pagination={pagination}
                                      pageLinkFunc={(page) => `/${lang}/channels/${channelParam}` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
        </div>
    </ContentLayout>
}
