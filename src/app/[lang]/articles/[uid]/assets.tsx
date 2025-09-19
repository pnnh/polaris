'use client'

import styles from './assets.module.scss'
import React, {useEffect, useState} from "react";
import {getIcon} from "material-file-icons";
import {FaAngleRight, FaAngleDown} from "react-icons/fa6";
import {CommonResult, PLSelectResult} from "@/atom/common/models/protocol";
import {PSArticleFileModel} from "@/photon/common/models/article";
import {encodeBase64String} from "@/atom/common/utils/basex";
import {clientMakeGet} from "@/atom/client/http";
import {useAtom} from "jotai";
import {articleAssetsPreviewAtom} from "./state";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

async function selectFiles(portalUrl: string, articleUid: string, parentPath: string = '') {
    const assetsUrl = `${portalUrl}/articles/${articleUid}/assets?parent=${encodeURIComponent(parentPath)}`
    return await clientMakeGet<PLSelectResult<PSArticleFileModel>>(assetsUrl)
}

export function ArticleAssets({portalUrl, fullRepoPath, articleUid}: {
    portalUrl: string,
    fullRepoPath: string,
    articleUid: string
}) {
    const [files, setFiles] = useState<PSArticleFileModel[]>([])

    useEffect(() => {
        selectFiles(portalUrl, articleUid).then((result) => {
            if (!result || !result.data || !result.data.range) {
                return
            }
            setFiles(result.data.range)
        })
    }, [articleUid])

    if (!files || files.length === 0) {
        return <div></div>
    }

    return <div className={styles.tocCard} id={'assetsCard'}>
        <div className={styles.tocHeader}>
            <span>文件信息</span><a href={fullRepoPath} target={'_blank'}><OpenInNewIcon/></a>
        </div>
        <div className={styles.tocBody} id={'assetsBody'}>
            {
                files.map((model, index) => {
                    return <FileGroup key={`assets-${0}-${index}`} portalUrl={portalUrl}
                                      articleUrn={articleUid}
                                      model={model} level={0}/>
                })
            }
        </div>
    </div>
}

function FileGroup({portalUrl, articleUrn, model, level}:
                   {
                       portalUrl: string,
                       articleUrn: string,
                       model: PSArticleFileModel,
                       level: number
                   }) {
    const [files, setFiles] = useState<PSArticleFileModel[]>([])
    const [open, setOpen] = useState(false)
    const [previewState, setPreviewState] = useAtom(articleAssetsPreviewAtom)

    const openIcon = () => {
        if (!model.is_dir) {
            return <div className={'w-4'}></div>
        }
        return <i className={styles.dirOpenIcon} onClick={() => {
            if (open) {
                setOpen(false)
                return
            }
            const assetUrn = encodeBase64String(model.path)
            selectFiles(portalUrl, articleUrn, assetUrn)
                .then((result) => {
                    if (!result || !result.data || !result.data.range) {
                        return
                    }
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
                <FileIcon filename={model.title}/>
                <span title={model.title} className={styles.assertItemText}
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
                                      articleUrn={articleUrn}
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
