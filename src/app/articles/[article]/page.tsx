import './page.scss'
import React from 'react'
import {TocInfo} from '@/components/common/toc'
import {Metadata} from 'next'
import {serverSigninDomain} from "@/services/server/domain/domain";
import {pageTitle} from "@/utils/page";
import ContentLayout, {templateBodyId} from '@/components/server/content/layout'
import {ArticleContainer} from "@/components/client/article";
import {getClientIp, getPathname} from "@/services/server/pathname";
import {GoTop} from "@/components/client/gotop";
import {CiAlarmOn} from "react-icons/ci";
import {FaEye} from "react-icons/fa";
import {generatorRandomString} from "@/atom/common/utils/string";
import {formatRfc3339} from "@/atom/common/utils/datetime";
import {base58ToUuid} from "@/atom/common/utils/basex";
import {CodeOk, CommonResult} from "@/atom/common/models/protocol";
import {PSArticleModel} from "@/atom/common/models/article";
import {TocItem} from "@/atom/common/models/toc";
import {CommentsClient} from "@/components/client/comments/comments";

export const dynamic = "force-dynamic";

export default async function Home({params, searchParams}: {
    params: Promise<{ channel: string, article: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const metadata: Metadata = {}
    const domain = serverSigninDomain()
    const articleUrn = base58ToUuid(baseParams.article)
    const url = `/articles/${articleUrn}`
    const getResult = await domain.makeGet<CommonResult<PSArticleModel | undefined>>(url)

    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return <div>遇到错误</div>
    }
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
        await domain.makePost(`/articles/${baseParams.article}/viewer`, {clientIp})
    }
    const readUrl = `/${'zh'}/content/articles/${baseParams.channel}/articles/${baseParams.article}`
    const assetsUrl = domain.assetUrl(`/articles/${baseParams.channel}/articles/${baseParams.article}/assets`)

    return <ContentLayout lang={'zh'} searchParams={await searchParams} pathname={pathname}
                          metadata={metadata}>
        <div>
            <div className={'articleContainer'}>
                <div className={'leftArea'} id={'articleReadBody'}>
                    <div className={'articleHeader'}>
                        <h1 className={'articleTitle'} id={titleId}>{getResult.data.title}</h1>
                        <div className={'articleDescription'}>
                            {getResult.data.description}
                        </div>
                        <div className={'action'}>
                            <FaEye size={'1rem'}/><span>{getResult.data.discover}</span>&nbsp;
                            <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(getResult.data.update_time)}</span>
                        </div>
                    </div>
                    <div className={'articleInfo'}>
                        <div className={'articleBody'}>
                            <ArticleContainer tocList={tocList} header={getResult.data.header}
                                              body={getResult.data.body}
                                              assetsUrl={assetsUrl}/>
                        </div>
                    </div>
                    <div className={'commentsClient'}>
                        <CommentsClient resource={getResult.data.urn}/>
                    </div>
                </div>
                <div className={'rightArea'}>
                    <TocInfo readurl={readUrl} model={tocList}/>
                    {/*<ArticleAssets channelUrn={baseParams.channel} articleUrn={baseParams.article}/>*/}
                </div>
            </div>
            <GoTop anchor={templateBodyId}/>
        </div>
    </ContentLayout>
}
