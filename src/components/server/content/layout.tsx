import React from 'react'
import {ContentPublicNavbar} from "@/components/server/content/partials/navbar";
import {css} from "@/gen/styled/css";
import {SymbolUnknown} from "@pnnh/atom";
import {serverGetUserinfo, serverTryGetUserinfo} from "@/components/server/account/account";
import {useServerConfig} from "@/components/server/config";
import GlobalLayout from "@/components/server/global";
import {PageMetadata} from "@/components/common/utils/page";
import {AccountModel, anonymousAccount} from "@/components/common/models/account/account";
import {isErrorLike} from "@/components/common/error";

const styles = {
    templateContainer: css`
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        scrollbar-width: thin;
    `,
    templateNavbar: css`
        width: 100vw;
        background-color: var(--background-color);
        border-bottom: solid 1px #d3d3d3;
    `,
    templateBody: css`
        scrollbar-width: thin;
        overflow-x: hidden;
        overflow-y: auto;
    `,
    bodyContainer: css`
        margin: 0 auto;
        @media screen and (min-width: 120rem) {
            width: calc(120rem - 24rem);
            margin: 0 auto;
        }
    `,
};

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
    metadata: PageMetadata,
    lang: string,
    userInfo: AccountModel | typeof SymbolUnknown,
}) {
    let currentUserInfo: AccountModel | undefined;
    const serverConfig = await useServerConfig()
    if (userInfo === SymbolUnknown) {
        const portalUrl = serverConfig.INTERNAL_PORTAL_URL
        const getResult = await serverTryGetUserinfo(portalUrl);
        // 出错时认为是未登录，返回匿名用户
        if (isErrorLike(getResult)) {
            currentUserInfo = anonymousAccount;
        } else {
            currentUserInfo = getResult as AccountModel;
        }
    } else {
        currentUserInfo = userInfo;
    }
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.templateContainer}>
            <div className={styles.templateNavbar}>
                <ContentPublicNavbar pathname={pathname} searchParams={searchParams} lang={lang}
                                     userInfo={currentUserInfo}/>
            </div>
            <div id={templateBodyId} className={styles.templateBody}>
                <div className={styles.bodyContainer}>
                    {children}
                </div>
            </div>
        </div>
    </GlobalLayout>
}
