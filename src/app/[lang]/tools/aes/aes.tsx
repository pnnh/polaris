'use client'

import * as React from 'react';
import Button from '@mui/material/Button';
import {aesUid, queryApp} from "@/components/server/tools/tools";
import {notFound} from "next/navigation";
import {transKey, transText} from "@/components/common/locales/normal";
import {aesServerDecode, aesServerEncode, aesServerGenerateKey} from "@/app/[lang]/tools/aes/server";
import {IconButton, TextField} from "@mui/material";
import ImportExportIcon from '@mui/icons-material/ImportExport';

export default function AesComponent({lang}: { lang: string }) {
    const [source, setSource] = React.useState('');
    const [output, setOutput] = React.useState('');
    const [aesKey, setAesKey] = React.useState('')

    const encodeFunc = () => {
        if (!source || !aesKey) {
            return;
        }
        aesServerEncode(source, aesKey).then((encodedText) => {
            setOutput(encodedText);
        });
    }
    const decodeFunc = () => {
        if (!source || !aesKey) {
            return;
        }
        aesServerDecode(source, aesKey).then((decodedText) => {
            setOutput(decodedText);
        })
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

                .toolTitle {
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 8px;
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
                    justify-content: flex-start;
                    align-items: center;
                    gap: 16px;
                    flex-shrink: 0;
                    width: 100%;
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

            }
        `}</style>
        <h1 className={'toolTitle'}>{appInfo.name}</h1>
        <textarea className={'sourceText'} placeholder={
            transText(lang, '请输入需要编码的文本', 'Please enter the text to be encoded')
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={'toolButtons'}>
            <TextField id={'AesKeyInput'} maxRows={1} sx={{width: 400}} variant={'outlined'} size={'small'}
                       value={aesKey} slotProps={{htmlInput: {maxLength: 64}}}
                       placeholder={transKey(lang, 'tools.aes.keyPlaceholder')}
                       onChange={(event) => setAesKey(event.target.value)}/>
            <Button variant={'contained'} size={'small'}
                    onClick={() => {
                        aesServerGenerateKey().then((newKey) => setAesKey(newKey))
                    }}>{transKey(lang, 'tools.aes.randomKey')}</Button>
            <Button variant="contained" size={'small'} onClick={encodeFunc}>
                {transKey(lang, 'tools.aes.encode')}
            </Button>
            <Button variant="contained" size={'small'} onClick={decodeFunc}>
                {transKey(lang, 'tools.aes.decode')}
            </Button>
            <IconButton size={'small'} onClick={() => {
                const currentSource = source;
                setSource(output);
                setOutput(currentSource);
            }}>
                <ImportExportIcon/>
            </IconButton>
        </div>
        <textarea className={'targetText'} placeholder={
            transText(lang, '编码结果', 'Encoded Result')
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}
