'use client'

import * as React from 'react';
import {useEffect} from 'react';
import styles from './base32.module.scss'
import Button from '@mui/material/Button';
import {decodeBase32String, encodeBase32String} from "@pnnh/atom";
import {IBrowserConfig} from "@/components/common/config";
import {Loading} from "@/components/common/loading";
import {transText} from "@/components/common/locales/normal";
import {useClientConfig} from "@/components/client/config/config";
import {ApplicationWithText} from "@/components/common/models/application";

export default function Base32Component({lang, appInfo}: { lang: string, appInfo: ApplicationWithText }) {
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
    return <div className={styles.base32Page}>
        <h1>{appInfo.name}</h1>
        <textarea className={styles.sourceText} placeholder={
            transText(lang, '请输入需要编码的文本', 'Please enter the text to be encoded')
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={styles.toolButtons}>
            <Button variant="contained" size={'small'} onClick={encodeBase32}>
                {transText(lang, 'Base32编码', 'Base32 Encode')}
            </Button>
            <Button variant="contained" size={'small'} onClick={decodeBase32}>
                {transText(lang, 'Base32解码', 'Base32 Decode')}
            </Button>
        </div>
        <textarea className={styles.targetText} placeholder={
            transText(lang, '编码结果', 'Encoded Result')
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}
