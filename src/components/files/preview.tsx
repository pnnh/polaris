'use client'

import React, {useEffect, useState} from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {PSFileModel} from "@/components/common/models/file";

export function PSFilePreview(
    {
        model
    }: {
        model: PSFileModel
    }) {
    return <>
        <div className="assertPreview">
        <div className="previewHeader">
            <div className="fileActions">
                <a href={model.url} target={'_blank'}>
                    <OpenInNewIcon/>
                </a>
            </div>
        </div>
        <div className="previewBody">
            <PreviewBody model={model}/>
        </div>
    </div>
    <style jsx>{`
      .assertPreview {
        width: 100%;
        background: #fefefe;
      }
      .previewHeader {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 1px #f3f3f3;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
      }
      .fileActions {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
      }
      .fileActions i {
        cursor: pointer;
      }
      .fileActions a :global(svg) {
        height: 1rem;
        width: 1rem;
      }
      .previewBody {
        font-size: 14px;
        height: 100%;
        background: #fff;
      }
    `}</style>
    </>
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
        return <>
            <div className="textPreview"></div>
            <style jsx>{`
              .textPreview {
                word-break: break-word;
                white-space: break-spaces;
              }
            `}</style>
        </>
    }
    return <>
        <div className="textPreview">
        {contentHtml}
    </div>
    <style jsx>{`
      .textPreview {
        word-break: break-word;
        white-space: break-spaces;
      }
    `}</style>
    </>
}


function ImagePreview({model}: { model: PSFileModel }) {
    const imageUrl = model.url
    return <div>
        <img src={imageUrl} alt={model.title}/>
    </div>
}
