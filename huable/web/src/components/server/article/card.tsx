import {channelName, PSArticleModel} from "@pnnh/polaris-business";
import Link from "next/link";
import {formatRfc3339, STSubString} from "@pnnh/atom";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import {PSImageServer} from "@pnnh/atom-react/server";
import React from "react";
import {IDomain} from "@/services/common/domain";
import './card.scss'

export function ArticleCard({model, domain}: { model: PSArticleModel, domain: IDomain }) {
    const readUrl = `/content/channels/${channelName(model.channel)}/articles/${model.urn}`
    let imageUrl = '/images/default.png'
    if (model.cover) {
        imageUrl = domain.assetUrl(`/channels/${model.channel}/articles/${model.urn}/assets/${model.cover}`)
    }
    return <div className={'middleItem'} key={model.urn}>
        <div className={'itemDetail'}>
            <div className={'itemTitle'}>
                <Link href={readUrl}>{model.title}</Link></div>
            <div className={'description'} title={model.description}>
                {STSubString(model.description || model.body, 100)}
            </div>
            <div className={'action'}>
                <FaEye size={'1rem'}/><span>{model.discover}</span>
                <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(model.update_time)}</span>
            </div>
        </div>
        <div className={'itemCover'}>
            <PSImageServer src={imageUrl} alt={model.title} fill={true}/>
        </div>

    </div>
}
