import {formatRfc3339, isValidUUID, PLSelectData, STSubString, uuidToBase58} from "@pnnh/atom";
import {NoData} from "@/components/common/empty";
import {PSArticleModel} from "@/components/common/models/article";
import {getDefaultNoteImageByUid} from "@/components/common/note";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import {PSImageServer} from "@/components/server/image";
import React from "react";
import {css} from "@/gen/styled/css";
import PSDeleteButton from "@/components/client/console/delete";
import PSSyncButton from "@/components/client/console/sync";
import PublicIcon from '@mui/icons-material/Public';
import {transKey} from "@/components/common/locales/normal";

const articleStyles = {
    middleBody: css`
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    `,
    tableHeader: css`
        display: grid;
        grid-template-columns: 10rem 1fr 1fr 1fr 1fr 8rem;
        gap: 1rem;
        font-weight: bold;
        border-bottom: 1px solid var(--border-color);
        padding: 0.5rem;
    `,
    headerLabel: css`
    `,
    middleItem: css`
        display: grid;
        grid-template-columns: 10rem 1fr 1fr 1fr 1fr 8rem;
        gap: 1rem;
        border-bottom: 1px solid var(--border-color);
        padding: 0.5rem;
    `,
    itemCover: css`
        width: 10rem;
        height: 6rem;
        position: relative;
        border-radius: 0.5rem;
        overflow: hidden;
    `,
    itemTitle: css`
        display: flex;
        align-items: center;
    `,
    description: css`
        display: flex;
        align-items: center;
    `,
    action: css`
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `
}

export function ConsoleArticleMiddleBody({selectData, lang, stargateUrl}: {
    selectData: PLSelectData<PSArticleModel>,
    lang: string,
    stargateUrl: string
}) {
    if (!selectData || !selectData.range || selectData.range.length === 0) {
        return <NoData size='large'/>
    }
    return <div className={articleStyles.middleBody}>
        <ArticleHeader lang={lang}/>
        {selectData.range.map((model, index) => {
            return <ArticleCard key={index} model={model} lang={lang} stargateUrl={stargateUrl}/>
        })}
    </div>
}

export function ArticleHeader({lang}: {
    lang: string,
}) {
    return <div className={articleStyles.tableHeader}>
        <div className={articleStyles.headerLabel}>
            {transKey(lang, "console.article.cover")}
        </div>
        <div className={articleStyles.headerLabel}>
            {transKey(lang, "console.article.title")}
        </div>
        <div className={articleStyles.headerLabel}>
            {transKey(lang, "console.article.description")}
        </div>
        <div className={articleStyles.headerLabel}>
            {transKey(lang, "console.article.extendedInfo")}
        </div>
        <div className={articleStyles.headerLabel}>
            {transKey(lang, "common.channels")}
        </div>
        <div className={articleStyles.headerLabel}>
            {transKey(lang, "console.article.action")}
        </div>
    </div>
}

export function ArticleCard({model, lang, stargateUrl}: {
    model: PSArticleModel,
    lang: string,
    stargateUrl: string
}) {
    const readUrl = `${lang}/community/articles/${uuidToBase58(model.uid)}`
    let imageUrl = getDefaultNoteImageByUid(model.uid)
    if (model.cover && isValidUUID(model.cover)) {
        imageUrl = `${stargateUrl}/articles/${model.uid}/assets/${model.cover}`
    }
    let chanUrl = ''
    if (model.channel) {
        chanUrl = `/${lang}/channels/${uuidToBase58(model.channel)}`
    }
    const deleteUrl = `${stargateUrl}/community/articles/${model.uid}`
    const syncUrl = `${stargateUrl}/community/articles/${model.uid}/sync`
    // @ts-ignore - has_note is added by SQL query
    const hasNote = model.has_note === true || model.has_note === 'true' || model.has_note === 't';

    return <div className={articleStyles.middleItem} key={model.uid} data-article={model.uid}>
        <div className={articleStyles.itemCover}>
            <PSImageServer src={imageUrl} alt={model.title} fill={true}/>
        </div>
        <div className={articleStyles.itemTitle}>
            <a href={readUrl} title={model.uid}>{model.title}</a>
        </div>
        <div className={articleStyles.description} title={model.description}>
            {STSubString(model.description || model.body, 100)}
        </div>
        <div className={articleStyles.action}>
            <FaEye size={'1rem'}/><span>{model.discover}</span>
            <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(model.update_time)}</span>
            <PublicIcon/><span>{model.lang}</span>
        </div>
        <div>
            <a href={chanUrl}>{model.channel_name}</a>
        </div>
        <div className={articleStyles.action}>
            {hasNote && (
                <PSSyncButton lang={lang} syncUrl={syncUrl} resTitle={model.title || model.name}>
                    {transKey(lang, "console.article.sync")}
                </PSSyncButton>
            )}
            <PSDeleteButton lang={lang} deleteUrl={deleteUrl} resTitle={model.title || model.name}>
                {transKey(lang, "console.common.delete")}
            </PSDeleteButton>
        </div>
    </div>
}
