import React from "react";
import {TocItem} from "@pnnh/atom";
import {ArticleComponent} from "@/app/[lang]/host/partials/article";
import {BuildBodyHtml} from "@/app/[lang]/articles/[uid]/body";


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
