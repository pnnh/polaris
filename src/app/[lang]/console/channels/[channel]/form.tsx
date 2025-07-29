'use client'

import styles from "./form.module.scss";
import {generatorRandomString, STSubString} from "@/atom/common/utils/string";
import {FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import {TocItem} from "@/atom/common/models/toc";
import {PSChannelModel} from "@/photon/common/models/channel";
import {clientConsoleInsertChannel, clientConsoleUpdateChannel} from "@/services/client/channels/channels";
import {EmptyUUID, isEmptyUUID} from "@/atom/common/utils/uuid";
import {getDefaultImageUrl} from "@/services/common/note";
import {localText} from "@/atom/common/language";

export function ConsoleChannelForm({portalUrl, modelString}: { portalUrl: string, modelString: string }) {
    const oldModel = JSON.parse(modelString) as PSChannelModel;
    const [lang, setLang] = React.useState(oldModel.lang);
    const [name, setName] = React.useState(oldModel.name);
    const [title, setTitle] = React.useState(oldModel.title);
    const [description, setDescription] = React.useState(oldModel.description);

    const isNew = oldModel.uid === EmptyUUID;
    const onSubmit = () => {
        const newModel = {
            uid: oldModel.uid,
            cid: oldModel.cid,
            title: title,
            description: description,
            lang: oldModel.lang,
            name: name,
        }
        if (isNew) {
            clientConsoleInsertChannel(portalUrl, newModel).then((newChannelId) => {
                if (!newChannelId) {
                    console.error(localText(lang, '频道插入失败', 'Channel insert failed'))
                    return
                }
                window.location.href = `/${lang}/console/channels`
            })
        } else {
            clientConsoleUpdateChannel(portalUrl, oldModel.uid, newModel).then((channelId) => {
                if (!channelId) {
                    console.error(localText(lang, '频道更新失败', 'Channel update failed'))
                    return
                }
                window.location.href = `/${lang}/console/channels`
            })
        }
    }
    const coverUrl = oldModel.image || getDefaultImageUrl();
    return <div className={styles.bodyContainer}>
        <div className={styles.channelCover}>
            <div className={styles.channelHeader}>
                <div>
                    <input value={name} onChange={(event) => setName(event.target.value)}/>
                </div>
                <div className={styles.channelTitle}>
                    <input value={title} onChange={(event) => setTitle(event.target.value)}/>
                </div>
                <div className={styles.channelDescription}>
                        <textarea name={'channelDescription'}
                                  value={description} onChange={(event => setDescription(event.target.value))}/>
                </div>
            </div>
            <img className={styles.coverImage} src={coverUrl} alt={oldModel.title}/>
        </div>
        <div className={styles.bottomBar}>
            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group" value={lang}
                        onChange={(event) => setLang(event.target.value)}>
                <FormControlLabel value="zh" control={<Radio/>} label="中文"/>
                <FormControlLabel value="en" control={<Radio/>} label="English"/>
            </RadioGroup>
            <Button variant={'contained'} size={'small'} onClick={onSubmit}>{
                localText(lang, '保存频道', 'Save Channel')
            }</Button>
            <Button variant={'contained'} size={'small'}>{
                localText(lang, '创建多语言副本', 'Create Multilingual Copy')
            }</Button>
        </div>
    </div>
}
