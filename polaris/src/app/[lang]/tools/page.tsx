import React from 'react'
import {getPathname} from "@/components/server/pathname";
import {CodeOk, langEn, PLSelectResult, SymbolUnknown} from "@pnnh/atom";
import ContentLayout from "@/components/server/content/layout";
import {css} from "@/gen/styled/css";
import {PSToolModel} from "@/components/common/models/tool";
import {useServerConfig} from "@/components/server/config";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import queryString from "query-string";
import {NoDataPage} from "@/components/misc/NoData";
import {SafeLink} from "@/components/client/link";

const toolStyles = {
    container: css`
        flex-grow: 1;
        flex-direction: row;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin: 1rem;
    `,
    list: css`
        padding: 0;
        gap: 1rem;
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));

        @media (max-width: 48rem) {
            grid-template-columns: 1fr;
        }
    `,
    item: css`
        border-bottom: 1px solid #e5e6eb;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding-left: 1rem;
        padding-right: 1rem;
        gap: 16px;
        height: 10rem;
        transition: opacity 0.3s ease-out 0s, transform 0.3s ease-out 0s;
        opacity: 1;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0, 0, 0, 0.1);
        color: #4a4a4a;
        position: relative;

        &:last-child {
            border-bottom-width: 0;
        }
    `,
    content: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: flex-start;
        align-items: flex-start;
        overflow: hidden;
    `,
    title: css`
        flex-shrink: 0;
    `,
    link: css`
        color: #000;
        text-decoration: none;
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.6;
    `,
    description: css`
        color: #5e5e5e;
        font-size: 14px;
        line-height: 22px;
        overflow: hidden;
        white-space: break-spaces;
        text-overflow: ellipsis;
    `,
    version: css`
        font-size: 12px;
        color: #999;
    `,
}

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const paramsValue = await params
    const searchParamsValue = await searchParams
    const lang = paramsValue.lang || langEn
    const pathname = await getPathname()

    const selectQuery = {
        page: 1,
        size: 64,
        lang: lang,
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${serverUrl}/tools?${rawQuery}`
    const result = await serverMakeGet<PLSelectResult<PSToolModel>>(url, '')

    if (!result || !result.data) {
        return <NoDataPage lang={lang} searchParams={searchParamsValue} pathname={pathname} size={'middle'}/>
    }
    if (result.code !== CodeOk) {
        return <NoDataPage lang={lang} searchParams={searchParamsValue} pathname={pathname}
                           size={'middle'} message={result.message}/>
    }

    return (
        <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}>
            <div className={toolStyles.container}>
                <div className={toolStyles.list}>
                    {result.data.range.map((model) => (
                        <Item key={model.uid} model={model} lang={lang}/>
                    ))}
                </div>
            </div>
        </ContentLayout>
    )
}

function Item({model, lang}: { model: PSToolModel, lang: string }) {
    const href = model.url || `/${lang}/tools/${model.uid}`

    return (
        <div className={toolStyles.item}>
            <div className={toolStyles.content}>
                <div className={toolStyles.title}>
                    <SafeLink className={toolStyles.link} href={href}>{model.title || model.name}</SafeLink>

                </div>
                {model.description && (
                    <div className={toolStyles.description}>{model.description}</div>
                )}
                {model.version && (
                    <div className={toolStyles.version}>v{model.version}</div>
                )}
            </div>
        </div>
    )
}
