import React from 'react'
import {ContentPublicNavbar} from "@/components/server/content/partials/navbar";
import './layout.scss'
import {Metadata} from "next";
import {AccountModel} from "@/atom/common/models/account";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {serverGetUserinfo} from "@/atom/server/account/account";
import {useServerConfig} from "@/services/server/config";

export const templateBodyId = 'globalTemplateBody'

export default async function ContentLayout({
                                                children,
                                                pathname,
                                                searchParams,
                                                metadata,
                                                lang,
                                                userInfo
                                            }: {
    children: React.ReactNode,
    pathname: string,
    searchParams: Record<string, string>,
    metadata: Metadata,
    lang: string,
    userInfo: AccountModel | typeof SymbolUnknown
}) {
    let currentUserInfo: AccountModel;
    if (userInfo === SymbolUnknown) {
        const serverConfig = useServerConfig()
        const portalUrl = serverConfig.PUBLIC_PORTAL_URL
        currentUserInfo = await serverGetUserinfo(portalUrl);
    } else {
        currentUserInfo = userInfo;
    }
    return <div className={'templateContainer'}>
        <div className={'templateNavbar'}>
            <ContentPublicNavbar pathname={pathname} searchParams={searchParams} lang={lang}
                                 userInfo={currentUserInfo}/>
        </div>
        <div id={templateBodyId} className={'templateBody'}>
            <div className={'bodyContainer'}>
                {children}
            </div>
        </div>
    </div>
}
