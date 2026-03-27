'use client'

import * as React from 'react';
import { Button } from "@/components/ui/button";
import {transKey} from "@/components/common/locales/normal";
import {rsaServerEncode} from "./server";
import {PSFileModel} from "@/components/common/models/file";
import {css} from "@/gen/styled/css";

export default function RsaComponent({lang, appInfo}: { lang: string, appInfo: PSFileModel }) {
    const [source, setSource] = React.useState('');
    const [output, setOutput] = React.useState('');

    const encodeFunc = () => {
        if (!source) {
            return;
        }
        rsaServerEncode(source, 'hello12345678ab').then((encodedText) => {
            setOutput(encodedText);
        });
    }
    return <div className={rsaStyles.sha256Page}>
        <h1>{appInfo.name}</h1>
        <textarea className={rsaStyles.sourceText} placeholder={
            transKey(lang, "tools.common.inputPlaceholder")
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={rsaStyles.toolButtons}>
            <Button size={'sm'} onClick={encodeFunc}>
                {transKey(lang, "tools.rsa.encode")}
            </Button>
        </div>
        <textarea className={rsaStyles.targetText} placeholder={
            transKey(lang, "tools.common.resultPlaceholder")
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}

const rsaStyles = {
    sha256Page: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 16px;
        height: 100%;
        scrollbar-width: thin;
        overflow-y: auto;
        overflow-x: hidden;
    `,
    sourceText: css`
        width: 900px;
        height: 160px;
        padding: 8px;
        flex-shrink: 0;
        background: #FFFFFF;
        border: 1px solid #d3d3d3;
        border-radius: 8px;
    `,
    toolButtons: css`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 16px;
        flex-shrink: 0;
    `,
    targetText: css`
        width: 900px;
        height: 160px;
        padding: 8px;
        flex-shrink: 0;
        background: #FFFFFF;
        border: 1px solid #d3d3d3;
        border-radius: 8px;
    `
}
