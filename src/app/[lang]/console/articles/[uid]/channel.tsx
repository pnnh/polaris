'use client';

import {TextField} from "@mui/material";
import React, {useEffect} from "react";
import {clientChannelsComplete} from "@/services/client/channels/channels";
import {useClientConfig} from "@/services/client/config";
import styles from './channel.module.scss';

export function ChannelSelector({channel, lang, onChange}: {
    channel: string,
    lang: string,
    onChange: (channel: string) => void
}) {
    const clientConfig = useClientConfig()
    const [channelKeyword, setChannelKeyword] = React.useState<string>(channel);
    const [channelName, setChannelName] = React.useState<string>('无效频道');
    const doComplete = (keyword: string) => {
        setChannelKeyword(keyword);
        if (!keyword || keyword.trim().length < 3) {
            setChannelName('无效频道');
            return;
        }
        const selectQuery: Record<string, any> = {
            lang: lang,
            keyword: keyword,
        }
        clientChannelsComplete(clientConfig.PUBLIC_PORTAL_URL, selectQuery).then((selectResult) => {
            if (!selectResult || !selectResult.range || selectResult.range.length === 0) {
                console.warn('频道查询结果为空', selectResult);
                return;
            }
            const firstChannel = selectResult.range[0];
            if (firstChannel.match === 'exact') {
                setChannelName(firstChannel.name)
                onChange(firstChannel.uid);
            }
        })
    }
    useEffect(() => {
        doComplete(channel)
    }, [channel]);
    return <div className={styles.channelSelector}>
        <TextField label="Outlined" variant="outlined" size={'small'} value={channelKeyword}
                   onChange={(event) => doComplete(event.target.value)}/>
        <span>{channelName}</span>
    </div>
}
