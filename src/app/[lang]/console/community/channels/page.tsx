import React from 'react'
import {css} from '@emotion/css'
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {PSChannelModel} from "@/components/common/models/channel";
import {NoData} from "@/components/common/empty";
import {uuidToBase58} from "@/atom/common/utils/basex";
import {EmptyUUID, isValidUUID} from "@/atom/common/utils/uuid";
import {PSImageServer} from "@/components/server/image";
import {STSubString} from "@/atom/common/utils/string";
import {getDefaultChanImageByUid} from "@/components/common/channel";
import {PageMetadata} from "@/components/common/utils/page";
import {langEn} from "@/atom/common/language";
import Button from "@mui/material/Button";
import {ConsoleChannelFilterBar} from "./filter";
import {serverConsoleSelectChannels} from "@/components/server/channels/channels";
import {useServerConfig} from "@/components/server/config";
import PSDeleteButton from "@/components/client/console/delete";
import {transText} from "@/components/common/locales/normal";
import {Request, Response} from "express";
import {ConsoleLayout} from "@/components/server/console/layout";

const styles = {
    channelsContainer: css`
        flex-grow: 1;
        flex-direction: column;
        display: flex;
        gap: 0;
    `,
    list: css`
        padding: 0;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        flex-grow: 1;

        @media (max-width: 48rem) {
            grid-template-columns: 1fr;
        }
    `,
    item: css`
        border-bottom: 1px solid #e5e6eb;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-left: 1rem;
        padding-right: 1rem;
        gap: 16px;
        height: 4rem;
        transition: opacity 0.3s ease-out 0s, transform 0.3s ease-out 0s;
        opacity: 1;
        transform-origin: center top;
        overflow: visible;
        background-color: var(--background-color);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0, 0, 0, 0.1);
        color: var(--text-primary-color);
        position: relative;

        &:last-child {
            border-bottom-width: 0;
        }
    `,
    title: css`
        flex-shrink: 0;
        width: 10rem;
    `,
    link: css`
        color: var(--text-primary-color);
        text-decoration: none;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.6;
    `,
    description: css`
        color: var(--text-primary-color);
        font-size: 14px;
        line-height: 22px;
        flex-grow: 1;
        overflow: hidden;
        white-space: break-spaces;
        text-overflow: ellipsis;
    `,
    actions: css`
        height: 2rem;
        flex-shrink: 0;
    `,
    readButton: css`
        display: block;
        padding: 6px 10px;
        background-color: var(--background-color);
        border-radius: 4px;
    `,
    itemCover: css`
        flex-shrink: 0;
        position: relative;
        width: 3rem;
        height: 3rem;

        img {
            width: 3rem;
            height: 3rem;
            object-fit: cover;
            border-radius: 2px;
        }
    `,
    operation: css``
};

export async function Page(request: Request, response: Response) {


    const lang = request.params.lang || langEn
    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
    const selectData = await serverConsoleSelectChannels(internalPortalUrl, lang, {})

    if (!selectData) {
        return <NoData size={'middle'}/>
    }
    const metadata = new PageMetadata(lang)

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang}
                          metadata={metadata}>
        <div className={styles.channelsContainer}>
            <ConsoleChannelFilterBar lang={lang} keyword={request.query.keyword as string}/>
            <div className={styles.list}>
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
                {transText(props.lang, '新增笔记', 'Create Article')}
            </Button>
        </div>
        <div>
            <PSDeleteButton lang={props.lang} deleteUrl={deleteUrl} resTitle={model.title || model.name}>
                {transText(props.lang, '删除', 'Delete')}
            </PSDeleteButton>
        </div>
    </div>
}
