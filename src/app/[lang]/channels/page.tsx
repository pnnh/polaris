import React from 'react'
import {serverPortalSignin} from "@/services/server/domain/domain";
import ContentLayout from "@/components/server/content/layout";
import {IDomain} from "@/services/common/domain";
import {getPathname} from "@/services/server/pathname";
import './page.scss'
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {PSChannelModel} from "@/photon/common/models/channel";
import {NoData} from "@/components/common/empty";
import {uuidToBase58} from "@/atom/common/utils/basex";
import {isValidUUID} from "@/atom/common/utils/uuid";
import {PSImageServer} from "@/components/server/image";
import {STSubString} from "@/atom/common/utils/string";
import {getDefaultChanImageByUid} from "@/services/common/channel";
import {PageMetadata} from "@/utils/page";
import {langEn} from "@/atom/common/language";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, viewer: string }>,
    searchParams: Promise<Record<string, string> & { query: string | undefined }>
}) {
    const domain = serverPortalSignin()
    const paramsValue = await params;
    const pageSize = 64
    const url = '/channels?' + `page=1&size=${pageSize}`
    const result = await domain.makeGet<PLSelectResult<PSChannelModel>>(url)

    if (!result || !result.data) {
        return <NoData size={'middle'}/>
    }
    const pathname = await getPathname()
    const lang = paramsValue.lang || langEn
    const metadata = new PageMetadata(lang)

    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={await searchParams} pathname={pathname}
                          metadata={metadata}>
        <div className={'container'}>
            <div className={'body'}>
                <div className={'list'}>
                    {result.data.range.map((model) => {
                        return <Item key={model.uid} model={model} domain={domain} lang={lang}/>
                    })
                    }
                </div>
            </div>
        </div>
    </ContentLayout>
}

function Item(props: { model: PSChannelModel, domain: IDomain, lang: string }) {
    const model = props.model
    const readUrl = `/${props.lang}/channels/${uuidToBase58(props.model.uid)}`
    let imageUrl = getDefaultChanImageByUid(model.uid)
    if (model.image && isValidUUID(model.image)) {
        imageUrl = props.domain.assetUrl(`/channels/${model.uid}/assets/${model.image}`)
    }

    return < div className={'item'}>
        <div className={'itemCover'}>
            <PSImageServer src={imageUrl} alt='star' width={256} height={256}/>
        </div>
        <div className={'content'}>
            <div className={'title'}>
                <a className={'link'} href={readUrl}>{props.model.name}</a>
            </div>
            <div className={'description'}>
                {STSubString(props.model.description, 140)}
            </div>
        </div>
    </div>
}
