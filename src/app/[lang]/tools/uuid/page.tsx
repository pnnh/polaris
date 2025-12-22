import React from 'react'
import './page.scss'
import {UuidToolBody} from "@/components/client/tools/uuid/tool";
import {CommentsClient} from "@/components/client/comments/comments";
import {useServerConfig} from "@/components/server/config";
import {langEn} from "@/atom/common/language";
import {PageMetadata} from "@/components/common/utils/page";
import {queryApp, uuidUid} from "@/components/server/tools/tools";
import {ContentLayout} from "@/components/server/content/layout";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {Request, Response} from "express";

export async function Home(request: Request, response: Response) {
    const pathname = request.path

    const lang = request.params.lang || langEn

    const appInfo = queryApp(lang, uuidUid)
    if (!appInfo) {

        response.status(404).send("Not Found");
        return;
    }

    const metadata = new PageMetadata(lang)

    metadata.title = appInfo.name
    metadata.description = appInfo.description
    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    return <ContentLayout lang={lang} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={'uuidPage'}>
            <div className={'pageContent'}>
                <UuidToolBody lang={lang}/>
            </div>
            <div className={'commentsClient'}>
                <CommentsClient portalUrl={portalUrl} resource={uuidUid}
                                lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}
