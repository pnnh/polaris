import {css} from '@emotion/css'
import React from 'react'
import {TocInfo} from '@/components/common/toc'

import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {templateBodyId} from '@/components/server/content/layout'
import {GoTop} from "@/components/client/gotop";
import {CiAlarmOn} from "react-icons/ci";
import {FaEye} from "react-icons/fa";
import {generatorRandomString, STSubString} from "@/atom/common/utils/string";
import {formatRfc3339} from "@/atom/common/utils/datetime";
import {tryBase58ToUuid} from "@/atom/common/utils/basex";
import {CodeOk, CommonResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {PSArticleModel} from "@/components/common/models/article";
import {TocItem} from "@/atom/common/models/toc";
import {getDefaultNoteImageByUid} from "@/components/common/note";
import {isValidUUID} from "@/atom/common/utils/uuid";
import {ArticleReadLayout} from "@/components/server/content/article/layout";
import {CommentsClient} from "@/components/client/comments/comments";
import {useServerConfig} from "@/components/server/config";
import {ArticleAssets} from "./assets";
import {ArticlePreview} from "./preview";
import {langEn} from "@/atom/common/language";
import {serverInsertArticleViewer} from "@/components/server/viewers/viewers";
import '@/atom/client/editor/editor.scss';
import {serverMakeGet} from "@/atom/server/http";
import {Request, Response} from "express";

const styles = {
    articleCover: css`
        width: 100%;
        height: 12rem;
        position: relative;
        margin: 1rem auto 0;
        border-radius: 6px;
        overflow: hidden;
        opacity: 0.9;
        background-color: var(--background-color);

        @media screen and (min-width: 80rem) {
            width: 80rem;
            margin: 1rem auto 0 auto;
        }
    `,
    articleHeader: css`
        position: relative;
        z-index: 1;
        border-radius: 4px;
        overflow: hidden;
        padding: 1rem;
        color: var(--primary-color);
    `,
    articleDescription: css`
        font-size: 1rem;
        color: var(--text-primary-color);
        margin-top: 1rem;
        margin-bottom: 1rem;
    `,
    action: css`
        font-size: 14px;
        height: 1rem;
        color: var(--text-primary-color);
        line-height: 22px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
    `,
    coverImage: css`
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        z-index: 0;
        mask: linear-gradient(to right, transparent 30%, var(--text-primary-color));
    `,
    articleContainer: css`
        display: flex;
        flex-direction: row;
        margin-top: 1rem;
        margin-bottom: 2rem;
        width: 100%;
        gap: 1rem;

        @media screen and (min-width: 80rem) {
            width: 80rem;
            margin: 1rem auto 0 auto;
        }
    `,
    leftArea: css`
        border-radius: 2px;
        width: calc(100% - 20rem - 1rem);
    `,
    commentsClient: css`
        margin-top: 1rem;
    `,
    rightArea: css`
        flex-direction: column;
        gap: 1rem;
        width: 20rem;
        flex-shrink: 0;
        display: none;

        @media screen and (min-width: 80rem) {
            display: flex;
        }
    `,
    channelCard: css`
        border-radius: 4px;
        background-color: var(--background-color);
    `,
    channelTitle: css`
        font-size: 1rem;
        font-weight: 400;
        padding: 1rem;
        border-bottom: solid 1px #e3e3e3;
    `,
    channelDescription: css`
        padding: 1rem;
    `,
    articleInfo: css`
        display: block;
        background-color: var(--background-color);
        border-radius: 4px;
        border: solid 1px var(--divider-color);
    `,
    articleBody: css`
        padding: 16px;
        background-color: var(--background-color);
        border-radius: 4px;
        position: relative;
    `,
    articleTitle: css`
        font-weight: 600;
        font-size: 20px;
        margin-bottom: 16px;
    `
};

export const dynamic = "force-dynamic";

export async function Home(request: Request, response: Response) {
    const pathname = request.path

    const lang = request.params.lang || langEn
    const metadata = new PageMetadata(lang)
    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
    const articleUid = tryBase58ToUuid(request.params.uid)
    if (!articleUid) {
        return response.sendStatus(404)
    }
    const url = `${internalPortalUrl}/articles/${articleUid}?lang=${lang}`
    const getResult = await serverMakeGet<CommonResult<PSArticleModel | undefined>>(url, '')

    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return <div>遇到错误2</div>
    }
    const model = getResult.data
    metadata.title = pageTitle(lang, getResult.data.title)

    metadata.description = getResult.data.description
    metadata.keywords = getResult.data.keywords

    const tocList: TocItem[] = []
    const titleId = generatorRandomString(8)
    tocList.push({title: getResult.data.title, header: 0, id: titleId})
    if (!getResult.data.body) {
        return <div>暂不支持的文章类型</div>
    }
    const clientIp = '127.0.0.1'//await getClientIp()
    // update article discover count
    if (clientIp) {
        await serverInsertArticleViewer(internalPortalUrl, articleUid, clientIp)
    }
    const readUrl = `/${lang}/articles/articles/${request.params.uid}`
    let imageUrl = getDefaultNoteImageByUid(model.uid)
    if (model.cover && isValidUUID(model.cover)) {
        imageUrl = `/articles/${model.uid}/assets/${model.cover}`
    }
    const fullRepoPath = model.full_repo_path
    return <ArticleReadLayout lang={lang} pathname={pathname}
                              metadata={metadata} userInfo={SymbolUnknown}>

        <div className={styles.articleCover}>
            <div className={styles.articleHeader}>
                <h1 className={styles.articleTitle} id={titleId}>{getResult.data.title}</h1>
                <div className={styles.articleDescription}>
                    {STSubString(model.description || model.body, 80)}
                </div>
                <div className={styles.action}>
                    <FaEye size={'1rem'}/><span>{getResult.data.discover}</span>&nbsp;
                    <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(getResult.data.update_time)}</span>
                </div>
            </div>
            <img className={styles.coverImage} src={imageUrl} alt={model.title}/>
        </div>
        <div className={styles.articleContainer}>
            <div className={styles.leftArea} id={'articleReadBody'}>
                <div className={styles.articleInfo}>
                    <div className={styles.articleBody}>
                        <ArticlePreview tocList={tocList} header={getResult.data.header}
                                        body={getResult.data.body}
                                        assetsUrl={'assetsUrl'} portalUrl={publicPortalUrl}/>
                    </div>
                </div>
                <div className={styles.commentsClient}>
                    <CommentsClient portalUrl={publicPortalUrl} resource={getResult.data.uid}
                                    lang={lang}/>
                </div>
            </div>
            <div className={styles.rightArea}>
                <TocInfo readurl={readUrl} model={tocList}/>
                <ArticleAssets portalUrl={publicPortalUrl} fullRepoPath={fullRepoPath} articleUid={getResult.data.uid}/>
            </div>
        </div>
        <GoTop anchor={templateBodyId}/>
    </ArticleReadLayout>
}
