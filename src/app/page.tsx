import React from 'react'
import './page.scss'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/services/server/pathname";
import {Metadata} from 'next'
import {serverSigninDomain} from "@/services/server/domain/domain";
import {PLSelectResult} from "@/atom/common/models/protocol";
import {NoData} from "@/components/common/empty";
import {IDomain} from "@/services/common/domain";
import Link from "next/link";
import { uuidToBase58} from "@/atom/common/utils/basex";
import { PSArticleModel } from '@/atom/common/models/article';

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const searchParamsValue = await searchParams
    const metadata: Metadata = {
        title: '',
        keywords: 'tools,notes,工具,笔记',
        description: '',
    }
    const domain = serverSigninDomain()
    const pageSize = 64
    const url = '/articles?' + `page=1&size=${pageSize}`
    const result = await domain.makeGet<PLSelectResult<PSArticleModel>>(url)

    if (!result || !result.data) {
        return <NoData size={'middle'}/>
    }
    return <ContentLayout lang={'zh'} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>

        <div className={'homeContainer'}>
                <div className={'contentList'}>
                    {result.data.range.map((model) => {
                        return <Item key={model.urn} model={model} domain={domain} lang={'zh'}/>
                    })
                    }
                </div>
        </div>
    </ContentLayout>
}


function Item(props: { model: PSArticleModel, domain: IDomain, lang: string }) {
    const readUrl = `/articles/${uuidToBase58(props.model.urn)}`
    let imageUrl = '/images/default/channel.webp'
    // 针对特定资产类型的图片，返回拼接的URL以进行资源寻址
    if (props.model.cover) {
        // 拼接资源地址，并截取掉前缀
        imageUrl = props.domain.assetUrl(`/articles/${props.model.urn}/assets/${props.model.cover}`)
    }

    return < div className={'contentItem'}>
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
