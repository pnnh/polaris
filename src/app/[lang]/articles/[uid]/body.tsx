'use client'

import React from "react";
import {TocItem} from "@/atom/common/models/toc";
import {SteleBody} from "@/atom/common/models/stele";
import {buildNodeView} from "@/atom/common/parser/view";
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
import 'prismjs/components/prism-bash'
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
import 'prismjs/components/prism-kotlin'
import {Marked} from "marked"

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

export function BuildBodyHtml(props: {
    tocList: Array<TocItem>,
    header: string,
    body: unknown,
    libUrl: string,
    assetsUrl: string
}) {
    if (!props.body) return <></>
    let bodyObject: SteleBody | null = null
    if (props.header === 'stele' && typeof props.body === 'string') {
        bodyObject = JSON.parse(props.body)
        if (!bodyObject) return <>无效文档格式</>
        if (!bodyObject.name) bodyObject.name = 'body'
    } else if ((props.header === 'markdown' || props.header === 'MTNote') && typeof props.body === 'string') {
        const parsedHtml = marked.parse(props.body) as string
        const cleanHtml = DOMPurify.sanitize(parsedHtml, {USE_PROFILES: {html: true}});
        return <div dangerouslySetInnerHTML={{__html: cleanHtml}}></div>
    }
    if (!bodyObject) return <>无效文档格式</>
    const children = bodyObject.children
    if (!children || children.length < 1) return <></>

    return <div className={'stele-viewer'}>
        <link rel="stylesheet" href={`${props.libUrl}/lib/assets/index.css`}/>
        {buildNodeView(props.tocList, bodyObject, props.assetsUrl)}
    </div>
}
