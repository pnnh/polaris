import React from 'react'
import {css} from "@/gen/styled/css";
import {getPathname} from "@/components/server/pathname";
import {EmptyUUID, SymbolUnknown, tryBase58ToUuid} from "@pnnh/atom";
import {notFound} from "next/navigation";
import {useServerConfig} from "@/components/server/config";
import {ManagementToolService} from "@/components/management/tools";
import {PSToolModel} from "@/components/common/models/tool";

import {ManagementToolForm} from "./form";
import ConsoleLayout from "@/components/server/console/layout";

export const dynamic = "force-dynamic";

const pageStyles = {
    contentContainer: css`
        display: flex;
        flex-direction: column;
        width: 100%;
    `,
    conMiddle: css`
        flex: 1;
    `
}

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, tool: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const searchValue = await searchParams
    const lang = paramsValue.lang

    const toolUid = tryBase58ToUuid(paramsValue.tool)
    if (!toolUid) {
        notFound();
    }

    const serverConfig = await useServerConfig()
    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL

    const isNew = toolUid === EmptyUUID;
    let model: PSToolModel | undefined = undefined;

    if (isNew) {
        model = {
            uid: EmptyUUID,
            title: '',
            name: '',
            keywords: '',
            description: '',
            status: 0,
            cover: '',
            owner: EmptyUUID,
            discover: 0,
            version: '',
            url: '',
            lang: '',
            create_time: '',
            update_time: ''
        }
    } else {
        model = await ManagementToolService.getTool(internalStargateUrl, toolUid)
        if (!model || !model.uid) {
            notFound();
        }
    }

    const modelString = JSON.stringify(model)

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchValue} pathname={pathname}>
        <div className={pageStyles.contentContainer}>
            <div className={pageStyles.conMiddle}>
                <ManagementToolForm stargateUrl={publicStargateUrl} lang={lang} modelString={modelString}/>
            </div>
        </div>
    </ConsoleLayout>
}
