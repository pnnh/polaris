'use client'

import styles from "./preview.module.scss";
import React, {useEffect, useState} from "react";
import {IoClose} from "react-icons/io5";
import {articleAssetsPreviewAtom} from "./state";
import {useAtom} from "jotai";
import {PSArticleFileModel} from "@/photon/common/models/article";

import {ServerBuildBodyHtml} from "@/atom/server/article";
import {TocItem} from "@/atom/common/models/toc";

export function ArticlePreview({
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
        return <ServerBuildBodyHtml tocList={tocList} header={header} body={body}
                                    assetsUrl={assetsUrl} libUrl={'/abc'}/>
    }

    return <div className={styles.assertPreview}>
        <div className={styles.previewHeader}>
            <div className={styles.pathTitle}>
                {previewState.title}
            </div>
            <div>
                <i onClick={() => {
                    setPreviewState(undefined)
                }}>
                    <IoClose size={'1rem'}/>
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
    const [content, setContent] = useState<string | undefined>(undefined)
    useEffect(() => {
        fetch(fileUrl).then(response => {
            return response.text()
        }).then(text => {
            setContent(text)
        })
    }, [fileUrl])
    return <div className={styles.textPreview}>
        {content}
    </div>
}


function ImagePreview({portalUrl, model}: { portalUrl: string, model: PSArticleFileModel }) {
    const imageUrl = `${portalUrl}/storage/${model.storage_path}`
    return <div>
        <img src={imageUrl}/>
    </div>
}
