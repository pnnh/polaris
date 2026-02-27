'use client'

import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import {decodeBase32String, encodeBase32String} from "@pnnh/atom";
import {IBrowserConfig} from "@/components/common/config";
import {Loading} from "@/components/common/loading";
import {useClientConfig} from "@/components/client/config/config";
import {PSFileModel} from "@/components/common/models/file";
import {transKey} from "@/components/common/locales/normal";
import {css} from "@/gen/styled/css";

export default function Base32Component({lang, appInfo}: { lang: string, appInfo: PSFileModel }) {
    const [source, setSource] = React.useState('');
    const [output, setOutput] = React.useState('');
    const [clientConfig, setClientConfig] = React.useState<IBrowserConfig | undefined>(undefined);
    useEffect(() => {
        const config = useClientConfig()
        setClientConfig(config);
    }, [])

    if (!clientConfig) {
        return <Loading/>
    }
    const encodeBase32 = () => {
        if (!source) {
            return;
        }
        setOutput(encodeBase32String(source));
    }
    const decodeBase32 = () => {
        try {
            if (!source) {
                return;
            }
            const result = decodeBase32String(source);
            setOutput(result);
        } catch (e) {
            return '';
        }
    }
    return <div className={base32Styles.base32Page}>
        <h1>{appInfo.name}</h1>
        <textarea className={base32Styles.sourceText} placeholder={
            transKey(lang, "tools.common.inputPlaceholder")
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={base32Styles.toolButtons}>
            <Button variant="contained" size={'small'} onClick={encodeBase32}>
                {transKey(lang, "tools.base32.encode")}
            </Button>
            <Button variant="contained" size={'small'} onClick={decodeBase32}>
                {transKey(lang, "tools.base32.decode")}
            </Button>
        </div>
        <textarea className={base32Styles.targetText} placeholder={
            transKey(lang, "tools.common.resultPlaceholder")
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}

const base32Styles = {
    base32Page: css`
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
        width: 800px;
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
        width: 800px;
        height: 160px;
        padding: 8px;
        flex-shrink: 0;
        background: #FFFFFF;
        border: 1px solid #d3d3d3;
        border-radius: 8px;
    `,
    commentsClient: css`
        width: 548px;
    `
}
