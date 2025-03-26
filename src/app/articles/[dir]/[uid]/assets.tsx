'use client'

import './assets.scss'
import React, {useEffect, useState} from "react";
import {getIcon} from "material-file-icons";
import {FaAngleRight, FaAngleDown} from "react-icons/fa6";
import {CommonResult, PLSelectResult} from "@/atom/common/models/protocol";
import {PSArticleFileModel} from "@/atom/common/models/article";
import {encodeBase64String} from "@/atom/common/utils/basex";
import {makeGet} from "@/atom/client/http";
import {useAtom} from "jotai";
import {articleAssetsPreviewAtom} from "@/app/articles/[dir]/[uid]/state";

async function selectFiles(portalUrl: string, channelUrn: string, articleUid: string, parentPath: string = '') {
    const assetsUrl = `${portalUrl}/articles/${articleUid}/assets?parent=${encodeURIComponent(parentPath)}`
    return await makeGet<PLSelectResult<PSArticleFileModel>>(assetsUrl)
}

export function ArticleAssets({portalUrl, channelUid, articleUid}: {
    portalUrl: string,
    channelUid: string,
    articleUid: string
}) {
    const [files, setFiles] = useState<PSArticleFileModel[]>([])

    useEffect(() => {
        selectFiles(portalUrl, channelUid, articleUid).then((result) => {
            setFiles(result.data.range)
        })
    }, [channelUid, articleUid])

    if (!files || files.length === 0) {
        return <></>
    }

    return <div className={'tocCard'} id={'assetsCard'}>
        <div className={'tocHeader'}>
            文件信息
        </div>
        <div className={'tocBody'} id={'assetsBody'}>
            {
                files.map((model, index) => {
                    return <FileGroup key={`assets-${0}-${index}`} portalUrl={portalUrl}
                                      channelUrn={channelUid} articleUrn={articleUid}
                                      model={model} level={0}/>
                })
            }
        </div>
    </div>
}

function FileGroup({portalUrl, channelUrn, articleUrn, model, level}:
                   {
                       portalUrl: string,
                       channelUrn: string,
                       articleUrn: string,
                       model: PSArticleFileModel,
                       level: number
                   }) {
    const [files, setFiles] = useState<PSArticleFileModel[]>([])
    const [open, setOpen] = useState(false)
    const [previewState, setPreviewState] = useAtom(articleAssetsPreviewAtom)

    const openIcon = () => {
        if (!model.is_dir) {
            return <div className={'w-8'}></div>
        }
        return <i onClick={() => {
            if (open) {
                setOpen(false)
                return
            }
            const assetUrn = encodeBase64String(model.path)
            selectFiles(portalUrl, channelUrn, articleUrn, assetUrn)
                .then((result) => {
                    console.log('assets:', result)
                    setFiles(result.data.range)
                    setOpen(true)
                })
        }}>
            {open ? <FaAngleDown size={'1rem'}/> : <FaAngleRight size={'1rem'}/>}
        </i>
    }
    return <>
        <div key={`assets-${level}`} className={'tocItem'}>
            <div className={'assetItem'} style={{paddingLeft: `${(level + 1) * 0.3}rem`}}>
                {openIcon()}
                <FileIcon filename={model.title}/>
                <span title={model.title} className={'assertItemText'}
                      onClick={(event) => {
                          if (model.is_dir) {
                              return
                          }
                          const articleReadBody = document.getElementById('articleReadBody')
                          const assetsCardElement = document.getElementById('assetsCard')
                          const assetsBodyElement = document.getElementById('assetsBody')
                          if (!articleReadBody || !assetsCardElement || !assetsBodyElement) {
                              return
                          }
                          setPreviewState(model)
                      }}>{model.title}</span>
            </div>
            {
                open && files.map((model, index) => {
                    return <FileGroup key={`assets-${level}-${index}`} portalUrl={portalUrl}
                                      channelUrn={channelUrn} articleUrn={articleUrn}
                                      model={model} level={level + 1}/>
                })
            }
        </div>
    </>
}

function FileIcon({filename}: { filename: string }) {
    return <div
        className={'fileIcon'}
        dangerouslySetInnerHTML={{__html: getIcon(filename).svg}}
    />;
}
