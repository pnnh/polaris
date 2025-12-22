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
import {css} from '@emotion/css';
import {STSubString} from "@/atom/common/utils/string";
import PSDeleteButton from "@/components/client/console/delete";
import PublicIcon from '@mui/icons-material/Public';
import {transText} from "@/components/common/locales/normal";

const styles = {
    middleBody: css`
        width: 100%;
        background: var(--background-color);
    `,
    tableHeader: css`
        width: 100%;
        height: 3rem;
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        justify-content: space-between;
        border-bottom: solid 1px #e4e6eb80;
        padding: 0 1rem;
        background: var(--background-color);
        color: var(--text-primary-color);
    `,
    headerLabel: css`
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
    `,
    middleItem: css`
        width: 100%;
        height: 4rem;
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        justify-content: space-between;
        border-bottom: solid 1px #e4e6eb80;
        padding: 0 1rem;
    `,
    itemTitle: css`
        flex-shrink: 0;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        color: var(--text-primary-color);
        padding-left: 1rem;

        a {
            width: 10rem;
            display: inline-block;
            height: 1.5rem;
            color: var(--text-primary-color);
            text-decoration: none;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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
        width: 10rem;
        flex-shrink: 0;
        color: var(--text-primary-color);
        font-size: 12px;
        line-height: 22px;
        gap: 0.25rem;
        display: flex;
        flex-direction: row;
        align-items: center;
    `,
    itemCover: css`
        height: 3rem;
        width: 3rem;
        flex-shrink: 0;
        position: relative;
        margin-right: 1rem;

        img {
            width: 3rem;
            height: 3rem;
            object-fit: cover;
            border-radius: 2px;
        }
    `
};

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
            return <ArticleCard key={index} model={model} lang={lang} publicPortalUrl={publicPortalUrl}/>
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

export function ArticleCard({model, lang, publicPortalUrl}: {
    model: PSArticleModel,
    lang: string,
    publicPortalUrl: string
}) {
    const readUrl = `${lang}/console/community/articles/${uuidToBase58(model.uid)}`
    let imageUrl = getDefaultNoteImageByUid(model.uid)
    if (model.cover && isValidUUID(model.cover)) {
        imageUrl = `${publicPortalUrl}/articles/${model.uid}/assets/${model.cover}`
    }
    let chanUrl = ''
    if (model.channel) {
        chanUrl = `/${lang}/channels/${uuidToBase58(model.channel)}`
    }
    const deleteUrl = `${publicPortalUrl}/console/community/articles/${model.uid}?action=delete`
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
                {transText(lang, '删除', 'Delete')}
            </PSDeleteButton>
        </div>
    </div>
}
