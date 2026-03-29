import React from 'react'

import {getPathname} from "@/components/server/pathname";
import {langZh, SymbolUnknown} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import ConsoleLayout from "@/components/server/console/layout";
import {css} from "@/gen/styled/css";
import {serverConsoleSelectChannels} from "@/components/server/channels/channels";
import {UploadArticlesForm} from "./form";

const pageStyles = {
    uploadPage: css`
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        width: 100%;
        background: var(--background-color);
    `,
    pageContainer: css`
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    `
}

export const dynamic = "force-dynamic";

export default async function UploadArticlesPage({params, searchParams}: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const searchValue = await searchParams;
    const pageLang = paramsValue.lang || langZh

    const serverConfig = await useServerConfig()
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL

    // Query channels for selection
    const channelsData = await serverConsoleSelectChannels(internalStargateUrl, pageLang, {
        page: 1,
        size: 100
    });

    const channelsString = JSON.stringify(channelsData.range);

    return <ConsoleLayout lang={pageLang} pathname={pathname} searchParams={searchValue}
                          userInfo={SymbolUnknown}>
        <div className={pageStyles.uploadPage}>
            <div className={pageStyles.pageContainer}>
                <UploadArticlesForm
                    stargateUrl={publicStargateUrl}
                    channelsString={channelsString}
                    lang={pageLang}
                />
            </div>
        </div>
    </ConsoleLayout>
}
