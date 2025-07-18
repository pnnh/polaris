'use client'

import styles from "./form.module.scss";
import {generatorRandomString, STSubString} from "@/atom/common/utils/string";
import {ConsoleArticleEditor} from "@/app/[lang]/console/articles/[uid]/editor";
import {FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import {TocItem} from "@/atom/common/models/toc";
import {PSArticleModel} from "@/photon/common/models/article";
import {clientInsertArticle, clientUpdateArticle} from "@/services/client/articles/articles";
import {EmptyUUID} from "@/atom/common/utils/uuid";
import {ChannelSelector} from "@/app/[lang]/console/articles/[uid]/channel";
import {getDefaultImageUrl} from "@/services/common/note";

export function ConsoleArticleForm({portalUrl, modelString}: { portalUrl: string, modelString: string }) {
    const oldModel = JSON.parse(modelString) as PSArticleModel;
    const [lang, setLang] = React.useState(oldModel.lang);
    const [title, setTitle] = React.useState(oldModel.title);
    const [description, setDescription] = React.useState(oldModel.description);
    const [bodyText, setBodyText] = React.useState(oldModel.body || '');
    const [channel, setChannel] = React.useState(oldModel.channel || '');

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
        }
        if (isNew) {
            clientInsertArticle(portalUrl, newModel).then((newArticleId) => {
                if (!newArticleId) {
                    console.error('文章插入失败')
                    return
                }
                console.debug('文章插入成功', newArticleId)
                window.location.href = `/${lang}/console/articles`
            })
        } else {
            clientUpdateArticle(portalUrl, oldModel.uid, newModel).then((articleId) => {
                if (!articleId) {
                    console.error('文章更新失败')
                    return
                }
                console.debug('文章更新成功', articleId)
                window.location.href = `/${lang}/console/articles`
            })
        }
    }
    const coverUrl = oldModel.coverUrl || getDefaultImageUrl();
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
                        name="row-radio-buttons-group" value={lang}
                        onChange={(event) => setLang(event.target.value)}>
                <FormControlLabel value="en" control={<Radio/>} label="English" disabled={!isNew}/>
                <FormControlLabel value="zh" control={<Radio/>} label="中文" disabled={!isNew}/>
            </RadioGroup>
            <ChannelSelector channel={oldModel.channel} lang={lang} onChange={setChannel}/>
            <Button variant={'contained'} size={'small'} onClick={onSubmit}>保存</Button>
            <Button variant={'contained'} size={'small'}>创建多语言副本</Button>
        </div>
    </div>
}
