'use client'

import styles from "./form.module.scss";
import {generatorRandomString} from "@/atom/common/utils/string";
import {ConsoleArticleEditor} from "./editor";
import Button from "@mui/material/Button";
import React from "react";
import {TocItem} from "@/atom/common/models/toc";
import {PSArticleModel} from "@/components/common/models/article";
import {clientConsoleInsertArticle, clientConsoleUpdateArticle} from "@/components/client/articles/articles";
import {EmptyUUID} from "@/atom/common/utils/uuid";
import {getDefaultImageUrl} from "@/components/common/note";
import {uuidToBase58} from "@/atom/common/utils/basex";
import {isLangEn, langEn, langZh} from "@/atom/common/language";
import MenuItem from '@mui/material/MenuItem';
import {supportedLanguages} from "@/components/common/language";
import {Select} from "@mui/material";
import {transText} from "@/components/common/locales/normal";

function PSConsoleLanguageSelector({lang, onChange}: { lang: string, onChange: (newLang: string) => void }) {
    return <>
        <Select
            value={lang}
            size={'small'}
            label="Language"
            onChange={(event) => onChange(event.target.value)}
        >
            {
                supportedLanguages.map(language => (
                    <MenuItem key={language.key} value={language.key}
                              selected={lang === language.key} disableRipple>
                        {language.name}
                    </MenuItem>
                ))
            }
        </Select>
    </>
}

export function ConsoleArticleForm({portalUrl, modelString, lang}: {
    portalUrl: string,
    modelString: string,
    lang: string,
}) {
    const oldModel = JSON.parse(modelString) as PSArticleModel;
    const [wangLang, setWantLang] = React.useState(oldModel.lang);
    const [title, setTitle] = React.useState(oldModel.title);
    const [description, setDescription] = React.useState(oldModel.description);
    const [bodyText, setBodyText] = React.useState(oldModel.body || '');

    const tocList: TocItem[] = []
    const titleId = generatorRandomString(8)
    tocList.push({title: oldModel.title, header: 0, id: titleId})
    const isNew = oldModel.uid === EmptyUUID;

    const onSubmit = () => {
        const newModel = {
            uid: oldModel.uid,
            title: title,
            description: description,
            body: bodyText,
            coverUrl: oldModel.coverUrl,
            header: oldModel.header,
            lang: oldModel.lang,
            channel: oldModel.channel
        }
        if (isNew) {
            clientConsoleInsertArticle(portalUrl, newModel).then((newArticleId) => {
                if (!newArticleId) {
                    console.error(transText(lang, '文章插入失败', 'Article insert failed'))
                    return
                }
                window.location.href = `/${lang}/console/articles`
            })
        } else {
            clientConsoleUpdateArticle(portalUrl, oldModel.uid, newModel).then((articleId) => {
                if (!articleId) {
                    console.error(transText(lang, '文章更新失败', 'Article update failed'))
                    return
                }
                window.location.href = `/${lang}/console/articles`
            })
        }
    }
    const coverUrl = oldModel.coverUrl || getDefaultImageUrl();
    const createUrl = `/${lang}/console/articles/${uuidToBase58(oldModel.uid)}?wantLang=${isLangEn(oldModel.lang) ? langZh : langEn}&copyFrom=${uuidToBase58(oldModel.uid)}`
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
            <PSConsoleLanguageSelector lang={wangLang} onChange={setWantLang}/>
            <Button variant={'contained'} size={'small'} onClick={onSubmit}>{
                transText(lang, '保存文章', 'Save Article')
            }</Button>
            {!isNew &&
                <Button variant={'contained'} size={'small'} href={createUrl}>{
                    transText(lang, `查看英文副本`, 'View Chinese Copy')
                }</Button>
            }
        </div>
    </div>
}
