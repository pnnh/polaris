'use client'

import React from "react";
import {buildNodeView, SteleBody, TocItem} from "@pnnh/atom";
import DOMPurify from 'isomorphic-dompurify';
import {PSArticleModel} from "@/components/common/models/article";
import './body.css'
import {transTodo} from "@/components/common/locales/normal";

export function BuildBodyHtml({tocList, model}: {
    tocList: Array<TocItem>,
    model: PSArticleModel
}) {

    if (!model.body || !model.content) return <div>
        {transTodo('无效格式')}
    </div>

    const body = model.body
    let sanitizedHtml = ''
    let santitizedCss = ''

    if (model.mimetype === 'text/markdown' && typeof model.content === 'string') {
        sanitizedHtml = DOMPurify.sanitize(model.content, {USE_PROFILES: {html: true}})

        if (typeof model.styles === 'string') {
            santitizedCss = DOMPurify.sanitize(model.styles, {USE_PROFILES: {html: true}})
        }
    }
    let bodyObject: SteleBody | null = null
    if (model.mimetype === 'stele' && typeof body === 'string') {
        bodyObject = JSON.parse(body)
        if (!bodyObject) return <>无效文档格式</>
        if (!bodyObject.name) bodyObject.name = 'body'
    } else if (model.mimetype === 'text/markdown' && typeof model.content === 'string') {
        return <article className={'markdown-body'}>
            <polaris-markdown-viewer>
                <style dangerouslySetInnerHTML={{__html: santitizedCss}} suppressHydrationWarning></style>
                <div dangerouslySetInnerHTML={{__html: sanitizedHtml}} suppressHydrationWarning/>
            </polaris-markdown-viewer>
        </article>
    }
    if (!bodyObject) return <>无效文档格式2</>
    const children = bodyObject.children
    if (!children || children.length < 1) return <></>

    return <article className={'markdown-body'}>
        {buildNodeView(tocList, bodyObject, "assetsUrl")}
    </article>
}
