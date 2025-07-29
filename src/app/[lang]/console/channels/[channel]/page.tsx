import React from 'react'
import styles from './page.module.scss'
import {PageMetadata, pageTitle} from "@/utils/page";
import {getPathname} from "@/services/server/pathname";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {base58ToUuid, mustBase58ToUuid} from "@/atom/common/utils/basex";
import {langEn, langZh, localText} from "@/atom/common/language";
import {notFound} from "next/navigation";
import ConsoleLayout from "@/components/server/console/layout";
import {serverConsoleGetChannel} from "@/services/server/channels/channels";
import {useServerConfig} from "@/services/server/config";
import {ConsoleChannelForm} from "./form";
import {EmptyUUID} from "@/atom/common/utils/uuid";
import {PSChannelModel} from "@/photon/common/models/channel";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const searchValue = await searchParams
    const lang = paramsValue.lang

    const channelUid = base58ToUuid(paramsValue.channel)
    if (!channelUid) {
        notFound();
    }
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle('')
    const serverConfig = await useServerConfig()

    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    const isNew = channelUid === EmptyUUID;
    let model: PSChannelModel | undefined = undefined;
    if (isNew) {
        let channelUid = '';
        if (searchValue.channel) {
            channelUid = mustBase58ToUuid(searchValue.channel);
        }
        model = {
            match: "", profile: "",
            name: "",
            cid: "",
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
            notFound();
        }
        model = await serverConsoleGetChannel(portalUrl, channelUid)
        if (!model || !model.uid) {
            notFound();
        }
        metadata.title = pageTitle(lang, model.title)

        metadata.description = model.description

    }


    const modelString = JSON.stringify(model)

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchValue} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.contentContainer}>
            <div className={styles.conMiddle}>
                <ConsoleChannelForm portalUrl={portalUrl} modelString={modelString}/>
            </div>
        </div>
    </ConsoleLayout>
}


