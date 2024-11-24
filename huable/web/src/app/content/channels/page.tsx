import React from 'react'
import Link from 'next/link'
import {PSImageServer} from '@pnnh/atom-react/server'
import {PLSelectResult} from '@pnnh/polaris-business'
import {PSChannelModel} from "@pnnh/polaris-business"
import {serverSigninDomain} from "@/services/server/domain/domain";
import {HtmlLayout} from "@/components/server/layout";
import ContentLayout from "@/components/server/content/layout";
import {Metadata} from "next";
import {IDomain} from "@/services/common/domain";
import {getPathname} from "@/services/server/pathname";
import './page.scss'

export default async function Page({params, searchParams}: {
    params: { viewer: string },
    searchParams: Record<string, string> & { query: string | undefined }
}) {
    const domain = serverSigninDomain()
    const pageSize = 64
    const url = '/channels?' + `page=1&size=${pageSize}`
    const result = await domain.makeGet<PLSelectResult<PSChannelModel>>(url)

    if (!result) {
        return <div>遇到错误</div>
    }
    const pathname = getPathname()

    const metadata: Metadata = {}
    return <HtmlLayout metadata={metadata}>
        <ContentLayout searchParams={searchParams} pathname={pathname}>
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
    </HtmlLayout>
}

function Item(props: { model: PSChannelModel, domain: IDomain }) {
    const readUrl = `/content/channels/${props.model.urn}`
    let imageUrl = '/images/default/channel.webp'
    // 针对特定资产类型的图片，返回拼接的URL以进行资源寻址
    if (props.model.image) {
        // 拼接资源地址，并截取掉前缀
        imageUrl = props.domain.assetUrl(`/channels/${props.model.urn}/assets/${props.model.image}`)
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
