import {PLSelectResult} from "@/atom/common/models/protocol";
import {NoData} from "@/components/common/empty";
import {IDomain} from "@/services/common/domain";
import {PSArticleModel} from "@/photon/common/models/article";
import {uuidToBase58} from "@/atom/common/utils/basex";
import {getDefaultNoteImageByUid} from "@/services/common/note";
import {isValidUUID} from "@/atom/common/utils/uuid";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import {formatRfc3339} from "@/atom/common/utils/datetime";
import {PSImageServer} from "@/components/server/image";
import React from "react";
import styles from './article.module.scss';
import {STSubString} from "@/atom/common/utils/string";
import Link from "next/link";

export function ConsoleArticleMiddleBody({selectResult, domain, lang}: {
    selectResult: PLSelectResult<PSArticleModel>,
    domain: IDomain,
    lang: string
}) {
    if (!selectResult || !selectResult.data || !selectResult.data.range || selectResult.data.range.length === 0) {
        return <NoData size='large'/>
    }
    return <div className={styles.middleBody}>
        {selectResult.data.range.map((model, index) => {
            return <ArticleCard key={index} model={model} domain={domain} lang={lang}/>
        })}
    </div>
}

export function ArticleCard({model, domain, lang}: {
    model: PSArticleModel,
    domain: IDomain, lang: string
}) {
    const readUrl = `${lang}/console/articles/${uuidToBase58(model.uid || model.uid)}`
    let imageUrl = getDefaultNoteImageByUid(model.uid)
    if (model.cover && isValidUUID(model.cover)) {
        imageUrl = domain.assetUrl(`/articles/${model.uid}/assets/${model.cover}`)
    }
    return <div className={styles.middleItem} key={model.uid}>
        <div className={styles.itemDetail} data-article={model.uid}>
            <div className={styles.itemTitle}>
                <a href={readUrl} title={model.uid}>{model.title}</a>
            </div>
            <div className={styles.description} title={model.description}>
                {STSubString(model.description || model.body, 100)}
            </div>
            <div className={styles.action}>
                <FaEye size={'1rem'}/><span>{model.discover}</span>
                <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(model.update_time)}</span>
            </div>
        </div>
        <div className={styles.itemCover}>
            <PSImageServer src={imageUrl} alt={model.title} fill={true}/>
        </div>
    </div>
}
