'use client'

import styles from './assets.module.css'
import React, {useEffect, useState} from "react";
import {getIcon} from "material-file-icons";
import {useRecoilState, useRecoilValue} from "recoil";
import {articleAssetsPreviewAtom} from "@/app/content/channels/[channel]/articles/[article]/state";
import {ArticleAssertPreview} from "@/app/content/channels/[channel]/articles/[article]/preview";
import {clientSigninDomain} from "@/services/client/domain";
import {ClientConfig, useClientConfig} from "@/services/client/config";
import {IDomain} from "@/services/common/domain";
import {encodeBase64String} from "@pnnh/atom";
import {FaAngleRight, FaAngleDown} from "react-icons/fa6";
import {CommonResult, PLSelectResult} from "@/models/common/common-result";
import {PSArticleFileModel} from "@/models/common/article";

async function selectFiles(domain: IDomain, channelUrn: string, articleUrn: string, parentPath: string = '') {
    const assetsUrl = `/channels/${channelUrn}/articles/${articleUrn}/assets?parent=${encodeURIComponent(parentPath)}`
    return await domain.makeGet<CommonResult<PLSelectResult<PSArticleFileModel>>>(assetsUrl)
}

export function ArticleAssets({channelUrn, articleUrn}: { channelUrn: string, articleUrn: string }) {
    const [files, setFiles] = useState<PSArticleFileModel[]>([])
    const clientConfig = useClientConfig()
    const domain = clientSigninDomain(clientConfig)

    useEffect(() => {
        selectFiles(domain, channelUrn, articleUrn).then((result) => {
            setFiles(result.data.range)
        })
    }, [channelUrn, articleUrn])

    if (!files || files.length === 0) {
        return <></>
    }

    return <div className={styles.tocCard} id={'assetsCard'}>
        <ArticleAssertPreview/>
        <div className={styles.tocHeader}>
            附件信息
        </div>
        <div className={styles.tocBody} id={'assetsBody'}>
            {
                files.map((model, index) => {
                    return <FileGroup key={`assets-${0}-${index}`} domain={domain}
                                      channelUrn={channelUrn} articleUrn={articleUrn}
                                      model={model} level={0}/>
                })
            }
        </div>
    </div>
}

function FileGroup({domain, channelUrn, articleUrn, model, level}:
                       {
                           domain: IDomain,
                           channelUrn: string,
                           articleUrn: string,
                           model: PSArticleFileModel,
                           level: number
                       }) {
    const [files, setFiles] = useState<PSArticleFileModel[]>([])
    const [open, setOpen] = useState(false)
    const [previewState, setPreviewState] = useRecoilState(articleAssetsPreviewAtom)

    const openIcon = () => {
        if (model.type != 'directory') {
            return <div className={'w-8'}></div>
        }
        return <i onClick={() => {
            if (open) {
                setOpen(false)
                return
            }
            const assetUrn = encodeBase64String(model.path)
            selectFiles(domain, channelUrn, articleUrn, assetUrn)
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
        <div key={`assets-${level}`} className={styles.tocItem}>
            <div className={styles.assetItem} style={{paddingLeft: `${(level + 1) * 0.3}rem`}}>
                {openIcon()}
                <FileIcon filename={model.name}/>
                <span title={model.name} className={styles.assertItemText}
                      onClick={(event) => {
                          if (model.type === 'directory') {
                              return
                          }
                          const articleReadBody = document.getElementById('articleReadBody')
                          const assetsCardElement = document.getElementById('assetsCard')
                          const assetsBodyElement = document.getElementById('assetsBody')
                          if (!articleReadBody || !assetsCardElement || !assetsBodyElement) {
                              return
                          }
                          const currentTarget = event.currentTarget as HTMLSpanElement
                          const itemTop = currentTarget.offsetTop - assetsBodyElement.scrollTop - 6 // 大概减去点击元素所在父级的上边距
                          const assetsUrl = domain.assetUrl(`/channels/${channelUrn}/articles/${articleUrn}/assets`)
                          setPreviewState({
                              show: previewState.path === model.path ? !previewState.show : true,
                              assetsUrl: assetsUrl,
                              path: model.path,
                              left: -1 * (articleReadBody.clientWidth + 32),
                              top: itemTop + 2,
                              position: {x: articleReadBody.clientLeft, y: event.clientY},
                              size: {width: articleReadBody.clientWidth + 32, height: 200}
                          })
                      }}>{model.name}</span>
            </div>
            {
                open && files.map((model, index) => {
                    return <FileGroup key={`assets-${level}-${index}`} domain={domain}
                                      channelUrn={channelUrn} articleUrn={articleUrn}
                                      model={model} level={level + 1}/>
                })
            }
        </div>
    </>
}

function FileIcon({filename}: { filename: string }) {
    return <div
        className={styles.fileIcon}
        dangerouslySetInnerHTML={{__html: getIcon(filename).svg}}
    />;
}
