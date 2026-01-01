import styles from './page.module.scss'
import React from 'react'
import {TocInfo} from '@/components/common/toc'

import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {templateBodyId} from '@/components/server/content/layout'
import {getClientIp, getPathname} from "@/components/server/pathname";
import {GoTop} from "@/components/client/gotop";
import {CiAlarmOn} from "react-icons/ci";
import {FaEye} from "react-icons/fa";
import {generatorRandomString, STSubString} from "@pnnh/atom";
import {formatRfc3339} from "@pnnh/atom";
import {tryBase58ToUuid} from "@pnnh/atom";
import {CodeOk, CommonResult, SymbolUnknown} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {TocItem} from "@pnnh/atom";
import {getDefaultNoteImageByUid} from "@/components/common/note";
import {isValidUUID} from "@pnnh/atom";
import ArticleReadLayout from "@/components/server/content/article/layout";
import {CommentsClient} from "@/components/client/comments/comments";
import {useServerConfig} from "@/components/server/config";
import {ArticleAssets} from "./assets";
import {ArticlePreview} from "./preview";
import {langEn} from "@pnnh/atom";
import {notFound} from "next/navigation";
import {serverInsertArticleViewer} from "@/components/server/viewers/viewers";
// import '@/atom/client/editor/editor.scss';
import {serverMakeGet} from "@pnnh/atom/nodejs";

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
