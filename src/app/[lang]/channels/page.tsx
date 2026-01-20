import React from 'react'
import ContentLayout from "@/components/server/content/layout";
import {getPathname} from "@/components/server/pathname";
import {css} from "@/gen/styled/css";
import {CodeOk, PLSelectResult, SymbolUnknown} from "@pnnh/atom";
import {PSChannelModel} from "@/components/common/models/channel";
import {uuidToBase58} from "@pnnh/atom";
import {isValidUUID} from "@pnnh/atom";
import {PSImageServer} from "@/components/server/image";
import {STSubString} from "@pnnh/atom";
import {getDefaultChanImageByUid} from "@/components/common/channel";
import {PageMetadata} from "@/components/common/utils/page";
import {langEn} from "@pnnh/atom";
import queryString from "query-string";
import {useServerConfig} from "@/components/server/config";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {NoDataPage} from "@/components/misc/NoData";

const pageStyles = {
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
        height: 12rem;
        transition: opacity 0.3s ease-out 0s, transform 0.3s ease-out 0s;
        opacity: 1;
        transform-origin: center top;
        overflow: visible;
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
        height: 10rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: flex-start;
        align-items: flex-start;
    `,
    title: css`
        flex-shrink: 0;
    `,
    link: css`
        color: #000;
        text-decoration: none;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.6;
    `,
    description: css`
        color: #5e5e5e;
        font-size: 14px;
        line-height: 22px;
        flex-grow: 1;
        overflow: hidden;
        white-space: break-spaces;
        text-overflow: ellipsis;
    `,
    itemCover: css`
        flex-shrink: 0;
        width: 200px;
        height: 160px;
        position: relative;
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 2px;
        }
    `
}

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, viewer: string }>,
    searchParams: Promise<Record<string, string> & { query: string | undefined }>
}) {
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const paramsValue = await params;
    const searchParamsValue = await searchParams
    const pageSize = 64
    const lang = paramsValue.lang || langEn

    const selectQuery = {
        page: 1,
        size: pageSize,
        lang: lang
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${serverUrl}/channels?${rawQuery}`
    const result = await serverMakeGet<PLSelectResult<PSChannelModel>>(url, '')

    const pathname = await getPathname()
    const metadata = new PageMetadata(lang)
    if (!result || !result.data) {
        return <NoDataPage lang={lang} searchParams={searchParamsValue} pathname={pathname}
                           metadata={metadata} size={'middle'}/>
    }
    if (result.code !== CodeOk) {
        return <NoDataPage lang={lang} searchParams={searchParamsValue} pathname={pathname}
                           metadata={metadata} size={'middle'} message={result.message}/>
    }

    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={pageStyles.container}>
            <div className={pageStyles.list}>
                {result.data.range.map((model) => {
                    return <Item key={model.uid} model={model} lang={lang}/>
                })}
            </div>
        </div>
    </ContentLayout>
}

function Item(props: { model: PSChannelModel, lang: string }) {
    const model = props.model
    const readUrl = `/${props.lang}/channels/${uuidToBase58(props.model.uid)}`
    let imageUrl = getDefaultChanImageByUid(model.uid)
    if (model.image && isValidUUID(model.image)) {
        imageUrl = `/channels/${model.uid}/assets/${model.image}`
    }

    return < div className={pageStyles.item}>
        <div className={pageStyles.itemCover}>
            <PSImageServer lang={props.lang} src={imageUrl} alt='star' width={256} height={256}/>
        </div>
        <div className={pageStyles.content}>
            <div className={pageStyles.title}>
                <a className={pageStyles.link} href={readUrl}>{props.model.name}</a>
            </div>
            <div className={pageStyles.description}>
                {STSubString(props.model.description, 140)}
            </div>
        </div>
    </div>
}
