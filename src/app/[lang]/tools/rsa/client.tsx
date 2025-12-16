'use client'

import * as React from 'react';
import Button from '@mui/material/Button';
import {aesUid, queryApp} from "@/components/server/tools/tools";
import {notFound} from "next/navigation";
import {transText} from "@/components/common/locales/normal";
import {rsaServerEncode} from "./server";

export default function RsaComponent({lang}: { lang: string }) {
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
    const appInfo = queryApp(lang, aesUid)
    if (!appInfo) {
        notFound()
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
            transText(lang, '请输入需要编码的文本', 'Please enter the text to be encoded')
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={'toolButtons'}>
            <Button variant="contained" size={'small'} onClick={encodeFunc}>
                {transText(lang, '编码', 'Encode')}
            </Button>
        </div>
        <textarea className={'targetText'} placeholder={
            transText(lang, '编码结果', 'Encoded Result')
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}
