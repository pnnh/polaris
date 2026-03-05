import React from 'react'
import {getPathname} from "@/components/server/pathname";
import {css} from "@/gen/styled/css";
import {EmptyUUID, isValidUUID, langEn, STSubString, SymbolUnknown, uuidToBase58} from "@pnnh/atom";
import {PSChannelModel} from "@/components/common/models/channel";
import {NoData} from "@/components/common/empty";
import {PSImageServer} from "@/components/server/image";
import {getDefaultChanImageByUid} from "@/components/common/channel";
import {PageMetadata} from "@/components/common/utils/page";
import ConsoleLayout from "@/components/server/console/layout";
import Button from "@mui/material/Button";
import {ConsoleChannelFilterBar} from "./filter";
import {serverConsoleSelectChannels} from "@/components/server/channels/channels";
import {useServerConfig} from "@/components/server/config";
import PSDeleteButton from "@/components/client/console/delete";
import {transKey} from "@/components/common/locales/normal";

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
        color: var(--text-color);
    `,
    description: css`
        font-size: 0.9rem;
        color: var(--text-secondary);
    `,
    operation: css`
        display: flex;
        gap: 0.5rem;
    `
}

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, viewer: string }>,
    searchParams: Promise<Record<string, string> & { query: string | undefined }>
}) {
    const paramsValue = await params;
    const searchValue = await searchParams
    const lang = paramsValue.lang || langEn
    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
    const selectData = await serverConsoleSelectChannels(internalPortalUrl, lang, {})

    if (!selectData) {
        return <NoData size={'middle'}/>
    }
    const pathname = await getPathname()
    const metadata = new PageMetadata(lang)

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchValue} pathname={pathname}
                          metadata={metadata}>
        <div className={pageStyles.channelsContainer}>
            <ConsoleChannelFilterBar lang={lang} keyword={searchValue.keyword}/>
            <div className={pageStyles.list}>
                {selectData.range.map((model) => {
                    return <Item key={model.uid} model={model} publicPortalUrl={publicPortalUrl} lang={lang}/>
                })}
            </div>
        </div>
    </ConsoleLayout>
}

function Item(props: { model: PSChannelModel, publicPortalUrl: string, lang: string }) {
    const model = props.model
    const readUrl = `/${props.lang}/console/channels/${uuidToBase58(props.model.uid)}`
    let imageUrl = getDefaultChanImageByUid(model.uid)
    if (model.image && isValidUUID(model.image)) {
        imageUrl = `${props.publicPortalUrl}/channels/${model.uid}/assets/${model.image}`
    }

    const newUrl = `/${props.lang}/console/articles/${uuidToBase58(EmptyUUID)}?channel=${uuidToBase58(model.uid)}`
    const deleteUrl = `${props.publicPortalUrl}/console/channels/${model.uid}`
    return <div className={pageStyles.item}>
        <div className={pageStyles.itemCover}>
            <PSImageServer lang={props.lang} src={imageUrl} alt='star' width={256} height={256}/>
        </div>
        <div className={pageStyles.title}>
            <a className={pageStyles.link} href={readUrl}>{props.model.name}</a>
        </div>
        <div className={pageStyles.description}>
            {STSubString(props.model.description, 140)}
        </div>
        <div className={pageStyles.operation}>
            <Button size={'small'} variant={'text'} href={newUrl}>
                {transKey(props.lang, "console.article.createNew")}
            </Button>
        </div>
        <div>
            <PSDeleteButton lang={props.lang} deleteUrl={deleteUrl} resTitle={model.title || model.name}>
                {transKey(props.lang, "console.common.delete")}
            </PSDeleteButton>
        </div>
    </div>
}
