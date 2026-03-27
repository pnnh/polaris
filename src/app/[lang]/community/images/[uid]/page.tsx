import React from 'react'

import {EmptyUUID, langZh, SymbolUnknown, tryBase58ToUuid} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import {notFound} from "next/navigation";
import {ConsolePhotoForm} from "./form";
import {PSImageModel} from "@/components/common/models/image";
import {css} from "@/gen/styled/css";
import {CommunityImageNodeService} from "@/components/community/images";
import {getPathname} from "@/components/server/pathname";
import {serverConsoleSelectChannels} from "@/components/server/channels/channels";
import CommunityLayout from "@/components/server/community/layout";

export const dynamic = "force-dynamic";

const pageStyles = {
    imagesPage: css`
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        width: 100%;
    `,
    pageContainer: css`
    `
}

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, uid: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const searchValue = await searchParams;
    const pageLang = paramsValue.lang || langZh
    const serverConfig = await useServerConfig()
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL
    const imageUid = tryBase58ToUuid(paramsValue.uid)
    const isNew = imageUid === EmptyUUID;
    let model: PSImageModel | undefined = undefined;

    if (isNew) {
        model = {
            name: "",
            channel_name: "",
            channel: "",
            discover: 0,
            status: 0,
            owner: "",
            partition: "",
            uid: EmptyUUID,
            title: '',
            description: '',
            keywords: '',
            body: '',
            header: '',
            creator: '',
            file_path: '',
            file_url: '',
            ext_name: '',
            url: '',
            create_time: '',
            update_time: ''
        }
    } else {
        if (!imageUid) {
            notFound();
        }
        const query = {
            action: 'get',
            keyword: imageUid
        }
        const queryResult = await CommunityImageNodeService.consoleQueryImages(internalStargateUrl, pageLang, query)
        if (!queryResult || queryResult.range.length === 0) {
            notFound()
        }
        model = queryResult.range[0];
    }

    const channelsData = await serverConsoleSelectChannels(internalStargateUrl, pageLang, {
        page: 1,
        size: 100
    });

    const modelString = JSON.stringify(model)
    const channelsString = JSON.stringify(channelsData.range)
    return <CommunityLayout lang={pageLang} pathname={pathname} searchParams={searchValue}
                            userInfo={SymbolUnknown}>
        <div className={pageStyles.imagesPage}>
            <div className={pageStyles.pageContainer}>
                <ConsolePhotoForm stargateUrl={publicStargateUrl} modelString={modelString}
                                  channelsString={channelsString} lang={pageLang}/>
            </div>
        </div>
    </CommunityLayout>
}
