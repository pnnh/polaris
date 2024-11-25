import React from "react";

import {BuildBodyHtml} from 'atom/server'
import {TocItem} from "atom/common";
import {ArticleComponent} from "atom/client";

export function ArticleContainer({tocList, header, body, assetsUrl}: {
    tocList: Array<TocItem>, header: string, body: unknown,
    assetsUrl: string
}) {
    return (
        <ArticleComponent>
            看看看看
            {/*<BuildBodyHtml tocList={tocList} header={header} body={body}*/}
            {/*               assetsUrl={assetsUrl}/>*/}
        </ArticleComponent>
    )
}
