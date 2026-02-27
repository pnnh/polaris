'use client'

import Prism from 'prismjs';
import {css} from "@/gen/styled/css";

export function WePreview({jsonText}: { jsonText: string }) {
    if (!jsonText) {
        return <code>无内容</code>
    }
    let htmlText = ''
    try {
        const parsed = JSON.parse(jsonText);
        const newJsonText = JSON.stringify(parsed, null, 2);
        const highlightHtml = Prism.highlight(newJsonText, Prism.languages.javascript, 'javascript');
        htmlText = highlightHtml
    } catch (error) {
        htmlText = 'Invalid JSON: ' + error
    }
    return <>
        <code dangerouslySetInnerHTML={{__html: htmlText}} className={previewStyles.previewCode}>
        </code>
    </>
}

const previewStyles = {
    previewCode: css`
        font-family: 'Courier New', Courier, monospace;
        padding: 10px;
        border-radius: 5px;
        overflow-x: auto;
        white-space: pre-wrap;
    `
}
