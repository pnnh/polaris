import React from 'react'
import {getPathname} from "@/components/server/pathname";
import {css} from "@/gen/styled/css";
import {isValidUUID, langEn, STSubString, SymbolUnknown, uuidToBase58} from "@pnnh/atom";
import {getDefaultChanImageByUid, PSChannelModel} from "@/components/common/models/channel";
import {NoData} from "@/components/widget/empty";
import {PSImageServer} from "@/components/widget/image";

import {ConsoleChannelFilterBar} from "./filter";
import {serverConsoleSelectChannels} from "@/components/server/channels/channels";
import {useServerConfig} from "@/components/server/config";
import PSDeleteButton from "@/components/client/console/delete";
import {transKey} from "@/components/common/locales/normal";
import ConsoleLayout from "@/components/server/console/layout";


export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, viewer: string }>,
    searchParams: Promise<Record<string, string> & { query: string | undefined }>
}) {
    const paramsValue = await params;
    const searchValue = await searchParams
    const lang = paramsValue.lang || langEn
    const serverConfig = await useServerConfig()
    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const selectData = await serverConsoleSelectChannels(internalStargateUrl, lang, {
        keyword: searchValue.keyword
    })

    if (!selectData) {
        return <NoData size={'middle'}/>
    }
    const pathname = await getPathname()

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchValue} pathname={pathname}
    >
        <div className={pageStyles.channelsContainer}>
            <ConsoleChannelFilterBar lang={lang} keyword={searchValue.keyword}/>
            <div className={pageStyles.list}>
                {selectData.range.map((model) => {
                    return <Item key={model.uid} model={model} stargateUrl={publicStargateUrl} lang={lang}/>
                })}
            </div>
        </div>
    </ConsoleLayout>
}

function Item(props: { model: PSChannelModel, stargateUrl: string, lang: string }) {
    const model = props.model
    const readUrl = `/${props.lang}/community/channels/${uuidToBase58(props.model.uid)}`
    let imageUrl = getDefaultChanImageByUid(model.uid)
    if (model.image && isValidUUID(model.image)) {
        imageUrl = `${props.stargateUrl}/channels/${model.uid}/assets/${model.image}`
    }

    const deleteUrl = `${props.stargateUrl}/community/channels/${model.uid}`
    return <div className={pageStyles.item}>
        <div className={pageStyles.itemCover}>
            <PSImageServer src={imageUrl} alt='star' width={256} height={256}/>
        </div>
        <div className={pageStyles.title}>
            <a className={pageStyles.link} href={readUrl}>{props.model.name}</a>
        </div>
        <div className={pageStyles.description}>
            {STSubString(props.model.description, 140)}
        </div>
        <div>
            <PSDeleteButton lang={props.lang} deleteUrl={deleteUrl} resTitle={model.name}>
                {transKey(props.lang, "console.common.delete")}
            </PSDeleteButton>
        </div>
    </div>
}

const pageStyles = {
    channelsContainer: css`
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 0.5rem;
    `,
    list: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
        gap: 1rem;
    `,
    item: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        padding: 1rem;
        background: var(--background-color);
    `,
    itemCover: css`
        width: 100%;
        height: 256px;
        overflow: hidden;
        border-radius: 0.5rem;
    `,
    title: css`
        font-size: 1.2rem;
        font-weight: bold;
    `,
    link: css`
        text-decoration: none;
        color: var(--text-primary-color);
    `,
    description: css`
        font-size: 0.9rem;
        color: var(--text-secondary-color);
    `,
    operation: css`
        display: flex;
        gap: 0.5rem;
    `
}
