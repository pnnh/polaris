'use client'

import {BuildBodyHtml} from 'atom/server'
import React from "react";
import {TocItem} from "atom/common";
import {ArticleComponent} from "atom/client";

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
