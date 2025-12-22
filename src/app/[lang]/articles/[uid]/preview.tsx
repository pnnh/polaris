import {css} from '@emotion/css'
import React, {useEffect, useState} from "react";
import {IoClose} from "react-icons/io5";
import {articleAssetsPreviewAtom} from "./state";
import {useAtom} from "jotai";
import {PSArticleFileModel} from "@/components/common/models/article";
import {TocItem} from "@/atom/common/models/toc";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {renderCodeBlock} from "@/app/[lang]/articles/[uid]/codeblock";
import {BuildBodyHtml} from "./body";

const styles = {
    assertPreview: css`
        width: 100%;
        background: #fefefe;
    `,
    previewHeader: css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 1px #f3f3f3;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
    `,
    pathTitle: css`
        font-size: 16px;
        color: #3c3c3c;
        font-weight: 500;
    `,
    fileActions: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;

        i {
            cursor: pointer;
        }

        a svg {
            height: 1rem;
            width: 1rem;
        }
    `,
    previewBody: css`
        font-size: 14px;
        height: 100%;
        background: #fff;
    `,
    textPreview: css`
        word-break: break-word;
        white-space: break-spaces;
    `
};

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
