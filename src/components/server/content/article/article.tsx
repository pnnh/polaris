import {PLSelectResult} from "@pnnh/atom";
import {NoData} from "@/components/common/empty";
import {PSArticleModel} from "@/components/common/models/article";
import {uuidToBase58} from "@pnnh/atom";
import {getDefaultNoteImageByUid} from "@/components/common/note";
import {isValidUUID} from "@pnnh/atom";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import {formatRfc3339} from "@pnnh/atom";
import {PSImageServer} from "@/components/server/image";
import React from "react";
import styles from './article.module.scss';
import {STSubString} from "@pnnh/atom";

export function ArticleMiddleBody({selectResult, lang}: {
    selectResult: PLSelectResult<PSArticleModel>,
    lang: string
}) {
    if (!selectResult || !selectResult.data || !selectResult.data.range || selectResult.data.range.length === 0) {
        return <NoData size='large'/>
    }
    return <div className={styles.middleBody}>
        {selectResult.data.range.map((model, index) => {
            return <ArticleCard key={index} model={model} lang={lang}/>
        })}
    </div>
}

export function ArticleCard({model, lang}: {
    model: PSArticleModel, lang: string
}) {
    let readUrl = `${lang}/articles/${uuidToBase58(model.uid)}`
    if (model.header === 'MTLink') {
        readUrl = model.body
    }
    let imageUrl = getDefaultNoteImageByUid(model.uid)
    if (model.cover && isValidUUID(model.cover)) {
        imageUrl = `/articles/${model.uid}/assets/${model.cover}`
    }
    return <div className={styles.middleItem} key={model.uid}>
        <div className={styles.itemDetail} data-article={model.uid}>
            <div className={styles.itemTitle}>
                <a href={readUrl} title={model.uid}>{model.title}</a></div>
            <div className={styles.description} title={model.description}>
                {STSubString(model.description || model.body, 100)}
            </div>
            <div className={styles.action}>
                <FaEye size={'1rem'}/><span>{model.discover}</span>
                <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(model.update_time)}</span>
            </div>
        </div>
        <div className={styles.itemCover}>
            <PSImageServer lang={lang} src={imageUrl} alt={model.title} fill={true}/>
        </div>
    </div>
}
