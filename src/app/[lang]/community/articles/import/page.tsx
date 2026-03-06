import React from 'react'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getPathname} from "@/components/server/pathname";
import {langZh, SymbolUnknown} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import ConsoleLayout from "@/components/server/console/layout";
import {css} from "@/gen/styled/css";
import {transKey} from "@/components/common/locales/normal";
import {serverConsoleSelectNotes} from "@/components/personal/notes-server";
import {serverConsoleSelectChannels} from "@/components/server/channels/channels";
import {ImportArticlesForm} from "./form";

const pageStyles = {
    importPage: css`
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

export default async function ImportArticlesPage({params, searchParams}: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const searchValue = await searchParams;
    const pageLang = paramsValue.lang || langZh
    const metadata = new PageMetadata(pageLang)
    metadata.title = pageTitle(pageLang, transKey(pageLang, 'console.article.importFromNotes'))
    
    const serverConfig = await useServerConfig()
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL
    
    // Query notes (max 50)
    const keyword = searchValue.keyword || '';
    const notesData = await serverConsoleSelectNotes(internalStargateUrl, pageLang, {
        keyword,
        page: 1,
        size: 50
    });
    
    // Query channels for selection
    const channelsData = await serverConsoleSelectChannels(internalStargateUrl, pageLang, {
        page: 1,
        size: 100
    });
    
    const notesString = JSON.stringify(notesData.range);
    const channelsString = JSON.stringify(channelsData.range);
    
    return <ConsoleLayout lang={pageLang} metadata={metadata} pathname={pathname} searchParams={searchValue}
                          userInfo={SymbolUnknown}>
        <div className={pageStyles.importPage}>
            <div className={pageStyles.pageContainer}>
                <ImportArticlesForm 
                    stargateUrl={publicStargateUrl}
                    notesString={notesString}
                    channelsString={channelsString}
                    keyword={keyword}
                    lang={pageLang}
                />
            </div>
        </div>
    </ConsoleLayout>
}
