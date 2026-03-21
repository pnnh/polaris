'use client'

import React, {useEffect, useState} from "react";
import {buildNodeView, SteleBody, TocItem} from "@pnnh/atom";
import DOMPurify from 'isomorphic-dompurify';
import {PSArticleModel} from "@/components/common/models/article";

export function BuildBodyHtml({tocList, model}: {
    tocList: Array<TocItem>,
    model: PSArticleModel
}) {
    const body = model.body

    const [santitizedCss, setSantitizedCss] = useState<string>('')
    const [sanitizedHtml, setSanitizedHtml] = useState('')

    useEffect(() => {
        if (model.mimetype === 'text/markdown' && typeof model.content === 'string') {
            setSanitizedHtml(DOMPurify.sanitize(model.content, {USE_PROFILES: {html: true}}))
            if (typeof model.styles === 'string') {
                setSantitizedCss(DOMPurify.sanitize(model.styles, {USE_PROFILES: {html: true}}))
            }
        }
    }, [body, model.mimetype])

    if (!body) return <></>
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
