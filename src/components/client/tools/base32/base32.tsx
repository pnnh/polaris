'use client'

import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import {decodeBase32String, encodeBase32String} from "@pnnh/atom";
import {IBrowserConfig} from "@/components/common/config";
import {Loading} from "@/components/common/loading";
import {transText} from "@/components/common/locales/normal";
import {useClientConfig} from "@/components/client/config/config";
import {PSFileModel} from "@/components/common/models/file";

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
    return <div className="base32Page">
        <h1>{appInfo.name}</h1>
        <textarea className="sourceText" placeholder={
            transText(lang, '请输入需要编码的文本', 'Please enter the text to be encoded')
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className="toolButtons">
            <Button variant="contained" size={'small'} onClick={encodeBase32}>
                {transText(lang, 'Base32编码', 'Base32 Encode')}
            </Button>
            <Button variant="contained" size={'small'} onClick={decodeBase32}>
                {transText(lang, 'Base32解码', 'Base32 Decode')}
            </Button>
        </div>
        <textarea className="targetText" placeholder={
            transText(lang, '编码结果', 'Encoded Result')
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>

        <style jsx>{`
            .base32Page {
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
                width: 800px;
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
                width: 800px;
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
    </div>
}
