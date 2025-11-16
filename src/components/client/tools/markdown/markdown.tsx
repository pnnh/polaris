'use client'

import * as React from 'react';
import {useEffect} from 'react';
import styles from './markdown.module.scss'
import Button from '@mui/material/Button';
import {useClientConfig} from "@/atom/client/config/config";
import {IBrowserConfig} from "@/components/common/config";
import {Loading} from "@/components/common/loading";
import {markdownUid, queryApp} from "@/components/server/tools/tools";
import {markdownStringToHtml} from "@/components/server/markdown/markdown";
import {notFound} from "next/navigation";
import {transText} from "@/components/common/locales/normal";

export default function MarkdownComponent({lang}: { lang: string }) {
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

    const encodeMarkdown = () => {
        if (!source) {
            return;
        }
        const outHtml = markdownStringToHtml(source);
        setOutput(outHtml);
    }
    const appInfo = queryApp(lang, markdownUid)
    if (!appInfo) {
        notFound()
    }
    return <div className={styles.markdownComponent}>
        <h1>{appInfo.name}</h1>
        <textarea className={styles.sourceText} placeholder={
            transText(lang, '请输入Markdown文本', 'Please enter Markdown text')
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={styles.toolButtons}>
            <Button variant="contained" size={'small'} onClick={encodeMarkdown}>
                {transText(lang, 'Markdown 预览', 'Markdown Preview')}
            </Button>
        </div>
        <textarea className={styles.targetText} placeholder={
            transText(lang, 'Markdown 预览结果', 'Markdown Preview Result')
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}
