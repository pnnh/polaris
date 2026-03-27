'use client'

import React from 'react';
import {WePreview} from "./preview";
import { Button } from "@/components/ui/button";
import {Alert} from "@mui/material";
import {css} from "@/gen/styled/css";

export function WeJsonClient() {
    const [rawContent, setRawContent] = React.useState('');
    const [errMsg, setErrMsg] = React.useState('');
    const [parsedContent, setParsedContent] = React.useState('');

    return <>
        <div className={wejsonStyles.wejsonContainer}>
            <h1>WeJson Client Component</h1>
            <div className={wejsonStyles.parseRow}>
                <div className={wejsonStyles.rawContent}>
                <textarea value={rawContent}
                          onChange={(event) => setRawContent(event.target.value)}/>
                </div>
                <div className={wejsonStyles.previewContent}>
                    <WePreview jsonText={parsedContent}/>
                </div>
            </div>
            <div>
                {errMsg && <Alert severity="error">{errMsg}</Alert>}
            </div>
            <div className={wejsonStyles.toolButtons}>
                <Button size={'sm'} onClick={() => {
                    try {
                        const parsed = JSON.parse(rawContent);
                        setParsedContent(JSON.stringify(parsed, null, 2));
                    } catch (error) {
                        setErrMsg('Invalid JSON: ' + error);
                    }
                }}>Parse JSON
                </Button>
            </div>
        </div>
    </>
}

const wejsonStyles = {
    wejsonContainer: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `,
    parseRow: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    `,
    rawContent: css`
        flex-grow: 1;
        flex-shrink: 0;
        height: 20rem;
        background: #FFFFFF;

        & textarea {
            width: 100%;
            height: 100%;
            padding: 0.5rem;
        }
    `,
    previewContent: css`
        flex-grow: 1;
        flex-shrink: 0;
        height: 20rem;
        background: #FFFFFF;
        overflow: auto;
        scrollbar-width: thin;

        & code {
            width: 100%;
            height: 100%;
            padding: 1rem;
            font-family: 'Courier New', Courier, monospace;
            white-space: pre-wrap;
            word-break: break-all;
        }
    `,
    toolButtons: css`
        margin-bottom: 1rem;
    `
}
