import React from 'react'
import {ContentLayout} from "@/components/server/content/layout";
import {css} from '@emotion/css';
import {CodeOk, PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {PSChannelModel} from "@/components/common/models/channel";
import {uuidToBase58} from "@/atom/common/utils/basex";
import {isValidUUID} from "@/atom/common/utils/uuid";
import {PSImageServer} from "@/components/server/image";
import {STSubString} from "@/atom/common/utils/string";
import {getDefaultChanImageByUid} from "@/components/common/channel";
import {PageMetadata} from "@/components/common/utils/page";
import {langEn} from "@/atom/common/language";
import queryString from "query-string";
import {useServerConfig} from "@/components/server/config";
import {serverMakeGet} from "@/atom/server/http";
import {NoDataPage} from "@/components/misc/NoData";
import {Request, Response} from "express";

const styles = {
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

        @media (max-width: 768px) {
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
};

export async function Page(request: Request, response: Response) {
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL


    const pageSize = 64
    const lang = request.params.lang || langEn

    const selectQuery = {
        page: 1,
        size: pageSize,
        lang: lang
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${serverUrl}/channels?${rawQuery}`
    const result = await serverMakeGet<PLSelectResult<PSChannelModel>>(url, '')

    const pathname = request.path
    const metadata = new PageMetadata(lang)
    if (!result || !result.data) {
        return <NoDataPage lang={lang} pathname={pathname}
                           metadata={metadata} size={'middle'}/>
    }
    if (result.code !== CodeOk) {
        return <NoDataPage lang={lang} pathname={pathname}
                           metadata={metadata} size={'middle'} message={result.message}/>
    }

    return <ContentLayout userInfo={SymbolUnknown} lang={lang} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.container}>
            <div className={styles.list}>
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

    return < div className={styles.item}>
        <div className={styles.itemCover}>
            <PSImageServer lang={props.lang} src={imageUrl} alt='star' width={256} height={256}/>
        </div>
        <div className={styles.content}>
            <div className={styles.title}>
                <a className={styles.link} href={readUrl}>{props.model.name}</a>
            </div>
            <div className={styles.description}>
                {STSubString(props.model.description, 140)}
            </div>
        </div>
    </div>
}
