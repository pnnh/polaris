import {css} from "@/gen/styled/css";
import React from 'react'

import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {templateBodyId} from '@/components/server/content/layout'
import {getClientIp, getPathname} from "@/components/server/pathname";
import {GoTop} from "@/components/client/gotop";
import {CiAlarmOn} from "react-icons/ci";
import {FaEye} from "react-icons/fa";
import {
    CodeOk,
    CommonResult,
    formatRfc3339,
    generatorRandomString,
    isValidUUID,
    langEn,
    STSubString,
    SymbolUnknown,
    TocItem,
    tryBase58ToUuid
} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {getDefaultNoteImageByUid} from "@/components/common/note";
import ArticleReadLayout from "@/components/server/content/article/layout";
import {CommentsClient} from "@/components/client/comments/comments";
import {useServerConfig} from "@/components/server/config";
import {ArticlePreview} from "./preview";
import {notFound} from "next/navigation";
import {serverInsertArticleViewer} from "@/components/server/viewers/viewers";
// import '@/atom/client/editor/editor.scss';
import {serverMakeGet} from "@pnnh/atom/nodejs";

const pageStyles = {
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
        color: var(--text-primary-color);
    `,
    articleTitle: css`
        font-weight: 600;
        font-size: 20px;
        margin-bottom: 16px;
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
    `
}

export const dynamic = "force-dynamic";

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, uid: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const metadata = new PageMetadata(lang)
    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
    const articleUid = tryBase58ToUuid(paramsValue.uid)
    if (!articleUid) {
        notFound();
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
    const clientIp = await getClientIp()
    // update article discover count
    if (clientIp) {
        await serverInsertArticleViewer(internalPortalUrl, articleUid, clientIp)
    }
    const readUrl = `/${lang}/articles/articles/${paramsValue.uid}`
    let imageUrl = getDefaultNoteImageByUid(model.uid)
    if (model.cover && isValidUUID(model.cover)) {
        imageUrl = `/articles/${model.uid}/assets/${model.cover}`
    }
    const fullRepoPath = model.full_repo_path
    return <ArticleReadLayout lang={lang} searchParams={await searchParams} pathname={pathname}
                              metadata={metadata} userInfo={SymbolUnknown}>

        <div className={pageStyles.articleCover}>
            <div className={pageStyles.articleHeader}>
                <h1 className={pageStyles.articleTitle} id={titleId}>{getResult.data.title}</h1>
                <div className={pageStyles.articleDescription}>
                    {STSubString(model.description || model.body, 80)}
                </div>
                <div className={pageStyles.action}>
                    <FaEye size={'1rem'}/><span>{getResult.data.discover}</span>&nbsp;
                    <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(getResult.data.update_time)}</span>
                </div>
            </div>
            <img className={pageStyles.coverImage} src={imageUrl} alt={model.title}/>
        </div>
        <div className={pageStyles.articleContainer}>
            <div className={pageStyles.leftArea} id={'articleReadBody'}>
                <div className={pageStyles.articleInfo}>
                    <div className={pageStyles.articleBody}>
                        <ArticlePreview tocList={tocList} header={getResult.data.header}
                                        body={getResult.data.body}
                                        assetsUrl={'assetsUrl'} portalUrl={publicPortalUrl}/>
                    </div>
                </div>
                <div className={pageStyles.commentsClient}>
                    <CommentsClient portalUrl={publicPortalUrl} resource={getResult.data.uid}
                                    lang={lang}/>
                </div>
            </div>
            {/*<div className={pageStyles.rightArea}>*/}
            {/*    <TocInfo readurl={readUrl} model={tocList}/>*/}
            {/*    <ArticleAssets portalUrl={publicPortalUrl} fullRepoPath={fullRepoPath} articleUid={getResult.data.uid}/>*/}
            {/*</div>*/}
        </div>
        <GoTop anchor={templateBodyId}/>
    </ArticleReadLayout>
}
