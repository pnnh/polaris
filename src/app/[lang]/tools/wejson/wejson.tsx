'use client'

import React from 'react';
import {WePreview} from "./preview";
import Button from "@mui/material/Button";
import {Alert} from "@mui/material";

export function WeJsonClient() {
    const [rawContent, setRawContent] = React.useState('');
    const [errMsg, setErrMsg] = React.useState('');
    const [parsedContent, setParsedContent] = React.useState('');

    return <>
        <div className="wejsonContainer">
        <h1>WeJson Client Component</h1>
        <div className="parseRow">
            <div className="rawContent">
                <textarea value={rawContent}
                          onChange={(event) => setRawContent(event.target.value)}/>
            </div>
            <div className="previewContent">
                <WePreview jsonText={parsedContent}/>
            </div>
        </div>
        <div>
            {errMsg && <Alert severity="error">{errMsg}</Alert>}
        </div>
        <div className="toolButtons">
            <Button variant={'contained'} size={'small'} onClick={() => {
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
    <style jsx>{`
      .wejsonContainer {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .parseRow {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
      }
      .rawContent {
        flex-grow: 1;
        flex-shrink: 0;
        height: 20rem;
        background: #FFFFFF;
      }
      .rawContent textarea {
        width: 100%;
        height: 100%;
        padding: 0.5rem;
      }
      .previewContent {
        flex-grow: 1;
        flex-shrink: 0;
        height: 20rem;
        background: #FFFFFF;
        overflow: auto;
        scrollbar-width: thin;
      }
      .previewContent code {
        width: 100%;
        height: 100%;
        padding: 1rem;
        font-family: 'Courier New', Courier, monospace;
        white-space: pre-wrap;
        word-break: break-all;
      }
      .toolButtons {
        margin-bottom: 1rem;
      }
    `}</style>
    </>
}