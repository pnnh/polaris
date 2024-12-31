'use client'

import React from "react";

import './article.scss'
import {BuildBodyHtml} from "@/atom/server/article";
import {TocItem} from "@/atom/common/models/toc";

export function ArticleComponent({children}: {
    children: React.ReactNode
}) {
    return <div>
        {children}
    </div>
}

export function ArticleContainer({tocList, header, body, assetsUrl}: {
    tocList: Array<TocItem>,
    header: string,
    body: unknown,
    assetsUrl: string
}) {
    return (
        <ArticleComponent>
            <BuildBodyHtml tocList={tocList} header={header} body={body}
                           assetsUrl={assetsUrl} libUrl={'/abc'}/>
        </ArticleComponent>
    )
}
