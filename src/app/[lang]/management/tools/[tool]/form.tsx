'use client'

import React from "react";
import { Button } from "@/components/ui/button";
import {PSToolModel} from "@/components/common/models/tool";
import {clientManagementInsertTool, clientManagementUpdateTool} from "@/components/client/tools/tools";
import {EmptyUUID} from "@pnnh/atom";
import {css} from "@/gen/styled/css";

export function ManagementToolForm({stargateUrl, lang, modelString}: {
    stargateUrl: string,
    lang: string,
    modelString: string
}) {
    const oldModel = JSON.parse(modelString) as PSToolModel;
    const isNew = oldModel.uid === EmptyUUID;

    const [title, setTitle] = React.useState(oldModel.title || '');
    const [name, setName] = React.useState(oldModel.name || '');
    const [keywords, setKeywords] = React.useState(oldModel.keywords || '');
    const [description, setDescription] = React.useState(oldModel.description || '');
    const [status, setStatus] = React.useState(oldModel.status ?? 0);
    const [cover, setCover] = React.useState(oldModel.cover || '');
    const [url, setUrl] = React.useState(oldModel.url || '');
    const [version, setVersion] = React.useState(oldModel.version || '');
    const [toolLang, setToolLang] = React.useState(oldModel.lang || '');

    const onSubmit = () => {
        const model = {uid: oldModel.uid, title, name, keywords, description, status, cover, url, version, lang: toolLang}
        if (isNew) {
            clientManagementInsertTool(stargateUrl, model).then((newUid) => {
                if (!newUid) {
                    console.error('工具创建失败')
                    return
                }
                window.location.href = `/${lang}/management/tools`
            })
        } else {
            clientManagementUpdateTool(stargateUrl, oldModel.uid, model).then((uid) => {
                if (!uid) {
                    console.error('工具更新失败')
                    return
                }
                window.location.href = `/${lang}/management/tools`
            })
        }
    }

    return <div className={formStyles.container}>
        <div className={formStyles.title}>
            {isNew ? '新建工具' : '编辑工具'}
        </div>
        <div className={formStyles.form}>
            <div className={formStyles.field}>
                <label className={formStyles.label}>标题 *</label>
                <input className={formStyles.input} placeholder="工具标题" value={title}
                       onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className={formStyles.field}>
                <label className={formStyles.label}>名称</label>
                <input className={formStyles.input} placeholder="工具名称（英文）" value={name}
                       onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className={formStyles.field}>
                <label className={formStyles.label}>URL</label>
                <input className={formStyles.input} placeholder="工具链接" value={url}
                       onChange={(e) => setUrl(e.target.value)}/>
            </div>
            <div className={formStyles.field}>
                <label className={formStyles.label}>版本</label>
                <input className={formStyles.input} placeholder="版本号" value={version}
                       onChange={(e) => setVersion(e.target.value)}/>
            </div>
            <div className={formStyles.field}>
                <label className={formStyles.label}>语言</label>
                <input className={formStyles.input} placeholder="语言标签（如 zh、en）" value={toolLang}
                       onChange={(e) => setToolLang(e.target.value)}/>
            </div>
            <div className={formStyles.field}>
                <label className={formStyles.label}>关键词</label>
                <input className={formStyles.input} placeholder="关键词，逗号分隔" value={keywords}
                       onChange={(e) => setKeywords(e.target.value)}/>
            </div>
            <div className={formStyles.field}>
                <label className={formStyles.label}>封面图</label>
                <input className={formStyles.input} placeholder="封面图 URL" value={cover}
                       onChange={(e) => setCover(e.target.value)}/>
            </div>
            <div className={formStyles.field}>
                <label className={formStyles.label}>描述</label>
                <textarea className={formStyles.textarea} placeholder="工具描述" value={description}
                          onChange={(e) => setDescription(e.target.value)}/>
            </div>
            <div className={formStyles.field}>
                <label className={formStyles.label}>状态</label>
                <select className={formStyles.input} value={status}
                        onChange={(e) => setStatus(Number(e.target.value))}>
                    <option value={0}>禁用</option>
                    <option value={1}>启用</option>
                </select>
            </div>
        </div>
        <div className={formStyles.bottomBar}>
            <Button size={'sm'} onClick={onSubmit}>
                保存
            </Button>
            <Button variant={'outline'} size={'sm'}
                    onClick={() => window.location.href = `/${lang}/management/tools`}>
                取消
            </Button>
        </div>
    </div>
}

const formStyles = {
    container: css`
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 720px;
        margin: 0 auto;
        padding: 1rem;
    `,
    title: css`
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
    `,
    form: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `,
    field: css`
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    `,
    label: css`
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-secondary-color);
    `,
    input: css`
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0.5rem;
        font-size: 0.875rem;
        outline: none;

        &:focus {
            border-color: var(--primary-color);
        }
    `,
    textarea: css`
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0.5rem;
        font-size: 0.875rem;
        outline: none;
        resize: vertical;
        min-height: 6rem;

        &:focus {
            border-color: var(--primary-color);
        }
    `,
    bottomBar: css`
        display: flex;
        flex-direction: row;
        gap: 0.75rem;
        margin-top: 1.5rem;
    `
}
