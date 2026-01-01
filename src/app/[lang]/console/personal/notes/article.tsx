import {PLSelectData} from "@pnnh/atom";
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
import PSDeleteButton from "@/components/client/console/delete";
import {localText} from "@pnnh/atom";
import PublicIcon from '@mui/icons-material/Public';
import {transText} from "@/components/common/locales/normal";

export function ConsoleArticleMiddleBody({selectData, lang, publicPortalUrl}: {
    selectData: PLSelectData<PSArticleModel>,
    lang: string,
    publicPortalUrl: string
}) {
    if (!selectData || !selectData.range || selectData.range.length === 0) {
        return <NoData size='large'/>
    }
    return <div className={styles.middleBody}>
        <ArticleHeader lang={lang}/>
        {selectData.range.map((model, index) => {
            return <ArticleCard key={index} model={model} lang={lang} portalUrl={publicPortalUrl}/>
        })}
    </div>
}

export function ArticleHeader({lang}: {
    lang: string,
}) {
    return <div className={styles.tableHeader}>
        <div className={styles.headerLabel}>
            {transText(lang, '封面', 'Cover')}
        </div>
        <div className={styles.headerLabel}>
            {transText(lang, '标题', 'Title')}
        </div>
        <div className={styles.headerLabel}>
            {transText(lang, '描述', 'Description')}
        </div>
        <div className={styles.headerLabel}>
            {transText(lang, '扩展信息', 'Extended Info')}
        </div>
        <div className={styles.headerLabel}>
            {transText(lang, '频道', 'Channel')}
        </div>
        <div className={styles.headerLabel}>
            {transText(lang, '操作', 'Action')}
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
