'use client'

import React from "react";
import {buildNodeView, SteleBody, TocItem} from "@pnnh/atom";
import DOMPurify from 'isomorphic-dompurify';
import Prism from 'prismjs';
import {markedHighlight} from 'marked-highlight';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-cmake'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import {Marked} from "marked"
import {PSArticleModel} from "@/components/common/models/article";

const marked = new Marked(
    markedHighlight({
        emptyLangClass: '',
        langPrefix: 'language-',
        highlight(code, lang, info) {
            const grammar = Prism.languages[lang];
            if (grammar) {
                return Prism.highlight(code, grammar, lang);
            }
            // Fallback for unsupported languages
            return Prism.highlight(code, Prism.languages.plaintext, 'plaintext');
        }
    })
);

export function BuildBodyHtml({tocList, model}: {
    tocList: Array<TocItem>,
    model: PSArticleModel
}) {
    const body = model.body
    if (!body) return <></>
    let bodyObject: SteleBody | null = null
    if (model.mimetype === 'stele' && typeof body === 'string') {
        bodyObject = JSON.parse(body)
        if (!bodyObject) return <>无效文档格式</>
        if (!bodyObject.name) bodyObject.name = 'body'
    } else if ((model.mimetype === 'text/markdown') && typeof body === 'string') {
        const parsedHtml = marked.parse(body) as string
        const cleanHtml = DOMPurify.sanitize(parsedHtml, {USE_PROFILES: {html: true}});
        return <div dangerouslySetInnerHTML={{__html: cleanHtml}}></div>
    }
    if (!bodyObject) return <>无效文档格式2</>
    const children = bodyObject.children
    if (!children || children.length < 1) return <></>

    return <div className={'stele-viewer'}>
        {buildNodeView(tocList, bodyObject, "assetsUrl")}
    </div>
}
