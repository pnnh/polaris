'use client'

import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import {transKey} from "@/components/common/locales/normal";
import {IBrowserConfig} from "@/components/common/config";
import {Loading} from "@/components/common/loading";
import {markdownStringToHtml} from "@/components/server/markdown/markdown";
import {PSFileModel} from "@/components/common/models/file";
import {useClientConfig} from "@/components/client/config/config";

export default function MarkdownComponent({lang, appInfo}: { lang: string, appInfo: PSFileModel }) {
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

    const encodeMarkdown = () => {
        if (!source) {
            return;
        }
        const outHtml = markdownStringToHtml(source);
        setOutput(outHtml);
    }
    return <div className="markdownComponent">
        <h1>{appInfo.name}</h1>
        <textarea className="sourceText" placeholder={
            transKey(lang, "tools.markdown.inputPlaceholder")
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className="toolButtons">
            <Button variant="contained" size={'small'} onClick={encodeMarkdown}>
                {transKey(lang, "tools.markdown.preview")}
            </Button>
        </div>
        <textarea className="targetText" placeholder={
            transKey(lang, "tools.markdown.previewResult")
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>

        <style jsx>{`
            .markdownComponent {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                gap: 16px;
                scrollbar-width: thin;
                overflow-y: auto;
                overflow-x: hidden;
                margin-bottom: 2rem;
            }

            .sourceText {
                width: 100%;
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
                width: 100%;
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
