import React from 'react'
import {css} from '@emotion/css'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {calcPagination} from "@/atom/common/utils/pagination";
import {langEn} from "@/atom/common/language";
import {useServerConfig} from "@/components/server/config";
import {ConsoleImageLayout} from "@/components/server/console/images/layout";
import {ConsoleImageFilterBar} from "./filter";
import {ConsoleImageMiddleBody} from "./image";
import {Request, Response} from "express";

const styles = {
    contentContainer: css`
        display: flex;
        flex-direction: column;
        width: 100%;
    `,
    conMiddle: css`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        scrollbar-width: thin;
        border-radius: 4px;
        overflow-y: auto;
        overflow-x: hidden;
    `,
    middlePagination: css`
        width: 100%;
        background: var(--background-color);
    `
};

export const dynamic = "force-dynamic";

export async function Page(request: Request, response: Response) {
    const pathname = request.path


    const lang = request.params.lang || langEn

    let page = Number(request.query.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')

    const serverConfig = await useServerConfig()

    const libName = request.query.libName
    const pagination = calcPagination(page, 100, pageSize)
    return <ConsoleImageLayout userInfo={SymbolUnknown} lang={lang}
                               metadata={metadata}>
        <div className={styles.contentContainer}>
            <ConsoleImageFilterBar lang={lang} keyword={request.query.keyword as string}/>
            <div className={styles.conMiddle}>
                <ConsoleImageMiddleBody libKey={libName as string} lang={lang}
                                        portalUrl={serverConfig.PUBLIC_PORTAL_URL}/>
                <div className={styles.middlePagination}>
                    <PaginationServer lang={lang} pagination={pagination}
                                      pageLinkFunc={(page) =>
                                          `/${lang}/console/articles` + replaceSearchParams({}, 'page', page.toString())}/>
                </div>
            </div>
        </div>
    </ConsoleImageLayout>
}
