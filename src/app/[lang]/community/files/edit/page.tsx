import React from 'react'

import {EmptyUUID, langZh, SymbolUnknown, tryBase58ToUuid} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import {notFound} from "next/navigation";
import {ConsoleFileForm} from "./form";
import {CmFileModel} from "@/components/common/models/file";
import {css} from "@/gen/styled/css";
import {CommunityFileNodeService} from "@/components/community/files";
import {getPathname} from "@/components/server/pathname";
import ConsoleLayout from "@/components/server/console/layout";
import {RootFileUid} from "@/components/common/models/community/file";

export const dynamic = "force-dynamic";

const pageStyles = {
    filesPage: css`
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        width: 100%;
    `,
    pageContainer: css``
}

export default async function Home({params, searchParams}: {
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
    const isNew = searchValue.isNew === 'true';
    let model: CmFileModel | undefined = undefined;

    if (isNew) {
        model = {
            uid: EmptyUUID,
            name: '',
            title: '',
            description: '',
            keywords: '',
            body: '',
            header: '',
            cover: '',
            owner: '',
            owner_name: '',
            status: 0,
            discover: 0,
            url: '',
            mimetype: '',
            parent: RootFileUid,
            path: '',
            create_time: '',
            update_time: ''
        }
    } else {
        const fileUid = tryBase58ToUuid(searchValue.uid)
        if (!fileUid) {
            notFound();
        }
        const query = {
            action: 'get',
            keyword: fileUid
        }
        const queryResult = await CommunityFileNodeService.consoleQueryFiles(internalStargateUrl, pageLang, query)
        if (!queryResult || queryResult.range.length === 0) {
            notFound()
        }
        model = queryResult.range[0];
    }

    return <ConsoleLayout lang={pageLang} pathname={pathname} searchParams={searchValue}
                          userInfo={SymbolUnknown}>
        <div className={pageStyles.filesPage}>
            <div className={pageStyles.pageContainer}>
                <ConsoleFileForm stargateUrl={publicStargateUrl} model={model} lang={pageLang}/>
            </div>
        </div>
    </ConsoleLayout>
}
