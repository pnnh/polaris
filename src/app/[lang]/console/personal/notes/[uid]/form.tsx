'use client'

import {generatorRandomString} from "@pnnh/atom";
import {ConsoleArticleEditor} from "./editor";
import Button from "@mui/material/Button";
import React from "react";
import {TocItem} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {EmptyUUID} from "@pnnh/atom";
import {getDefaultImageUrl} from "@/components/common/note";
import {uuidToBase58} from "@pnnh/atom";
import {isLangEn, langEn, langZh} from "@pnnh/atom";
import MenuItem from '@mui/material/MenuItem';
import {supportedLanguages} from "@/components/common/language";
import {Select} from "@mui/material";
import {transText} from "@/components/common/locales/normal";
import {PersonalBrowser} from "@/components/personal/browser";

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
            PersonalBrowser.clientConsoleInsertArticle(portalUrl, newModel).then((newArticleId) => {
                if (!newArticleId) {
                    console.error(transText(lang, '文章插入失败', 'Article insert failed'))
                    return
                }
                window.location.href = `/${lang}/console/articles`
            })
        } else {
            PersonalBrowser.clientConsoleUpdateArticle(portalUrl, oldModel.uid, newModel).then((articleId) => {
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
    return <div className="bodyContainer">
        <div className="articleCover">
            <div className="articleHeader">
                <div className="articleTitle">
                    <input value={title} onChange={(event) => setTitle(event.target.value)}/>
                </div>
                <div className="articleDescription">
                        <textarea name={'articleDescription'}
                                  value={description} onChange={(event => setDescription(event.target.value))}/>
                </div>
            </div>
            <img className="coverImage" src={coverUrl} alt={oldModel.title}/>
        </div>
        <div className="articleContainer">
            <ConsoleArticleEditor tocList={tocList} header={oldModel.header}
                                  body={bodyText} assetsUrl={'assetsUrl'} portalUrl={portalUrl}
                                  onChange={(bodyText) => setBodyText(bodyText)}/>
        </div>
        <div className="bottomBar">
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
        <style jsx>{`
          .bodyContainer {
            overflow: hidden;
          }
          .articleCover {
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
          }
          .articleHeader {
            flex-grow: 1;
            position: relative;
            z-index: 1;
            border-radius: 4px;
            overflow: hidden;
          }
          .articleTitle {
            font-weight: 600;
            font-size: 20px;
            margin-bottom: 16px;
            padding-left: 1rem;
          }
          .articleTitle input {
            width: calc(100% - 3rem);
            border-color: #b4b4b4;
            border-radius: 4px;
            border-width: 1px;
            padding: 0.5rem;
          }
          .articleDescription {
            font-size: 1rem;
            color: var(--text-primary-color);
            padding-left: 1rem;
            border: solid 1px #b4b4b4;
            border-radius: 4px;
          }
          .articleDescription textarea {
            resize: none;
            width: calc(100% - 3rem);
            height: 5rem;
            border-color: #b4b4b4;
            border-radius: 4px;
            padding: 0.5rem;
            scrollbar-width: thin;
          }
          .coverImage {
            width: 8rem;
            height: 8rem;
            flex-shrink: 0;
            object-fit: cover;
            top: 0;
            z-index: 0;
            margin-right: 1rem;
          }
          .articleContainer {
            display: flex;
            flex-direction: row;
            margin-top: 1rem;
            margin-bottom: 2rem;
            width: calc(100vw - 16rem - 2rem);
            height: calc(100vh - 12rem - 4rem - 6rem);
            gap: 1rem;
            background: var(--background-color);
            padding: 1rem;
          }
          .bottomBar {
            height: 4rem;
            width: 100vw;
            background: var(--background-color);
            display: flex;
            flex-direction: row;
            justify-items: center;
            align-items: center;
            gap: 1rem;
            padding-left: 1rem;
          }
          @media screen and (min-width: 80rem) {
            .articleContainer {
              width: 80vw;
              margin: 1rem auto 0 auto;
            }
            .bottomBar {
              width: 80vw;
              margin: 1rem auto 0 auto;
            }
          }
        `}</style>
    </div>
}
