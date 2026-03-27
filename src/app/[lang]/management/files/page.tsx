import React from 'react'
import {css} from "@/gen/styled/css";
import {calcPagination, langEn, replaceSearchParams, SymbolUnknown} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import {getPathname} from "@/components/server/pathname";
import {ManagementFileService} from "@/components/management/files";
import {ManagementFilesView} from "./view";
import {PaginationServer} from "@/components/server/pagination";

import ConsoleLayout from "@/components/server/console/layout";

const pageStyles = {
    filesPage: css`
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

export default async function ManagementFilesPage({params, searchParams}: {
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
    const statusFilter = searchValue.status

    const serverConfig = await useServerConfig()
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL

    const selectData = await ManagementFileService.queryFiles(
        internalStargateUrl,
        {keyword, status: statusFilter, page, size: pageSize}
    )

    const pagination = calcPagination(page, selectData.count, pageSize)
    const dataJson = JSON.stringify(selectData.range)

    return <ConsoleLayout lang={lang} pathname={pathname} searchParams={searchValue}
                          userInfo={SymbolUnknown}>
        <div className={pageStyles.filesPage}>
            <div className={pageStyles.pageContainer}>
                <ManagementFilesView
                    lang={lang}
                    stargateUrl={publicStargateUrl}
                    dataJson={dataJson}
                    keyword={keyword || ''}
                    statusFilter={statusFilter || ''}
                />
                <div className={pageStyles.paginationBar}>
                    <PaginationServer
                        lang={lang}
                        pagination={pagination}
                        pageLinkFunc={(p) =>
                            `/${lang}/management/files` + replaceSearchParams(searchValue, 'page', p.toString())}
                    />
                </div>
            </div>
        </div>
    </ConsoleLayout>
}
