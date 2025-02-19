import React from 'react'
import Link from 'next/link'
import {serverPhoenixSignin} from "@/services/server/domain/domain";
import ContentLayout from "@/components/server/content/layout";
import {IDomain} from "@/services/common/domain";
import {getPathname} from "@/services/server/pathname";
import './page.scss'
import {PLSelectResult} from "@/atom/common/models/protocol";
import {PSChannelModel} from "@/atom/common/models/channel";
import {Metadata} from 'next';
import {NoData} from "@/components/common/empty";
import {uuidToBase58} from "@/atom/common/utils/basex";

export default async function Page({params, searchParams}: {
    params: Promise<{ viewer: string }>,
    searchParams: Promise<Record<string, string> & { query: string | undefined }>
}) {
    const domain = serverPhoenixSignin()
    const pageSize = 64
    const url = '/channels?' + `page=1&size=${pageSize}`
    const result = await domain.makeGet<PLSelectResult<PSChannelModel>>(url)

    if (!result || !result.data) {
        return <NoData size={'middle'}/>
    }
    const pathname = await getPathname()
    const baseParams = await params;
    const metadata: Metadata = {
        title: 'codegen.seo.title',
        keywords: 'codegen.seo.keywords',
        description: 'codegen.seo.description',
    }

    return <ContentLayout lang={'zh'} searchParams={await searchParams} pathname={pathname}
                          metadata={metadata}>
        <div className={'container'}>
            <div className={'body'}>
                <div className={'list'}>
                    {result.data.range.map((model) => {
                        return <Item key={model.uid} model={model} domain={domain} lang={'zh'}/>
                    })
                    }
                </div>
            </div>
        </div>
    </ContentLayout>
}

function Item(props: { model: PSChannelModel, domain: IDomain, lang: string }) {
    const readUrl = `/channels/${uuidToBase58(props.model.uid)}`

    return < div className={'item'}>
        {/*<div className={'itemCover'}>*/}
        {/*    <PSImageServer src={imageUrl} alt='star' width={256} height={256}/>*/}
        {/*</div>*/}
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
