import React from "react";

import {BuildBodyHtml} from '@pnnh/atom'
import {TocItem} from "@pnnh/atom";
import {ArticleComponent} from "@pnnh/atom";

export function ArticleContainer({tocList, header, body, assetsUrl}: {
    tocList: Array<TocItem>, header: string, body: unknown,
    assetsUrl: string
}) {
    return (
        <ArticleComponent>
            <BuildBodyHtml tocList={tocList} header={header} body={body}
                           assetsUrl={assetsUrl} libUrl={''}/>
        </ArticleComponent>
    )
}
