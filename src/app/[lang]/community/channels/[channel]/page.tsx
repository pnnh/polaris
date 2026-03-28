import React from 'react'
import {css} from "@/gen/styled/css";

import {getPathname} from "@/components/server/pathname";
import {EmptyUUID, SymbolUnknown, tryBase58ToUuid} from "@pnnh/atom";
import {notFound} from "next/navigation";
import {serverConsoleGetChannel} from "@/components/server/channels/channels";
import {useServerConfig} from "@/components/server/config";
import {ConsoleChannelForm} from "./form";
import {PSChannelModel} from "@/components/common/models/channel";
import ConsoleLayout from "@/components/server/console/layout";

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
            update_time: '',
            status: 0
        }
    } else {
        if (!channelUid) {
            notFound();
        }
        model = await serverConsoleGetChannel(internalStargateUrl, channelUid)
        if (!model || !model.uid) {
            notFound();
        }
    }


    const modelString = JSON.stringify(model)

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchValue} pathname={pathname}
    >
        <div className={pageStyles.contentContainer}>
            <div className={pageStyles.conMiddle}>
                <ConsoleChannelForm stargateUrl={publicStargateUrl} modelString={modelString}/>
            </div>
        </div>
    </ConsoleLayout>
}


