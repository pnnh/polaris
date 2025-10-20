'use client'

import styles from "./preview.module.scss";
import React, {useEffect, useState} from "react";
import {IoClose} from "react-icons/io5";
import {articleAssetsPreviewAtom} from "./state";
import {useAtom} from "jotai";
import {PSArticleFileModel} from "@/photon/common/models/article";
import {TocItem} from "@/atom/common/models/toc";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {renderCodeBlock} from "@/app/[lang]/articles/[uid]/codeblock";
import {BuildBodyHtml} from "./body";

export function ArticlePreview(
    {
        portalUrl, tocList, header, body, assetsUrl
    }: {
        portalUrl: string,
        tocList: Array<TocItem>,
        header: string,
        body: unknown,
        assetsUrl: string
    }) {
    const [previewState, setPreviewState] = useAtom(articleAssetsPreviewAtom)
    if (!previewState) {
        return <BuildBodyHtml tocList={tocList} header={header} body={body}
                              assetsUrl={assetsUrl} libUrl={'/abc'}/>
    }
    const fileRepoPath = previewState.full_repo_path
    return <div className={styles.assertPreview}>
        <div className={styles.previewHeader}>
            <div className={styles.pathTitle}>
                {previewState.title}
            </div>
            <div className={styles.fileActions}>
                <a href={fileRepoPath} target={'_blank'}>
                    <OpenInNewIcon/>
                </a>
                <i onClick={() => {
                    setPreviewState(undefined)
                }}>
                    <IoClose size={'1.2rem'}/>
                </i>
            </div>
        </div>
        <div className={styles.previewBody}>
            <PreviewBody portalUrl={portalUrl} model={previewState}/>
        </div>
    </div>
}

function PreviewBody({portalUrl, model}: { portalUrl: string, model: PSArticleFileModel }) {
    if (model.is_text) {
        return <TextPreview portalUrl={portalUrl} model={model}/>
    }
    if (model.is_image) {
        return <ImagePreview portalUrl={portalUrl} model={model}/>
    }
    return <div>
        暂不支持预览
    </div>
}

function TextPreview({portalUrl, model}: { portalUrl: string, model: PSArticleFileModel }) {
    const fileUrl = `${portalUrl}/storage${model.storage_path}`
    const [contentHtml, setContentHtml] = useState<string | undefined>(undefined)
    useEffect(() => {
        fetch(fileUrl).then(response => {
            return response.text()
        }).then(text => {
            const contentHtml = renderCodeBlock(text, model.storage_path)
            setContentHtml(contentHtml)
        })
    }, [fileUrl])
    if (!contentHtml) {
        return <div className={styles.textPreview}></div>
    }
    return <div className={styles.textPreview} dangerouslySetInnerHTML={{__html: contentHtml}}>
    </div>
}


function ImagePreview({portalUrl, model}: { portalUrl: string, model: PSArticleFileModel }) {
    const imageUrl = `${portalUrl}/storage/${model.storage_path}`
    return <div>
        <img src={imageUrl}/>
    </div>
}
