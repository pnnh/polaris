'use client'

import {BuildBodyHtml} from '@pnnh/stele/server'
import React from "react";
import {TocItem} from "@pnnh/stele/common";
import {ArticleComponent} from "@pnnh/stele/client";

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
