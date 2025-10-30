import React from 'react'
import ContentLayout from "@/components/server/content/layout";
import {getPathname} from "@/components/server/pathname";
import styles from './page.module.scss'
import {CodeOk, PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {PSChannelModel} from "@/photon/common/models/channel";
import {NoData} from "@/components/common/empty";
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

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, viewer: string }>,
    searchParams: Promise<Record<string, string> & { query: string | undefined }>
}) {
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.PUBLIC_PORTAL_URL
    const paramsValue = await params;
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

    if (!result || !result.data) {
        return <NoData size={'middle'}/>
    }
    if (result.code !== CodeOk) {
        return <NoData size={'middle'} message={result.message}/>
    }
    const pathname = await getPathname()
    const metadata = new PageMetadata(lang)

    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={await searchParams} pathname={pathname}
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
