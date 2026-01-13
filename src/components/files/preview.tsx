'use client'

import styles from "./preview.module.scss";
import React, {useEffect, useState} from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {PSFileModel} from "@/components/common/models/file";

export function PSFilePreview(
    {
        model
    }: {
        model: PSFileModel
    }) {
    return <div className={styles.assertPreview}>
        <div className={styles.previewHeader}>
            <div className={styles.fileActions}>
                <a href={model.url} target={'_blank'}>
                    <OpenInNewIcon/>
                </a>
            </div>
        </div>
        <div className={styles.previewBody}>
            <PreviewBody model={model}/>
        </div>
    </div>
}

function PreviewBody({model}: { model: PSFileModel }) {
    if (model.is_text) {
        return <TextPreview model={model}/>
    }
    if (model.is_image) {
        return <ImagePreview model={model}/>
    }
    return <div>
        暂不支持预览
    </div>
}

function TextPreview({model}: { model: PSFileModel }) {
    const fileUrl = model.url
    const [contentHtml, setContentHtml] = useState<string | undefined>(undefined)
    useEffect(() => {
        fetch(fileUrl).then(response => {
            return response.text()
        }).then(text => {
            // const contentHtml = renderCodeBlock(text, model.storage_path)
            setContentHtml(text)
        })
    }, [fileUrl])
    if (!contentHtml) {
        return <div className={styles.textPreview}></div>
    }
    return <div className={styles.textPreview}>
        {contentHtml}
    </div>
}


function ImagePreview({model}: { model: PSFileModel }) {
    const imageUrl = model.url
    return <div>
        <img src={imageUrl} alt={model.title}/>
    </div>
}
