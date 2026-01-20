'use client'

import styles from './basex.module.scss'
import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import {decodeBase64String, encodeBase64String} from "@pnnh/atom";
import {IBrowserConfig} from "@/components/common/config";
import {Loading} from "@/components/common/loading";
import {transText} from "@/components/common/locales/normal";
import {useClientConfig} from "@/components/client/config/config";
import {ApplicationWithText} from "@/components/common/models/application";

export default function Base64Component({lang, appInfo}: { lang: string, appInfo: ApplicationWithText }) {
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
    return <div className={styles.basexPage}>
        <h1>{appInfo.name}</h1>
        <textarea className={styles.sourceText} placeholder={
            transText(lang, '请输入需要编码的文本', 'Please enter the text to be encoded')
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={styles.toolButtons}>
            <Button variant="contained" size={'small'} onClick={encodeBase64}>
                {transText(lang, 'Base64编码', 'Encode Base64')}
            </Button>
            <Button variant="contained" size={'small'} onClick={decodeBase64}>
                {transText(lang, 'Base64解码', 'Decode Base64')}
            </Button>
        </div>
        <textarea className={styles.targetText} placeholder={
            transText(lang, '编码结果', 'Encoded Result')
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}
