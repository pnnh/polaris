'use client'

import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import {PSFileModel} from "@/components/common/models/file";
import {Loading} from "@/components/common/loading";
import {stringToMd5} from "@pnnh/atom";
import {IBrowserConfig} from "@/components/common/config";
import {useClientConfig} from "@/components/client/config/config";
import {transKey} from "@/components/common/locales/normal";

export default function Md5Component({lang, appInfo}: { lang: string, appInfo: PSFileModel }) {
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

    const encodeMd5 = () => {
        if (!source) {
            return;
        }
        setOutput(stringToMd5(source));
    }
    return <div className="md5Page">
        <h1>{appInfo.name}</h1>
        <textarea className="sourceText" placeholder={
            transKey(lang, "tools.common.inputPlaceholder")
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className="toolButtons">
            <Button variant="contained" size={'small'} onClick={encodeMd5}>
                {transKey(lang, "tools.md5.encode")}
            </Button>
        </div>
        <textarea className="targetText" placeholder={
            transKey(lang, "tools.common.resultPlaceholder")
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>

        <style jsx>{`
            .md5Page {
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
                width: 512px;
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
                width: 512px;
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
