'use client'

import styles from "./form.module.scss";
import {generatorRandomString, STSubString} from "@/atom/common/utils/string";
import {ConsoleArticleEditor} from "@/app/[lang]/console/articles/[uid]/editor";
import {FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import {TocItem} from "@/atom/common/models/toc";
import {PSArticleModel} from "@/photon/common/models/article";
import {clientConsoleInsertArticle, clientConsoleUpdateArticle} from "@/services/client/articles/articles";
import {EmptyUUID, isEmptyUUID} from "@/atom/common/utils/uuid";
import {getDefaultImageUrl} from "@/services/common/note";
import {tryBase58ToUuid, mustBase58ToUuid, uuidToBase58} from "@/atom/common/utils/basex";
import {isLangEn, langEn, langZh, localText} from "@/atom/common/language";
import {isUUID} from "validator";

export function ConsoleArticleForm({portalUrl, modelString, lang, copyFrom}: {
    portalUrl: string,
    modelString: string,
    lang: string, copyFrom: string
}) {
    const oldModel = JSON.parse(modelString) as PSArticleModel;
    const [wangLang, setWantLang] = React.useState(oldModel.lang);
    const [title, setTitle] = React.useState(oldModel.title);
    const [description, setDescription] = React.useState(oldModel.description);
    const [bodyText, setBodyText] = React.useState(oldModel.body || '');
    const [channel, setChannel] = React.useState(oldModel.channel);

    const tocList: TocItem[] = []
    const titleId = generatorRandomString(8)
    tocList.push({title: oldModel.title, header: 0, id: titleId})
    const isNew = oldModel.uid === EmptyUUID;
    const onSubmit = () => {
        const newModel = {
            uid: oldModel.uid,
            cid: oldModel.cid,
            title: title,
            description: description,
            body: bodyText,
            coverUrl: oldModel.coverUrl,
            header: oldModel.header,
            lang: oldModel.lang,
            channel: oldModel.channel
        }
        if (!channel || isEmptyUUID(channel)) {
            console.error(localText(lang, '频道不能为空', 'Channel cannot be empty'))
            return
        }
        if (channel.startsWith('base58:')) {
            newModel.channel = mustBase58ToUuid(channel.substring(7))
        } else if (isUUID(channel)) {
            newModel.channel = channel
        } else {
            console.error(localText(lang, '频道格式错误', 'Channel format error'))
            return;
        }
        if (isNew) {
            clientConsoleInsertArticle(portalUrl, newModel).then((newArticleId) => {
                if (!newArticleId) {
                    console.error(localText(lang, '文章插入失败', 'Article insert failed'))
                    return
                }
                window.location.href = `/${lang}/console/articles`
            })
        } else {
            clientConsoleUpdateArticle(portalUrl, oldModel.uid, newModel).then((articleId) => {
                if (!articleId) {
                    console.error(localText(lang, '文章更新失败', 'Article update failed'))
                    return
                }
                window.location.href = `/${lang}/console/articles`
            })
        }
    }
    const coverUrl = oldModel.coverUrl || getDefaultImageUrl();
    const createUrl = `/${lang}/console/articles/${uuidToBase58(oldModel.cid)}?wantLang=${isLangEn(oldModel.lang) ? langZh : langEn}&copyFrom=${uuidToBase58(oldModel.uid)}`
    return <div className={styles.bodyContainer}>
        <div className={styles.articleCover}>
            <div className={styles.articleHeader}>
                <div className={styles.articleTitle}>
                    <input value={title} onChange={(event) => setTitle(event.target.value)}/>
                </div>
                <div className={styles.articleDescription}>
                        <textarea name={'articleDescription'}
                                  value={description} onChange={(event => setDescription(event.target.value))}/>
                </div>
            </div>
            <img className={styles.coverImage} src={coverUrl} alt={oldModel.title}/>
        </div>
        <div className={styles.articleContainer}>
            <ConsoleArticleEditor tocList={tocList} header={oldModel.header}
                                  body={bodyText} assetsUrl={'assetsUrl'} portalUrl={portalUrl}
                                  onChange={(bodyText) => setBodyText(bodyText)}/>
        </div>
        <div className={styles.bottomBar}>
            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group" value={wangLang}
                        onChange={(event) => setWantLang(event.target.value)}>
                <FormControlLabel value="zh" control={<Radio/>} label="中文" disabled={!isNew || wangLang !== langZh}/>
                <FormControlLabel value="en" control={<Radio/>} label="English"
                                  disabled={!isNew || wangLang !== langEn}/>
            </RadioGroup>
            {/*<ChannelSelector channel={oldModel.channel} lang={lang} portalUrl={portalUrl} onChange={setChannel}/>*/}
            <TextField label="Outlined" variant="outlined" size={'small'} value={channel}
                       onChange={event => setChannel(event.target.value)}
                       disabled={!isNew || Boolean(copyFrom)}/>
            <Button variant={'contained'} size={'small'} onClick={onSubmit}>{
                localText(lang, '保存文章', 'Save Article')
            }</Button>
            {!isNew &&
                <Button variant={'contained'} size={'small'} href={createUrl}>{
                    localText(lang, `查看英文副本`, 'View Chinese Copy')
                }</Button>
            }
        </div>
    </div>
}
