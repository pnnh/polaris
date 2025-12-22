import React from 'react';
import {css} from '@emotion/css';
import {WePreview} from "./preview";
import Button from "@mui/material/Button";
import {Alert} from "@mui/material";

const styles = {
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

        textarea {
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

        code {
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
};

export function WeJsonClient() {
    const [rawContent, setRawContent] = React.useState('');
    const [errMsg, setErrMsg] = React.useState('');
    const [parsedContent, setParsedContent] = React.useState('');

    return <div className={styles.wejsonContainer}>
        <h1>WeJson Client Component</h1>
        <div className={styles.parseRow}>
            <div className={styles.rawContent}>
                <textarea value={rawContent}
                          onChange={(event) => setRawContent(event.target.value)}/>
            </div>
            <div className={styles.previewContent}>
                <WePreview jsonText={parsedContent}/>
            </div>
        </div>
        <div>
            {errMsg && <Alert severity="error">{errMsg}</Alert>}
        </div>
        <div className={styles.toolButtons}>
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
}
