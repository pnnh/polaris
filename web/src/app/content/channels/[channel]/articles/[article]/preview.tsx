'use client'

import {useRecoilState, useRecoilValue} from "recoil";
import {articleAssetsPreviewAtom} from "@/app/content/channels/[channel]/articles/[article]/state";
import "./preview.scss";
import React, {useEffect, useState} from "react";
import {encodeBase64String} from "@pnnh/atom";
import {IoClose} from "react-icons/io5";

function isTextContent(mimeType: string) {
    if (mimeType.startsWith('text/')) {
        return true
    }
    if (mimeType.startsWith('application/json')) {
        return true
    }
    return false
}

export function ArticleAssertPreview() {
    const [previewState, setPreviewState] = useRecoilState(articleAssetsPreviewAtom)
    const assetUrn = encodeBase64String(previewState.path)
    const assetsUrl = `${previewState.assetsUrl}/${assetUrn}`
    const [assertData, setAssertData] = useState<{
        mime: string,
        data: ArrayBuffer | string
    }>({
        mime: '',
        data: ''
    })

    useEffect(() => {
        if (!previewState.show || !previewState.path) {
            return
        }
        fetch(assetsUrl).then(async (response) => {
            const contentType = response.headers.get('Content-Type')
            console.log('response:', contentType, response)
            if (isTextContent(contentType || '')) {
                const bodyText = await response.text()
                setAssertData({
                    mime: contentType || 'text/plain',
                    data: bodyText
                })
            } else {
                setAssertData({
                    mime: contentType || 'application/octet-stream',
                    data: assetsUrl
                })
            }
        })
    }, [previewState])

    if (!previewState.show) {
        return <></>
    }
    return <div className={'assertPreview'} style={{
        top: previewState.top,
        left: previewState.left,
        width: previewState.size.width
    }}>
        <div className={'previewHeader'}>
            <div className={'pathTitle'}>
                {previewState.path}
            </div>
            <div className={'closeContainer'}>
                <i onClick={() => {
                    setPreviewState({
                        ...previewState,
                        show: false
                    })
                }}>
                    <IoClose size={'1rem'}/>
                </i>
            </div>
        </div>
        <div className={'previewBody'}>
            <PreviewBody mime={assertData.mime} data={assertData.data}/>
        </div>
    </div>
}

function PreviewBody({mime, data}: { mime: string, data: ArrayBuffer | string }) {
    if (mime.startsWith('text/') || mime.startsWith('application/json')) {
        return <TextPreview text={data as string}/>
    }
    if (mime.startsWith('image/')) {
        return <ImagePreview url={data as string}/>
    }
    return <div>
        暂无预览
    </div>
}

function TextPreview({text}: { text: string }) {
    return <div className={'textPreview'}>
        <code>
            <pre>
                {text}
            </pre>
        </code>
    </div>
}


function ImagePreview({url}: { url: string }) {
    return <div>
        <img src={url}/>
    </div>
}
