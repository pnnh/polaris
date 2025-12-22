import React from 'react'
import {css} from '@emotion/css'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {tryBase58ToUuid} from "@/atom/common/utils/basex";
import {ConsoleLayout} from "@/components/server/console/layout";
import {serverConsoleGetChannel} from "@/components/server/channels/channels";
import {useServerConfig} from "@/components/server/config";
import {ConsoleChannelForm} from "./form";
import {EmptyUUID} from "@/atom/common/utils/uuid";
import {PSChannelModel} from "@/components/common/models/channel";
import {Request, Response} from "express";

const styles = {
    contentContainer: css`
        flex-grow: 1;
        flex-direction: row;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin: 1rem;
    `,
    conRight: css`
        display: block;
        width: 16rem;
        flex-shrink: 0;

        @media (max-width: 48rem) {
            display: none;
        }
    `,
    conMiddle: css`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 1;
        background-color: var(--background-color);
        border-radius: 4px;
    `,
    middleBody: css`
        width: 100%;
    `,
    middleItem: css`
        width: 100%;
        height: 10rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 1px #e4e6eb80;
        gap: 1rem;
    `,
    itemDetail: css`
        display: flex;
        padding: 0.5rem 1rem;
        flex-direction: column;
        justify-content: flex-start;
        flex-grow: 1;
        height: 8rem;
    `,
    description: css`
        flex-grow: 1;
        color: var(--text-primary-color);
        font-size: 13px;
        line-height: 22px;
        margin-top: 1rem;
        margin-bottom: 1rem;
        overflow: hidden;
    `,
    action: css`
        height: 1rem;
        color: var(--text-primary-color);
        font-size: 12px;
        line-height: 22px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 6px;
    `,
    middlePagination: css`
        width: 100%;
    `
};

export const dynamic = "force-dynamic";

export async function Page(request: Request, response: Response) {
    const pathname = request.path


    const lang = request.params.lang

    const channelUid = tryBase58ToUuid(request.params.channel)
    if (!channelUid) {
        ;
        response.status(404).send('Not Found')
        return
    }
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle('')
    const serverConfig = await useServerConfig()

    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const isNew = channelUid === EmptyUUID;
    let model: PSChannelModel | undefined = undefined;
    if (isNew) {
        model = {
            match: "", profile: "",
            name: "",
            image: "",
            creator: "",
            owner: "",
            uid: EmptyUUID,     // 设置为空以供form表单识别是新建文章
            title: '',
            description: '',
            lang,
            create_time: '',
            update_time: ''
        }
    } else {
        if (!channelUid) {
            ;
            response.status(404).send('Not Found')
            return
        }
        model = await serverConsoleGetChannel(internalPortalUrl, channelUid)
        if (!model || !model.uid) {
            response.status(404).send('Not Found')
            return
        }
        metadata.title = pageTitle(lang, model.title)

        metadata.description = model.description

    }


    const modelString = JSON.stringify(model)

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang}
                          metadata={metadata}>
        <div className={styles.contentContainer}>
            <div className={styles.conMiddle}>
                <ConsoleChannelForm publicPortalUrl={publicPortalUrl} modelString={modelString}/>
            </div>
        </div>
    </ConsoleLayout>
}


