import './page.scss'
import React from 'react'
import {TocInfo} from '@/components/common/toc'
import {Metadata} from 'next'
import {serverSigninDomain} from "@/services/server/domain/domain";
import {pageTitle} from "@/utils/page";
import Image from "next/image";
import ContentLayout, {templateBodyId} from '@/components/server/content/layout'
import {ArticleContainer} from "@/components/client/article";
import {getClientIp, getPathname} from "@/services/server/pathname";
import {GoTop} from "@/components/client/gotop";
import {CiAlarmOn} from "react-icons/ci";
import {FaEye} from "react-icons/fa";
import {PSArticleModel} from "@/models/common/article";
import {BaseRouterParams} from '@/models/server/router'
import {useServerTranslation} from '@/services/server/i18n'
import {ArticleAssets} from './assets'
import {generatorRandomString} from "@/utils/string";
import {formatRfc3339} from "@/utils/datetime";
import {TocItem} from "@/models/common/toc";
import { base58ToUuid} from "@/utils/basex";
import {CodeOk, CommonResult} from "@/models/common/protocol";

export const dynamic = "force-dynamic";

export default async function Home({params, searchParams}: {
    params: Promise<{ channel: string, article: string } & BaseRouterParams>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const {t: trans} = await useServerTranslation(baseParams.lang)
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
    const readUrl = `/${baseParams.lang}/content/articles/${baseParams.channel}/articles/${baseParams.article}`
    const assetsUrl = domain.assetUrl(`/articles/${baseParams.channel}/articles/${baseParams.article}/assets`)
    let imageUrl = '/images/default/cover.png'
    if (getResult.data.cover) {
        imageUrl = domain.assetUrl(`/articles/${getResult.data.channel}/articles/${getResult.data.urn}/assets/${getResult.data.cover}`)
    }
    return <ContentLayout lang={baseParams.lang} searchParams={await searchParams} pathname={pathname}
                          metadata={metadata} params={baseParams}>
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
                            <ArticleContainer tocList={tocList} header={getResult.data.header} body={getResult.data.body}
                                              assetsUrl={assetsUrl}/>
                        </div>
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
