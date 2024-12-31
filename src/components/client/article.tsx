'use client'

import React from "react";

import './article.scss'
import {TocItem} from "@/models/common/toc";
import {BuildBodyHtml} from "@/atom/server/article";

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
                           assetsUrl={assetsUrl} libUrl={'/static/modules'}/>
        </ArticleComponent>
    )
}
