'use client'

import React from "react";

import {ArticleStyle} from "./style";
import {TocItem} from "@/models/common/toc";
import {BuildBodyHtml} from "@/components/server/article";

export function ArticleComponent({children}: {
    children: React.ReactNode
}) {
    return <div>
        <ArticleStyle/>
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
