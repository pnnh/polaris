import React from 'react'
import {css} from "@/gen/styled/css";
import {calcPagination, langEn, replaceSearchParams, SymbolUnknown} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import {getPathname} from "@/components/server/pathname";
import {ManagementArticleService} from "@/components/management/articles";
import {ManagementArticlesView} from "./view";
import {PaginationServer} from "@/components/server/pagination";
import ManagementLayout from "@/components/server/management/layout";

const pageStyles = {
    articlesPage: css`
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        width: 100%;
    `,
    pageContainer: css`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    `,
    paginationBar: css`
        width: 100%;
        background: var(--background-color);
        flex-shrink: 0;
    `
}

export const dynamic = "force-dynamic";

export default async function ManagementArticlesPage({params, searchParams}: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const searchValue = await searchParams;
    const lang = paramsValue.lang || langEn

    let page = Number(searchValue.page)
    if (isNaN(page)) page = 1
    const pageSize = 10
    const keyword = searchValue.keyword
    const statusFilter = searchValue.status  // "pending" | "approved" | undefined

    const serverConfig = await useServerConfig()
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL

    const selectData = await ManagementArticleService.queryArticles(
        internalStargateUrl,
        lang,
        {keyword, status: statusFilter, page, size: pageSize, sort: searchValue.sort}
    )

    const pagination = calcPagination(page, selectData.count, pageSize)

    const articlesJson = JSON.stringify(selectData.range)

    return <ManagementLayout lang={lang} pathname={pathname} searchParams={searchValue}
                             userInfo={SymbolUnknown}>
        <div className={pageStyles.articlesPage}>
            <div className={pageStyles.pageContainer}>
                {/* Toolbar + Table (single unified client component) */}
                <ManagementArticlesView
                    lang={lang}
                    stargateUrl={publicStargateUrl}
                    articlesJson={articlesJson}
                    keyword={keyword || ''}
                    statusFilter={statusFilter || ''}
                />
                {/* Server-side pagination */}
                <div className={pageStyles.paginationBar}>
                    <PaginationServer
                        lang={lang}
                        pagination={pagination}
                        pageLinkFunc={(p) =>
                            `/${lang}/management/articles` + replaceSearchParams(searchValue, 'page', p.toString())}
                    />
                </div>
            </div>
        </div>
    </ManagementLayout>
}
