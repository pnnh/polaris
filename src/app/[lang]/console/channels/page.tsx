import React from 'react'
import {getPathname} from "@/components/server/pathname";
import styles from './page.module.scss'
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {PSChannelModel} from "@/photon/common/models/channel";
import {NoData} from "@/components/common/empty";
import {encodeBase58String, stringToBase58, uuidToBase58} from "@/atom/common/utils/basex";
import {EmptyUUID, isValidUUID} from "@/atom/common/utils/uuid";
import {PSImageServer} from "@/components/server/image";
import {STSubString} from "@/atom/common/utils/string";
import {getDefaultChanImageByUid} from "@/components/common/channel";
import {PageMetadata} from "@/components/common/utils/page";
import {langEn, localText} from "@/atom/common/language";
import ConsoleLayout from "@/components/server/console/layout";
import Button, {ButtonProps} from "@mui/material/Button";
import {ConsoleChannelFilterBar} from "@/app/[lang]/console/channels/filter";
import {serverConsoleSelectChannels} from "@/components/server/channels/channels";
import {useServerConfig} from "@/components/server/config";
import PSDeleteButton from "@/components/client/console/delete";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, viewer: string }>,
    searchParams: Promise<Record<string, string> & { query: string | undefined }>
}) {
    const paramsValue = await params;
    const searchValue = await searchParams
    const lang = paramsValue.lang || langEn
    const serverConfig = await useServerConfig()
    const selectData = await serverConsoleSelectChannels(serverConfig.PUBLIC_PORTAL_URL, lang, {})

    if (!selectData) {
        return <NoData size={'middle'}/>
    }
    const pathname = await getPathname()
    const metadata = new PageMetadata(lang)

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchValue} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.channelsContainer}>
            <ConsoleChannelFilterBar lang={lang} keyword={searchValue.keyword}/>
            <div className={styles.list}>
                {selectData.range.map((model) => {
                    return <Item key={model.uid} model={model} portalUrl={serverConfig.PUBLIC_PORTAL_URL} lang={lang}/>
                })}
            </div>
        </div>
    </ConsoleLayout>
}

function Item(props: { model: PSChannelModel, portalUrl: string, lang: string }) {
    const model = props.model
    const readUrl = `/${props.lang}/console/channels/${uuidToBase58(props.model.uid)}`
    let imageUrl = getDefaultChanImageByUid(model.uid)
    if (model.image && isValidUUID(model.image)) {
        imageUrl = `${props.portalUrl}/channels/${model.uid}/assets/${model.image}`
    }

    const newUrl = `/${props.lang}/console/articles/${uuidToBase58(EmptyUUID)}?channel=${uuidToBase58(model.uid)}`
    const deleteUrl = `${props.portalUrl}/console/channels/${model.uid}`
    return < div className={styles.item}>
        <div className={styles.itemCover}>
            <PSImageServer lang={props.lang} src={imageUrl} alt='star' width={256} height={256}/>
        </div>
        <div className={styles.title}>
            <a className={styles.link} href={readUrl}>{props.model.name}</a>
        </div>
        <div className={styles.description}>
            {STSubString(props.model.description, 140)}
        </div>
        <div className={styles.operation}>
            <Button size={'small'} variant={'text'} href={newUrl}>
                {localText(props.lang, '新增笔记', 'Create Article')}
            </Button>
        </div>
        <div>
            <PSDeleteButton lang={props.lang} deleteUrl={deleteUrl} resTitle={model.title || model.name}>
                {localText(props.lang, '删除', 'Delete')}
            </PSDeleteButton>
        </div>
    </div>
}
