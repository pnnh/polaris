'use client'

import React from "react";
import {TocItem} from "@/models/common/toc";
import {ArticleComponent} from "@/components/client/article";


export function ArticleContainer({tocList, header, body, assetsUrl}: {
    tocList: Array<TocItem>, header: string, body: unknown,
    assetsUrl: string
}) {
    return (
        <ArticleComponent>
            <div>文章正文</div>
            {/*<BuildBodyHtml tocList={tocList} header={header} body={body}*/}
            {/*               assetsUrl={assetsUrl}/>*/}
        </ArticleComponent>
    )
}
