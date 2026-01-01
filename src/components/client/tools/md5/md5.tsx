'use client'

import * as React from 'react';
import {useEffect} from 'react';
import styles from './md5.module.scss'
import Button from '@mui/material/Button';
import {useClientConfig} from "@/components/client/config/config";
import {IBrowserConfig} from "@/components/common/config";
import {Loading} from "@/components/common/loading";
import {md5Uid, queryApp} from "@/components/server/tools/tools";
import {stringToMd5} from "@pnnh/atom";
import {notFound} from "next/navigation";
import {transText} from "@/components/common/locales/normal";

export default function Md5Component({lang}: { lang: string }) {
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

    const encodeMd5 = () => {
        if (!source) {
            return;
        }
        setOutput(stringToMd5(source));
    }
    const appInfo = queryApp(lang, md5Uid)
    if (!appInfo) {
        notFound()
    }
    return <div className={styles.md5Page}>
        <h1>{appInfo.name}</h1>
        <textarea className={styles.sourceText} placeholder={
            transText(lang, '请输入需要编码的文本', 'Please enter the text to be encoded')
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={styles.toolButtons}>
            <Button variant="contained" size={'small'} onClick={encodeMd5}>
                {transText(lang, 'Md5编码', 'Md5 Encode')}
            </Button>
        </div>
        <textarea className={styles.targetText} placeholder={
            transText(lang, '编码结果', 'Encoded Result')
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}
