import React from 'react'
import Link from 'next/link'
import {serverSigninDomain} from "@/services/server/domain/domain";
import ContentLayout from "@/components/server/content/layout";
import {IDomain} from "@/services/common/domain";
import {getPathname} from "@/services/server/pathname";
import './page.scss'
import {PLSelectResult} from "@/models/common/common-result";
import {PSChannelModel} from "@/models/common/channel";
import {BaseRouterParams} from '@/models/server/router';
import {useServerTranslation} from '@/services/server/i18n';
import {Metadata} from 'next';
import {PSImageServer} from "@/components/server/image";

export default async function Page({params, searchParams}: {
    params: Promise<{ viewer: string } & BaseRouterParams>,
    searchParams: Promise<Record<string, string> & { query: string | undefined }>
}) {
    const domain = serverSigninDomain()
    const pageSize = 64
    const url = '/articles?' + `page=1&size=${pageSize}`
    const result = await domain.makeGet<PLSelectResult<PSChannelModel>>(url)

    if (!result) {
        return <div>遇到错误</div>
    }
    const pathname = await getPathname()
    const baseParams = await params;
    const {t: trans} = await useServerTranslation(baseParams.lang)
    const metadata: Metadata = {
        title: trans('codegen.seo.title'),
        keywords: trans('codegen.seo.keywords'),
        description: trans('codegen.seo.description'),
    }

    return <ContentLayout searchParams={await searchParams} pathname={pathname} metadata={metadata} params={baseParams}>
        <div className={'container'}>
            <div className={'body'}>
                <div className={'list'}>
                    {result.range.map((model) => {
                        return <Item key={model.urn} model={model} domain={domain}/>
                    })
                    }
                </div>
            </div>
        </div>
    </ContentLayout>
}

function Item(props: { model: PSChannelModel, domain: IDomain }) {
    const readUrl = `/content/articles/${props.model.urn}`
    let imageUrl = '/images/default/channel.webp'
    // 针对特定资产类型的图片，返回拼接的URL以进行资源寻址
    if (props.model.image) {
        // 拼接资源地址，并截取掉前缀
        imageUrl = props.domain.assetUrl(`/articles/${props.model.urn}/assets/${props.model.image}`)
    }

    return < div className={'item'}>
        <div className={'itemCover'}>
            <PSImageServer src={imageUrl} alt='star' width={256} height={256}/>
        </div>
        <div className={'content'}>
            <div className={'title'}>
                <Link className={'link'} href={readUrl}>{props.model.name}</Link>
            </div>
            <div className={'description'}>
                {props.model.description}
            </div>
        </div>
    </div>
}
