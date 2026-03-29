'use client'

import {EmptyUUID, generatorRandomString, TocItem} from "@pnnh/atom";
import {ConsoleArticleEditor} from "./editor";
import {Button} from "@/components/ui/button";
import React from "react";
import {getDefaultImageUrl, PSFileModel} from "@/components/common/models/file";
import {PSChannelModel} from "@/components/common/models/channel";
import {supportedLanguages} from "@/components/common/language";
import {transKey} from "@/components/common/locales/normal";
import {CommunityBrowser} from "@/components/community/browser";
import {css} from "@/gen/styled/css";

function PSConsoleLanguageSelector({lang, onChange}: { lang: string, onChange: (newLang: string) => void }) {
    return (
        <select
            value={lang}
            onChange={(event) => onChange(event.target.value)}
            className="h-8 rounded border px-2 text-sm min-w-[140px]"
        >
            {supportedLanguages.map(language => (
                <option key={language.key} value={language.key}>{language.name}</option>
            ))}
        </select>
    )
}

function PSConsoleChannelSelector({channelUid, channels, onChange, lang}: {
    channelUid: string,
    channels: PSChannelModel[],
    onChange: (newChannel: string) => void,
    lang: string
}) {
    return (
        <select
            value={channelUid}
            onChange={(event) => onChange(event.target.value)}
            className="h-8 rounded border px-2 text-sm min-w-[180px]"
        >
            <option value="" disabled>{transKey(lang, "console.article.selectChannel")}</option>
            {channels.map(channel => (
                <option key={channel.uid} value={channel.uid}>{channel.name}</option>
            ))}
        </select>
    )
}

export function ConsoleArticleForm({stargateUrl, modelString, channelsString, lang}: {
    stargateUrl: string,
    modelString: string,
    channelsString: string,
    lang: string
}) {
    const oldModel = JSON.parse(modelString) as PSFileModel;
    const channels = JSON.parse(channelsString) as PSChannelModel[];
    const [wangLang, setWantLang] = React.useState(oldModel.lang);
    const [title, setTitle] = React.useState(oldModel.title);
    const [description, setDescription] = React.useState(oldModel.description);
    const [bodyText, setBodyText] = React.useState(oldModel.body || '');
    const [selectedChannel, setSelectedChannel] = React.useState(oldModel.channel || '');

    const tocList: TocItem[] = []
    const titleId = generatorRandomString(8)
    tocList.push({title: oldModel.title, header: 0, id: titleId})

    const isNew = oldModel.uid === EmptyUUID;
    const onSubmit = () => {
        if (!selectedChannel) {
            alert(transKey(lang, "console.article.channelRequired"));
            return;
        }
        const newModel = {
            uid: oldModel.uid,
            title: title,
            description: description,
            body: bodyText,
            cover: oldModel.cover,
            header: oldModel.header,
            lang: wangLang,
            channel: selectedChannel
        }
        if (isNew) {
            CommunityBrowser.clientConsoleInsertArticle(stargateUrl, newModel).then((articleId) => {
                if (!articleId) {
                    console.error(transKey(lang, "console.article.insertFailed"))
                    return
                }
                window.location.href = `/${lang}/community/articles`
            })
        } else {
            CommunityBrowser.clientConsoleUpdateArticle(stargateUrl, oldModel.uid, newModel).then((articleId) => {
                if (!articleId) {
                    console.error(transKey(lang, "console.article.updateFailed"))
                    return
                }
                window.location.href = `/${lang}/community/articles`
            })
        }
    }
    const coverUrl = oldModel.coverUrl || getDefaultImageUrl();
    return <div className={formStyles.bodyContainer}>
        <div className={formStyles.articleCover}>
            <div className={formStyles.articleHeader}>
                <div className={formStyles.articleTitle}>
                    <input value={title} onChange={(event) => setTitle(event.target.value)}/>
                </div>
                <div className={formStyles.articleDescription}>
                    <textarea name={'articleDescription'}
                              value={description} onChange={(event => setDescription(event.target.value))}/>
                </div>
            </div>
            <img className={formStyles.coverImage} src={coverUrl} alt={oldModel.title}/>
        </div>
        <div className={formStyles.articleContainer}>
            <ConsoleArticleEditor tocList={tocList} header={oldModel.header}
                                  body={bodyText} assetsUrl={'assetsUrl'} portalUrl={stargateUrl}
                                  onChange={(bodyText) => setBodyText(bodyText)}/>
        </div>
        <div className={formStyles.bottomBar}>
            <PSConsoleChannelSelector channelUid={selectedChannel} channels={channels} onChange={setSelectedChannel}
                                      lang={lang}/>
            <PSConsoleLanguageSelector lang={wangLang} onChange={setWantLang}/>
            <Button size={'sm'} onClick={onSubmit}>{
                transKey(lang, "console.article.save")
            }</Button>
        </div>
    </div>
}

const formStyles = {
    bodyContainer: css`
        overflow: hidden;
    `,
    articleCover: css`
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
    articleHeader: css`
        flex-grow: 1;
        position: relative;
        z-index: 1;
        border-radius: 4px;
        overflow: hidden;
    `,
    articleTitle: css`
        font-weight: 600;
        font-size: 20px;
        margin-bottom: 16px;
        padding-left: 1rem;

        & input {
            width: calc(100% - 3rem);
            border-color: #b4b4b4;
            border-radius: 4px;
            border-width: 1px;
            padding: 0.5rem;
        }
    `,
    articleDescription: css`
        font-size: 1rem;
        color: var(--text-primary-color);
        padding-left: 1rem;
        border: solid 1px #b4b4b4;
        border-radius: 4px;

        & textarea {
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
    articleContainer: css`
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
    `
}
