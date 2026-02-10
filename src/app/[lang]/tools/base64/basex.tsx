'use client'

import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import {decodeBase64String, encodeBase64String} from "@pnnh/atom";
import {IBrowserConfig} from "@/components/common/config";
import {Loading} from "@/components/common/loading";
import {transKey} from "@/components/common/locales/normal";
import {useClientConfig} from "@/components/client/config/config";
import {PSFileModel} from "@/components/common/models/file";

export default function Base64Component({lang, appInfo}: { lang: string, appInfo: PSFileModel }) {
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

    const encodeBase64 = () => {
        if (!source) {
            return;
        }
        setOutput(encodeBase64String(source));
    }
    const decodeBase64 = () => {
        try {
            if (!source) {
                return;
            }
            const resultStr = decodeBase64String(source);
            setOutput(resultStr);
        } catch (e) {
            return '';
        }
    }
    return <>
        <div className="basexPage">
            <h1>{appInfo.name}</h1>
            <textarea className="sourceText" placeholder={
                transKey(lang, "tools.common.inputPlaceholder")
            } value={source}
                      onChange={(event) => setSource(event.target.value)}/>
            <div className="toolButtons">
                <Button variant="contained" size={'small'} onClick={encodeBase64}>
                    {transKey(lang, "tools.base64.encode")}
                </Button>
                <Button variant="contained" size={'small'} onClick={decodeBase64}>
                    {transKey(lang, "tools.base64.decode")}
                </Button>
            </div>
            <textarea className="targetText" placeholder={
                transKey(lang, "tools.common.resultPlaceholder")
            } value={output} onChange={(event) =>
                setOutput(event.target.value)}/>
        </div>
        <style jsx>{`
            .basexPage {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                gap: 16px;
                height: 100%;
                scrollbar-width: thin;
                overflow-y: auto;
                overflow-x: hidden;
            }

            .sourceText {
                width: 900px;
                height: 160px;
                padding: 8px;
                flex-shrink: 0;
                background: #FFFFFF;
                border: 1px solid #d3d3d3;
                border-radius: 8px;
            }

            .toolButtons {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 16px;
                flex-shrink: 0;
            }

            .targetText {
                width: 900px;
                height: 160px;
                padding: 8px;
                flex-shrink: 0;
                background: #FFFFFF;
                border: 1px solid #d3d3d3;
                border-radius: 8px;
            }

            .commentsClient {
                width: 548px;
            }
        `}</style>
    </>
}
