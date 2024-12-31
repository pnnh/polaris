import Link from "next/link";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import React from "react";
import {IDomain} from "@/services/common/domain";
import './card.scss'
import { PSArticleModel} from "@/models/common/article";
import {STSubString} from "@/atom/common/utils/string";
import {formatRfc3339} from "@/atom/common/utils/datetime";
import { uuidToBase58} from "@/atom/common/utils/basex";

export function ArticleCard({model, domain, lang}: { model: PSArticleModel, domain: IDomain, lang: string }) {
    const readUrl = `/articles/${uuidToBase58(model.urn)}`
    let imageUrl = '/images/default.png'
    if (model.cover) {
        imageUrl = domain.assetUrl(`/articles/${model.channel}/articles/${model.urn}/assets/${model.cover}`)
    }
    return <div className={'middleItem'} key={model.urn}>
        <div className={'itemDetail'}>
            <div className={'itemTitle'}>
                <Link href={readUrl} title={model.urn}>{model.title}</Link></div>
            <div className={'description'} title={model.description}>
                {STSubString(model.description || model.body, 100)}
            </div>
            <div className={'action'}>
                <FaEye size={'1rem'}/><span>{model.discover}</span>
                <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(model.update_time)}</span>
            </div>
        </div>
        {/*<div className={'itemCover'}>*/}
        {/*    <PSImageServer src={imageUrl} alt={model.title} fill={true}/>*/}
        {/*</div>*/}
    </div>
}
