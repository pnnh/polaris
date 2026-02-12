import React from 'react'
import {getPathname} from "@/components/server/pathname";

import {calcPagination, langEn, replaceSearchParams, SymbolUnknown} from "@pnnh/atom";
import {PageMetadata} from "@/components/common/utils/page";
import ContentLayout from "@/components/server/content/layout";
import {css} from "@/gen/styled/css";
import {selectAppsFromStorage} from "@/components/server/tools/tools";
import {renderResourceCard} from "@/app/[lang]/tools/tool";
import {PaginationServer} from "@/components/server/pagination";

const toolStyles = {
    toolBodyComponent: css`
        width: 1024px;
        margin: 0 auto;
        padding-top: 2rem;
        padding-bottom: 2rem;
    `,
    appGrid: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 3rem;
        width: 100%;
        margin-bottom: 1rem;
    `,
    appCard: css`
        border: 1px solid #e0e0e0;
        background-color: #ffffff;
        border-radius: 4px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        aspect-ratio: 1/0.8;
        position: relative;
    `,
    appImage: css`
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0.2;
        z-index: 0;
        object-fit: cover;
    `,
    appTitle: css`
        font-size: 20px;
        font-weight: 600;
        position: relative;
        z-index: 2;
        padding: 16px;
    `,
    appDescription: css`
        margin: 0;
        padding: 16px;
        font-size: 16px;
        color: #555;
        position: relative;
        z-index: 2;
    `
}


export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const metadata = new PageMetadata(lang)

    const appList = await selectAppsFromStorage(page, pageSize)
    const pagination = calcPagination(page, appList.data.count, pageSize)
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        const appList = await selectAppsFromStorage()
        return <div className={toolStyles.toolBodyComponent}>
        <div className={toolStyles.appGrid}>
            {
                appList.data.range.map(async (app) => {
                    return renderResourceCard({model: app, lang})
                })
            }
        </div>
        <div>
            <PaginationServer lang={lang} pagination={pagination}
                              pageLinkFunc={(page) =>
                                  `/${lang}/articles` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
        </div>
    </div>
    </ContentLayout>
}
