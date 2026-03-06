import React from 'react'
import {css} from "@/gen/styled/css";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getPathname} from "@/components/server/pathname";
import {SymbolUnknown} from "@pnnh/atom";
import {mustBase58ToUuid, tryBase58ToUuid} from "@pnnh/atom";
import {notFound} from "next/navigation";
import ConsoleLayout from "@/components/server/console/layout";
import {serverConsoleGetChannel} from "@/components/server/channels/channels";
import {useServerConfig} from "@/components/server/config";
import {ConsoleChannelForm} from "./form";
import {EmptyUUID} from "@pnnh/atom";
import {PSChannelModel} from "@/components/common/models/channel";

export const dynamic = "force-dynamic";

const pageStyles = {
    contentContainer: css`
        display: flex;
        flex-direction: column;
        width: 100%;
    `,
    conRight: css`
    `,
    conMiddle: css`
        flex: 1;
    `
}

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const searchValue = await searchParams
    const lang = paramsValue.lang

    const channelUid = tryBase58ToUuid(paramsValue.channel)
    if (!channelUid) {
        notFound();
    }
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle('')
    const serverConfig = await useServerConfig()

    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const isNew = channelUid === EmptyUUID;
    let model: PSChannelModel | undefined = undefined;
    if (isNew) {
        model = {
            name: "",
            image: "",
            owner: EmptyUUID,
            uid: EmptyUUID,
            description: '',
            create_time: '',
            update_time: ''
        }
    } else {
        if (!channelUid) {
            notFound();
        }
        model = await serverConsoleGetChannel(internalStargateUrl, channelUid)
        if (!model || !model.uid) {
            notFound();
        }
        metadata.title = pageTitle(lang, model.name)
        metadata.description = model.description || ''

    }


    const modelString = JSON.stringify(model)

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchValue} pathname={pathname}
                          metadata={metadata}>
        <div className={pageStyles.contentContainer}>
            <div className={pageStyles.conMiddle}>
                <ConsoleChannelForm stargateUrl={publicStargateUrl} modelString={modelString}/>
            </div>
        </div>
    </ConsoleLayout>
}


