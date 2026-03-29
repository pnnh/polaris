'use client'

import { EmptyUUID, generatorRandomString, isLangEn, langEn, langZh, TocItem, uuidToBase58 } from "@pnnh/atom";
import { ConsoleArticleEditor } from "./editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { PSArticleModel } from "@/components/common/models/article";
import { getDefaultImageUrl } from "@/components/common/note";
import { supportedLanguages } from "@/components/common/language";
import { transKey } from "@/components/common/locales/normal";
import { PersonalNotesBrowser } from "@/components/personal/notes";
import { CommunityBrowser } from "@/components/community/browser";
import { PSChannelModel } from "@/components/common/models/channel";
import { Save, Copy, Languages, Upload } from 'lucide-react';

function PSConsoleLanguageSelector({ lang, onChange }: { lang: string, onChange: (newLang: string) => void }) {
    return (
        <div className="flex items-center gap-1">
            <Languages size={16} className="text-muted-foreground" />
            <select
                value={lang}
                onChange={(event) => onChange(event.target.value)}
                className="h-8 rounded border px-2 text-sm min-w-[140px]"
            >
                {supportedLanguages.map(language => (
                    <option key={language.key} value={language.key}>{language.name}</option>
                ))}
            </select>
        </div>
    )
}

export function ConsoleArticleForm({ stargateUrl, modelString, channelsString, lang }: {
    stargateUrl: string,
    modelString: string,
    channelsString: string,
    lang: string,
}) {
    const oldModel = JSON.parse(modelString) as PSArticleModel;
    const channels = JSON.parse(channelsString) as PSChannelModel[];
    const [wangLang, setWantLang] = React.useState(oldModel.lang);
    const [title, setTitle] = React.useState(oldModel.title);
    const [description, setDescription] = React.useState(oldModel.description);
    const [bodyText, setBodyText] = React.useState(oldModel.body || '');
    const [selectedChannel, setSelectedChannel] = React.useState('');

    const tocList: TocItem[] = []
    const titleId = generatorRandomString(8)
    tocList.push({ title: oldModel.title, header: 0, id: titleId })
    const isNew = oldModel.uid === EmptyUUID;

    const onSubmit = () => {
        const newModel = {
            uid: oldModel.uid,
            title: title,
            description: description,
            body: bodyText,
            coverUrl: oldModel.coverUrl,
            header: oldModel.header,
            lang: wangLang,
            channel: oldModel.channel
        }
        if (isNew) {
            PersonalNotesBrowser.clientConsoleInsertNote(stargateUrl, newModel).then((newNoteId) => {
                if (!newNoteId) {
                    console.error(transKey(lang, 'console.note.insertFailed'))
                    return
                }
                window.location.href = `/${lang}/console/personal/notes`
            })
        } else {
            PersonalNotesBrowser.clientConsoleUpdateNote(stargateUrl, oldModel.uid, newModel).then((noteId) => {
                if (!noteId) {
                    console.error(transKey(lang, 'console.note.updateFailed'))
                    return
                }
                window.location.href = `/${lang}/console/personal/notes`
            })
        }
    }

    const onPublish = () => {
        if (!selectedChannel) {
            alert(transKey(lang, "console.note.selectChannelFirst"));
            return;
        }
        const articleModel = {
            uid: oldModel.uid,
            title: title,
            description: description,
            body: bodyText,
            cover: oldModel.cover,
            header: oldModel.header,
            lang: wangLang,
            channel: selectedChannel
        }
        CommunityBrowser.clientConsoleInsertArticle(stargateUrl, articleModel).then((articleId) => {
            if (!articleId) {
                alert(transKey(lang, "console.note.publishFailed"));
                return;
            }
            alert(transKey(lang, "console.note.publishSuccess"));
            window.location.href = `/${lang}/console/personal/notes`;
        });
    }

    const coverUrl = oldModel.coverUrl || getDefaultImageUrl();
    const createUrl = `/${lang}/console/personal/notes/${uuidToBase58(EmptyUUID)}?wantLang=${isLangEn(wangLang) ? langZh : langEn}&copyFrom=${uuidToBase58(oldModel.uid)}`

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Card */}
                <div className="rounded-lg border shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium"
                                        style={{ borderColor: isNew ? '#22c55e' : '#3b82f6', color: isNew ? '#16a34a' : '#2563eb' }}>
                                        {isNew ? transKey(lang, 'console.note.createNew') : transKey(lang, 'console.note.edit')}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium">
                                        {wangLang.toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">{transKey(lang, 'console.note.title')}</label>
                                    <Input
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        placeholder={transKey(lang, 'console.note.titlePlaceholder')}
                                        className="text-xl font-semibold"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">{transKey(lang, 'console.note.description')}</label>
                                    <textarea
                                        rows={3}
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                        placeholder={transKey(lang, 'console.note.descriptionPlaceholder')}
                                        className="w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="md:w-64 relative">
                            <img
                                src={coverUrl}
                                alt={title || 'Note cover'}
                                className="w-full h-full object-cover"
                                style={{ minHeight: 250 }}
                            />
                            <div className="absolute top-2 right-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Change cover"
                                    className="bg-white/90 hover:bg-white"
                                >
                                    <Copy size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor Card */}
                <div className="rounded-lg border shadow-sm overflow-hidden">
                    <ConsoleArticleEditor
                        tocList={tocList}
                        header={oldModel.header}
                        body={bodyText}
                        assetsUrl={'assetsUrl'}
                        onChange={(bodyText) => setBodyText(bodyText)}
                    />
                </div>

                {/* Action Bar */}
                <div className="rounded-lg border shadow-sm p-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <PSConsoleLanguageSelector lang={wangLang} onChange={setWantLang} />
                        </div>

                        <div className="flex items-center gap-2">
                            {!isNew && (
                                <Button variant="outline" asChild>
                                    <a href={createUrl}>
                                        <Copy size={16} />
                                        {transKey(lang, 'console.note.viewCopy')}
                                    </a>
                                </Button>
                            )}
                            <Button onClick={onSubmit}>
                                <Save size={16} />
                                {transKey(lang, 'console.note.save')}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Publish to Channel (Only for existing notes) */}
                {!isNew && (
                    <div className="rounded-lg border shadow-sm p-4">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Upload size={20} />
                                <span className="font-semibold text-lg">
                                    {transKey(lang, 'console.note.publishToChannel')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedChannel}
                                    onChange={(event) => setSelectedChannel(event.target.value)}
                                    className="h-9 rounded border px-2 text-sm min-w-[300px]"
                                >
                                    <option value="" disabled>
                                        {transKey(lang, "console.note.selectChannel")}
                                    </option>
                                    {channels.map(channel => (
                                        <option key={channel.uid} value={channel.uid}>{channel.name}</option>
                                    ))}
                                </select>
                                <Button onClick={onPublish} disabled={!selectedChannel}>
                                    <Upload size={16} />
                                    {transKey(lang, 'console.note.publish')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}



