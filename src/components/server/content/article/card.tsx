import Link from "next/link";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import React from "react";
import {IDomain} from "@/services/common/domain";
import './card.scss'
import {PSArticleModel} from "@/atom/common/models/article";
import {STSubString} from "@/atom/common/utils/string";
import {formatRfc3339} from "@/atom/common/utils/datetime";
import {uuidToBase58} from "@/atom/common/utils/basex";
import {PSImageServer} from "@/components/server/image";
import {getDefaultNoteImageByUid} from "@/services/common/note";
import {isValidUUID} from "@/atom/common/utils/uuid";

export function ArticleCard({model, domain, lang, dir}: {
    model: PSArticleModel,
    domain: IDomain, lang: string, dir: string
}) {
    const readUrl = `${lang}/articles/${dir}/${uuidToBase58(model.uid || model.uid)}`
    let imageUrl = getDefaultNoteImageByUid(model.uid)
    if (model.cover && isValidUUID(model.cover)) {
        imageUrl = domain.assetUrl(`/articles/${model.uid}/assets/${model.cover}`)
    }
    return <div className={'middleItem'} key={model.uid}>
        <div className={'itemDetail'} data-article={model.uid}>
            <div className={'itemTitle'}>
                <a href={readUrl} title={model.uid}>{model.title}</a></div>
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
