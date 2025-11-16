'use client'

import styles from './basex.module.scss'
import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import {encodeBase32String, encodeBase64String} from "@/atom/common/utils/basex";
import {useClientConfig} from "@/atom/client/config/config";
import {IBrowserConfig} from "@/components/common/config";
import {Loading} from "@/components/common/loading";
import {base64Uid, queryApp} from "@/components/server/tools/tools";
import {notFound} from "next/navigation";
import {transText} from "@/components/common/locales/normal";

export default function Base64Component({lang}: { lang: string }) {
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
    const encodeBase32 = () => {
        if (!source) {
            return;
        }
        setOutput(encodeBase32String(source));
    }
    const appInfo = queryApp(lang, base64Uid)
    if (!appInfo) {
        notFound()
    }
    return <div className={styles.basexPage}>
        <h1>{appInfo.name}</h1>
        <textarea className={styles.sourceText} placeholder={
            transText(lang, '请输入需要编码的文本', 'Please enter the text to be encoded')
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={styles.toolButtons}>
            <Button variant="contained" size={'small'} onClick={encodeBase64}>
                {transText(lang, 'Base64编码', 'Base64 Encode')}
            </Button>
        </div>
        <textarea className={styles.targetText} placeholder={
            transText(lang, '编码结果', 'Encoded Result')
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}
