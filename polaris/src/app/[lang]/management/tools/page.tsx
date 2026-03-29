import React from 'react'
import {css} from "@/gen/styled/css";
import {getPathname} from "@/components/server/pathname";
import {calcPagination, langEn, replaceSearchParams, SymbolUnknown, uuidToBase58} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import {ManagementToolService} from "@/components/management/tools";
import {PSToolModel} from "@/components/common/models/tool";
import {PaginationServer} from "@/components/widget/pagination";
import PSDeleteButton from "@/components/client/console/delete";

import {NoData} from "@/components/widget/empty";
import {ManagementToolFilterBar} from "./filter";
import ConsoleLayout from "@/components/server/console/layout";

const pageStyles = {
    toolsContainer: css`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    `,
    list: css`
        flex: 1;
        overflow-y: auto;
    `,
    table: css`
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
    `,
    th: css`
        text-align: left;
        padding: 0.5rem 1rem;
        border-bottom: 2px solid var(--border-color);
        background: var(--background-color);
        font-weight: 600;
    `,
    td: css`
        padding: 0.5rem 1rem;
        border-bottom: 1px solid var(--border-color);
        vertical-align: middle;
    `,
    statusChip: css`
        display: inline-block;
        padding: 0.125rem 0.5rem;
        border-radius: 1rem;
        font-size: 0.75rem;
    `,
    paginationBar: css`
        width: 100%;
        background: var(--background-color);
        flex-shrink: 0;
    `
}

export const dynamic = "force-dynamic";

export default async function ManagementToolsPage({params, searchParams}: {
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

    const serverConfig = await useServerConfig()
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL

    const selectData = await ManagementToolService.queryTools(
        internalStargateUrl,
        {keyword, page, size: pageSize}
    )

    const pagination = calcPagination(page, selectData.count, pageSize)

    return <ConsoleLayout lang={lang} pathname={pathname} searchParams={searchValue}
                          userInfo={SymbolUnknown}>
        <div className={pageStyles.toolsContainer}>
            <ManagementToolFilterBar lang={lang} keyword={keyword || ''}/>
            <div className={pageStyles.list}>
                {selectData.range.length === 0
                    ? <NoData size={'middle'}/>
                    : <table className={pageStyles.table}>
                        <thead>
                        <tr>
                            <th className={pageStyles.th}>标题</th>
                            <th className={pageStyles.th}>名称</th>
                            <th className={pageStyles.th}>URL</th>
                            <th className={pageStyles.th}>版本</th>
                            <th className={pageStyles.th}>状态</th>
                            <th className={pageStyles.th}>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectData.range.map((model) => (
                            <ToolRow key={model.uid} model={model} stargateUrl={publicStargateUrl} lang={lang}/>
                        ))}
                        </tbody>
                    </table>
                }
            </div>
            <div className={pageStyles.paginationBar}>
                <PaginationServer
                    lang={lang}
                    pagination={pagination}
                    pageLinkFunc={(p) =>
                        `/${lang}/management/tools` + replaceSearchParams(searchValue, 'page', p.toString())}
                />
            </div>
        </div>
    </ConsoleLayout>
}

function ToolRow(props: { model: PSToolModel, stargateUrl: string, lang: string }) {
    const {model, stargateUrl, lang} = props
    const editUrl = `/${lang}/management/tools/${uuidToBase58(model.uid)}`
    const deleteUrl = `${stargateUrl}/management/tools/${model.uid}`
    return <tr>
        <td className={pageStyles.td}>
            <a href={editUrl}>{model.title}</a>
        </td>
        <td className={pageStyles.td}>{model.name || '-'}</td>
        <td className={pageStyles.td}>{model.url || '-'}</td>
        <td className={pageStyles.td}>{model.version || '-'}</td>
        <td className={pageStyles.td}>
            <span className={pageStyles.statusChip}
                  style={{
                      background: model.status === 1 ? '#e8f5e9' : '#fff3e0',
                      color: model.status === 1 ? '#2e7d32' : '#e65100'
                  }}>
                {model.status === 1 ? '已启用' : '已禁用'}
            </span>
        </td>
        <td className={pageStyles.td}>
            <PSDeleteButton lang={lang} deleteUrl={deleteUrl} resTitle={model.title}>
                删除
            </PSDeleteButton>
        </td>
    </tr>
}
