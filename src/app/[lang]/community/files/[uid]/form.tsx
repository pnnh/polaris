'use client'

import {EmptyUUID} from "@pnnh/atom";
import Button from "@mui/material/Button";
import React from "react";
import {CmFileModel} from "@/components/common/models/file";
import {transKey, transTodo} from "@/components/common/locales/normal";
import {CommunityBrowser} from "@/components/community/browser";
import {css} from "@/gen/styled/css";

export function ConsoleFileForm({stargateUrl, model, lang}: {
    stargateUrl: string,
    model: CmFileModel,
    lang: string
}) {
    const [name, setName] = React.useState(model.name || '');
    const [title, setTitle] = React.useState(model.title || '');
    const [description, setDescription] = React.useState(model.description || '');
    const [keywords, setKeywords] = React.useState(model.keywords || '');
    const [url, setUrl] = React.useState(model.url || '');
    const [mimetype, setMimetype] = React.useState(model.mimetype || '');

    const isNew = model.uid === EmptyUUID;

    const onSubmit = () => {
        const newModel = {
            uid: model.uid,
            name,
            title,
            description,
            keywords,
            url,
            mimetype,
            parent: model.parent,
        }
        if (isNew) {
            CommunityBrowser.clientConsoleInsertFile(stargateUrl, newModel).then((fileId) => {
                if (!fileId) {
                    console.error(transKey(lang, "console.file.insertFailed"))
                    return
                }
                window.location.href = `/${lang}/community/files`
            })
        } else {
            CommunityBrowser.clientConsoleUpdateFile(stargateUrl, model.uid, newModel).then((fileId) => {
                if (!fileId) {
                    console.error(transKey(lang, "console.file.updateFailed"))
                    return
                }
                window.location.href = `/${lang}/community/files`
            })
        }
    }

    return <div className={formStyles.bodyContainer}>
        <div className={formStyles.formSection}>
            <div className={formStyles.fieldGroup}>
                <label className={formStyles.fieldLabel}>
                    {transTodo("文件名称")}
                </label>
                <input
                    className={formStyles.fieldInput}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={transTodo("文件名称")}
                />
            </div>
            <div className={formStyles.fieldGroup}>
                <label className={formStyles.fieldLabel}>
                    {transKey(lang, "console.file.title")}
                </label>
                <input
                    className={formStyles.fieldInput}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder={transKey(lang, "console.file.title")}
                />
            </div>
            <div className={formStyles.fieldGroup}>
                <label className={formStyles.fieldLabel}>
                    {transKey(lang, "console.file.description")}
                </label>
                <textarea
                    className={formStyles.fieldTextarea}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder={transKey(lang, "console.file.description")}
                />
            </div>
            <div className={formStyles.fieldGroup}>
                <label className={formStyles.fieldLabel}>Keywords</label>
                <input
                    className={formStyles.fieldInput}
                    value={keywords}
                    onChange={(event) => setKeywords(event.target.value)}
                    placeholder="keywords"
                />
            </div>
            <div className={formStyles.fieldGroup}>
                <label className={formStyles.fieldLabel}>
                    {transKey(lang, "console.file.url")}
                </label>
                <input
                    className={formStyles.fieldInput}
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="https://..."
                />
            </div>
            <div className={formStyles.fieldGroup}>
                <label className={formStyles.fieldLabel}>
                    {transKey(lang, "console.file.mimetype")}
                </label>
                <input
                    className={formStyles.fieldInput}
                    value={mimetype}
                    onChange={(event) => setMimetype(event.target.value)}
                    placeholder="e.g. application/pdf"
                />
            </div>
        </div>
        <div className={formStyles.bottomBar}>
            <Button variant={'contained'} size={'small'} onClick={onSubmit}>
                {transKey(lang, "console.file.save")}
            </Button>
        </div>
    </div>
}

const formStyles = {
    bodyContainer: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    `,
    formSection: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 800px;
    `,
    fieldGroup: css`
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    `,
    fieldLabel: css`
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary-color);
    `,
    fieldInput: css`
        border: 1px solid #b4b4b4;
        border-radius: 4px;
        padding: 0.5rem;
        font-size: 0.9rem;
        width: 100%;
        box-sizing: border-box;
    `,
    fieldTextarea: css`
        border: 1px solid #b4b4b4;
        border-radius: 4px;
        padding: 0.5rem;
        font-size: 0.9rem;
        width: 100%;
        height: 6rem;
        resize: vertical;
        scrollbar-width: thin;
        box-sizing: border-box;
    `,
    bottomBar: css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        padding-top: 0.5rem;
        border-top: 1px solid var(--border-color);
    `
}
