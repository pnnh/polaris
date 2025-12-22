import React from 'react'
import {css} from '@emotion/css';
import {CommentsClient} from "@/components/client/comments/comments";
import {useServerConfig} from "@/components/server/config";
import {langEn} from "@/atom/common/language";
import {PageMetadata} from "@/components/common/utils/page";
import Base32Component from "@/components/client/tools/base32/base32";
import {base32Uid, queryApp} from "@/components/server/tools/tools";
import {ContentLayout} from "@/components/server/content/layout";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {Request, Response} from "express";

const styles = {
    base32Page: css`
        width: 1024px;
        margin: 0 auto;
    `,
    productTitle: css`
        font-size: 1.8rem;
        font-weight: 600;
        margin: 1rem 0;
        text-align: center;
    `,
    commentsClient: css`
        /* Comments client styling */
    `
};

export async function Home(request: Request, response: Response) {
    const pathname = request.path

    const lang = request.params.lang || langEn


    const appInfo = queryApp(lang, base32Uid)
    if (!appInfo) {

        response.status(404).send("Not Found");
        return;
    }

    const metadata = new PageMetadata(lang, appInfo.name)
    metadata.description = appInfo.description
    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    return <ContentLayout lang={lang} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={styles.base32Page}>
            <h1 className={styles.productTitle}>{appInfo.name}</h1>
            <Base32Component lang={lang}/>
            <div className={styles.commentsClient}>
                <CommentsClient portalUrl={portalUrl} resource={appInfo.uid}
                                lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}
