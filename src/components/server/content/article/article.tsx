import {formatRfc3339, isValidUUID, PLSelectResult, STSubString, uuidToBase58} from "@pnnh/atom";
import {NoData} from "@/components/common/empty";
import {PSArticleModel} from "@/components/common/models/article";
import {getDefaultNoteImageByUid} from "@/components/common/note";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import {PSImageServer} from "@/components/server/image";
import React from "react";
import {css} from "@/gen/styled/css";

const styles = {
    middleBody: css`
        width: 100%;
    `,
    middleItem: css`
        width: 100%;
        height: 10rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 1px #e4e6eb80;
        gap: 1rem;
    `,
    itemDetail: css`
        display: flex;
        padding: 0.5rem 1rem;
        flex-direction: column;
        justify-content: flex-start;
        flex-grow: 1;
        height: 8rem;
    `,
    itemTitle: css`
        height: 1.5rem;
        flex-shrink: 0;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        color: var(--text-primary-color);
        overflow: hidden;
        & a {
            color: var(--text-primary-color);
            text-decoration: none;
        }
    `,
    description: css`
        flex-grow: 1;
        color: var(--text-primary-color);
        font-size: 13px;
        line-height: 22px;
        margin-top: 1rem;
        margin-bottom: 1rem;
        overflow: hidden;
    `,
    action: css`
        height: 1rem;
        color: var(--text-primary-color);
        font-size: 12px;
        line-height: 22px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 6px;
    `,
    itemCover: css`
        flex-shrink: 0;
        width: 12rem;
        height: 8rem;
        position: relative;
        margin-right: 1rem;
        & img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 2px;
        }
    `,
};

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
