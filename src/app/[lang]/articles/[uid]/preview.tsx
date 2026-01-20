'use client'

import React, {useEffect, useState} from "react";
import {IoClose} from "react-icons/io5";
import {articleAssetsPreviewAtom} from "./state";
import {useAtom} from "jotai";
import {PSArticleFileModel} from "@/components/common/models/article";
import {TocItem} from "@pnnh/atom";
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
    return <>
        <div className="assertPreview">
        <div className="previewHeader">
            <div className="pathTitle">
                {previewState.title}
            </div>
            <div className="fileActions">
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
        <div className="previewBody">
            <PreviewBody portalUrl={portalUrl} model={previewState}/>
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
      .pathTitle {
        font-size: 16px;
        color: #3c3c3c;
        font-weight: 500;
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
        <div className="textPreview" dangerouslySetInnerHTML={{__html: contentHtml}}>
    </div>
    <style jsx>{`
      .textPreview {
        word-break: break-word;
        white-space: break-spaces;
      }
    `}</style>
    </>
}


function ImagePreview({portalUrl, model}: { portalUrl: string, model: PSArticleFileModel }) {
    const imageUrl = `${portalUrl}/storage/${model.storage_path}`
    return <div>
        <img src={imageUrl}/>
    </div>
}
