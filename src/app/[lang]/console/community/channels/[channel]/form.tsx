import {FormControlLabel, Radio, RadioGroup} from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import {PSChannelModel} from "@/components/common/models/channel";
import {clientConsoleInsertChannel, clientConsoleUpdateChannel} from "@/components/client/channels/channels";
import {EmptyUUID} from "@/atom/common/utils/uuid";
import {getDefaultImageUrl} from "@/components/common/note";
import {transText} from "@/components/common/locales/normal";
// src/app/[lang]/console/community/channels/[channel]/form.styles.ts
import {css} from '@emotion/css';

export const styles = {
    bodyContainer: css`
    overflow: hidden;
  `,
    channelCover: css`
    width: calc(100vw - 16rem);
    height: 12rem;
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    background: var(--background-color);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
    channelHeader: css`
    flex-grow: 1;
    position: relative;
    z-index: 1;
    border-radius: 4px;
    overflow: hidden;
  `,
    channelTitle: css`
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 16px;
    padding-left: 1rem;
    input {
      width: calc(100% - 3rem);
      border-color: #b4b4b4;
      border-radius: 4px;
      border-width: 1px;
      padding: 0.5rem;
    }
  `,
    channelDescription: css`
    font-size: 1rem;
    color: var(--text-primary-color);
    padding-left: 1rem;
    textarea {
      resize: none;
      width: calc(100% - 3rem);
      height: 5rem;
      border-color: #b4b4b4;
      border-radius: 4px;
      padding: 0.5rem;
      scrollbar-width: thin;
    }
  `,
    coverImage: css`
    width: 8rem;
    height: 8rem;
    flex-shrink: 0;
    object-fit: cover;
    top: 0;
    z-index: 0;
    margin-right: 1rem;
  `,
    channelContainer: css`
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    margin-bottom: 2rem;
    width: calc(100vw - 16rem - 2rem);
    height: calc(100vh - 12rem - 4rem - 6rem);
    gap: 1rem;
    background: var(--background-color);
    padding: 1rem;
    @media screen and (min-width: 80rem) {
      width: 80vw;
      margin: 1rem auto 0 auto;
    }
  `,
    bottomBar: css`
    height: 4rem;
    width: 100vw;
    background: var(--background-color);
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    gap: 1rem;
    padding-left: 1rem;
    @media screen and (min-width: 80rem) {
      width: 80vw;
      margin: 1rem auto 0 auto;
    }
  `,
};

export function ConsoleChannelForm({publicPortalUrl, modelString}: { publicPortalUrl: string, modelString: string }) {
    const oldModel = JSON.parse(modelString) as PSChannelModel;
    const [lang, setLang] = React.useState(oldModel.lang);
    const [name, setName] = React.useState(oldModel.name);
    const [title, setTitle] = React.useState(oldModel.title);
    const [description, setDescription] = React.useState(oldModel.description);

    const isNew = oldModel.uid === EmptyUUID;
    const onSubmit = () => {
        const newModel = {
            uid: oldModel.uid,
            title: title,
            description: description,
            lang: oldModel.lang,
            name: name,
        }
        if (isNew) {
            clientConsoleInsertChannel(publicPortalUrl, newModel).then((newChannelId) => {
                if (!newChannelId) {
                    console.error(transText(lang, '频道插入失败', 'Channel insert failed'))
                    return
                }
                window.location.href = `/${lang}/console/channels`
            })
        } else {
            clientConsoleUpdateChannel(publicPortalUrl, oldModel.uid, newModel).then((channelId) => {
                if (!channelId) {
                    console.error(transText(lang, '频道更新失败', 'Channel update failed'))
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
                transText(lang, '保存频道', 'Save Channel')
            }</Button>
            <Button variant={'contained'} size={'small'}>{
                transText(lang, '创建多语言副本', 'Create Multilingual Copy')
            }</Button>
        </div>
    </div>
}
