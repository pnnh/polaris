import {PLSelectData} from "@/atom/common/models/protocol";
import {NoData} from "@/components/common/empty";
import {PSArticleModel} from "@/components/common/models/article";
import {uuidToBase58} from "@/atom/common/utils/basex";
import {getDefaultNoteImageByUid} from "@/components/common/note";
import {isValidUUID} from "@/atom/common/utils/uuid";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import {formatRfc3339} from "@/atom/common/utils/datetime";
import {PSImageServer} from "@/components/server/image";
import React from "react";
import styles from './article.module.scss';
import {STSubString} from "@/atom/common/utils/string";
import PSDeleteButton from "@/components/client/console/delete";
import {localText} from "@/atom/common/language";
import PublicIcon from '@mui/icons-material/Public';

export function ConsoleArticleMiddleBody({selectData, lang, portalUrl}: {
    selectData: PLSelectData<PSArticleModel>,
    lang: string,
    portalUrl: string
}) {
    if (!selectData || !selectData.range || selectData.range.length === 0) {
        return <NoData size='large'/>
    }
    return <div className={styles.middleBody}>
        <ArticleHeader lang={lang} portalUrl={portalUrl}/>
        {selectData.range.map((model, index) => {
            return <ArticleCard key={index} model={model} lang={lang} portalUrl={portalUrl}/>
        })}
    </div>
}

export function ArticleHeader({lang, portalUrl}: {
    lang: string,
    portalUrl: string
}) {
    return <div className={styles.tableHeader}>
        <div className={styles.headerLabel}>
            {localText(lang, '封面', 'Cover')}
        </div>
        <div className={styles.headerLabel}>
            {localText(lang, '标题', 'Title')}
        </div>
        <div className={styles.headerLabel}>
            {localText(lang, '描述', 'Description')}
        </div>
        <div className={styles.headerLabel}>
            {localText(lang, '扩展信息', 'Extended Info')}
        </div>
        <div className={styles.headerLabel}>
            {localText(lang, '频道', 'Channel')}
        </div>
        <div className={styles.headerLabel}>
            {localText(lang, '操作', 'Action')}
        </div>
    </div>
}

export function ArticleCard({model, lang, portalUrl}: {
    model: PSArticleModel,
    lang: string,
    portalUrl: string
}) {
    const readUrl = `${lang}/console/articles/${uuidToBase58(model.uid)}`
    let imageUrl = getDefaultNoteImageByUid(model.uid)
    if (model.cover && isValidUUID(model.cover)) {
        imageUrl = `${portalUrl}/articles/${model.uid}/assets/${model.cover}`
    }
    let chanUrl = ''
    if (model.channel) {
        chanUrl = `/${lang}/channels/${uuidToBase58(model.channel)}`
    }
    const deleteUrl = `${portalUrl}/console/articles/${model.uid}`
    return <div className={styles.middleItem} key={model.uid} data-article={model.uid}>
        <div className={styles.itemCover}>
            <PSImageServer lang={lang} src={imageUrl} alt={model.title} fill={true}/>
        </div>
        <div className={styles.itemTitle}>
            <a href={readUrl} title={model.uid}>{model.title}</a>
        </div>
        <div className={styles.description} title={model.description}>
            {STSubString(model.description || model.body, 100)}
        </div>
        <div className={styles.action}>
            <FaEye size={'1rem'}/><span>{model.discover}</span>
            <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(model.update_time)}</span>
            <PublicIcon/><span>{model.lang}</span>
        </div>
        <div>
            <a href={chanUrl}>{model.channel_name}</a>
        </div>
        <div>
            <PSDeleteButton lang={lang} deleteUrl={deleteUrl} resTitle={model.title || model.name}>
                {localText(lang, '删除', 'Delete')}
            </PSDeleteButton>
        </div>
    </div>
}
