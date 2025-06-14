import './page.scss'
import React from 'react'
import {TocInfo} from '@/components/common/toc'
import {Metadata} from 'next'
import {serverPhoenixSignin, serverPortalSignin} from "@/services/server/domain/domain";
import {pageTitle} from "@/utils/page";
import {templateBodyId} from '@/components/server/content/layout'
import {getClientIp, getPathname} from "@/services/server/pathname";
import {GoTop} from "@/components/client/gotop";
import {CiAlarmOn} from "react-icons/ci";
import {FaEye} from "react-icons/fa";
import {generatorRandomString, STSubString} from "@/atom/common/utils/string";
import {formatRfc3339} from "@/atom/common/utils/datetime";
import {base58ToUuid} from "@/atom/common/utils/basex";
import {CodeOk, CommonResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {PSArticleModel} from "@/atom/common/models/article";
import {TocItem} from "@/atom/common/models/toc";
import {getDefaultNoteImageByUid} from "@/services/common/note";
import {isValidUUID} from "@/atom/common/utils/uuid";
import ArticleReadLayout from "@/components/server/content/article/layout";
import {CommentsClient} from "@/atom/client/components/comments/comments";
import {useServerConfig} from "@/services/server/config";
import {ArticleAssets} from "./assets";
import {ArticleAssertPreview} from "@/app/articles/[dir]/[uid]/preview";
import {langEn} from "@/atom/common/language";

export const dynamic = "force-dynamic";

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, dir: string, uid: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const metadata: Metadata = {}
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const currentDir = paramsValue.dir
    const searchParamsValue = await searchParams
    let domain = serverPhoenixSignin()
    if (currentDir === 'dir2') {
        domain = serverPortalSignin()
    }
    const articleUrn = base58ToUuid(paramsValue.uid)
    const url = `/articles/${articleUrn}`
    const getResult = await domain.makeGet<CommonResult<PSArticleModel | undefined>>(url)

    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return <div>遇到错误</div>
    }
    const model = getResult.data
    metadata.title = pageTitle(getResult.data.title)

    metadata.description = getResult.data.description
    metadata.keywords = getResult.data.keywords

    const tocList: TocItem[] = []
    const titleId = generatorRandomString(8)
    tocList.push({title: getResult.data.title, header: 0, id: titleId})
    if (!getResult.data.body) {
        return <div>暂不支持的文章类型</div>
    }
    const clientIp = await getClientIp()
    // 更新文章阅读次数
    if (clientIp) {
        await domain.makePost(`/articles/${articleUrn}/viewer`, {clientIp})
    }
    const readUrl = `/articles/${currentDir}/articles/${paramsValue.uid}`
    let imageUrl = getDefaultNoteImageByUid(model.uid)
    if (model.cover && isValidUUID(model.cover)) {
        imageUrl = domain.assetUrl(`/articles/${model.uid}/assets/${model.cover}`)
    }
    const serverConfig = useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    return <ArticleReadLayout lang={lang} searchParams={await searchParams} pathname={pathname}
                              metadata={metadata} userInfo={SymbolUnknown}>
        <div>
            <div className={'articleCover'}>
                <div className={'articleHeader'}>
                    <h1 className={'articleTitle'} id={titleId}>{getResult.data.title}</h1>
                    <div className={'articleDescription'}>
                        {STSubString(model.description || model.body, 80)}
                    </div>
                    <div className={'action'}>
                        <FaEye size={'1rem'}/><span>{getResult.data.discover}</span>&nbsp;
                        <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(getResult.data.update_time)}</span>
                    </div>
                </div>
                <img className={'coverImage'} src={imageUrl} alt={model.title}/>
            </div>
            <div className={'articleContainer'}>
                <div className={'leftArea'} id={'articleReadBody'}>
                    <div className={'articleInfo'}>
                        <div className={'articleBody'}>
                            <ArticleAssertPreview tocList={tocList} header={getResult.data.header}
                                                  body={getResult.data.body}
                                                  assetsUrl={'assetsUrl'} portalUrl={portalUrl}/>
                        </div>
                    </div>
                    <div className={'commentsClient'}>
                        <CommentsClient portalUrl={portalUrl} resource={getResult.data.uid}/>
                    </div>
                </div>
                <div className={'rightArea'}>
                    <TocInfo readurl={readUrl} model={tocList}/>
                    <ArticleAssets portalUrl={portalUrl} channelUid={''} articleUid={getResult.data.uid}/>
                </div>
            </div>
            <GoTop anchor={templateBodyId}/>
        </div>
    </ArticleReadLayout>
}
