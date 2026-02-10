'use client'

import * as React from 'react';
import Button from '@mui/material/Button';
import {transKey} from "@/components/common/locales/normal";
import {encodeSHA256} from "@pnnh/atom";
import {PSFileModel} from "@/components/common/models/file";

export default function Hash256Component({lang, appInfo}: { lang: string, appInfo: PSFileModel }) {
    const [source, setSource] = React.useState('');
    const [output, setOutput] = React.useState('');

    const encodeFunc = () => {
        if (!source) {
            return;
        }
        setOutput(encodeSHA256(source));
    }
    return <div className={'sha256Page'}>
        <style jsx>{`
            .sha256Page {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                gap: 16px;
                height: 100%;
                scrollbar-width: thin;
                overflow-y: auto;
                overflow-x: hidden;

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

            }
        `}</style>
        <h1>{appInfo.name}</h1>
        <textarea className={'sourceText'} placeholder={
            transKey(lang, "tools.common.inputPlaceholder")
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={'toolButtons'}>
            <Button variant="contained" size={'small'} onClick={encodeFunc}>
                {transKey(lang, "tools.sha256.encode")}
            </Button>
        </div>
        <textarea className={'targetText'} placeholder={
            transKey(lang, "tools.common.resultPlaceholder")
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}
