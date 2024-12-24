import React from 'react'
import './page.scss'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/services/server/pathname";
import {getLangAnyway, useServerTranslation} from '@/services/server/i18n'
import {BaseRouterParams} from '@/models/server/router'
import {Metadata} from 'next'
import {serverSigninDomain} from "@/services/server/domain/domain";
import {PLSelectResult} from "@/models/common/protocol";
import {NoData} from "@/components/common/empty";
import {IDomain} from "@/services/common/domain";
import {PSImageServer} from "@/components/server/image";
import Link from "next/link";
import {PSArticleModel} from "@/models/common/article";
import {hexToBase58 } from "@/utils/basex";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ channel: string } & BaseRouterParams>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const searchParamsValue = await searchParams
    const {t: trans} = await useServerTranslation(baseParams.lang)
    const metadata: Metadata = {
        title: '',
        keywords: 'tools,notes,工具,笔记',
        description: '',
    }
    const domain = serverSigninDomain()
    const pageSize = 64
    const url = '/articles/restful/select?' + `page=1&size=${pageSize}`
    const result = await domain.makeGet<PLSelectResult<PSArticleModel>>(url)

    if (!result || !result.data) {
        return <NoData size={'middle'}/>
    }
    const pageLang = await getLangAnyway()

    return <ContentLayout lang={pageLang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} params={baseParams}>

        <div className={'homeContainer'}>
                <div className={'contentList'}>
                    {result.data.range.map((model) => {
                        return <Item key={model.urn} model={model} domain={domain} lang={pageLang}/>
                    })
                    }
                </div>
        </div>
    </ContentLayout>
}


function Item(props: { model: PSArticleModel, domain: IDomain, lang: string }) {
    const readUrl = `/articles/${hexToBase58(props.model.urn)}`
    let imageUrl = '/images/default/channel.webp'
    // 针对特定资产类型的图片，返回拼接的URL以进行资源寻址
    if (props.model.cover) {
        // 拼接资源地址，并截取掉前缀
        imageUrl = props.domain.assetUrl(`/articles/${props.model.urn}/assets/${props.model.cover}`)
    }

    return < div className={'contentItem'}>
        <div className={'itemCover'}>
            <PSImageServer src={imageUrl} alt='star' width={256} height={256}/>
        </div>
        <div className={'itemDetail'}>
            <div className={'title'}>
                <Link className={'link'} href={readUrl}>{props.model.title}</Link>
            </div>
            <div className={'description'}>
                {props.model.description || props.model.body}
            </div>
        </div>
    </div>
}
