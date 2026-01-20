import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import React from "react";
import {css} from "@/gen/styled/css";
import {formatRfc3339, uuidToBase58} from "@pnnh/atom";
import {PSImageServer} from "@/components/server/image";
import {getDefaultImageUrl} from "@/components/common/note";
import {PSImageModel} from "@/components/common/models/image";

const styles = {
    middleItem: css`
        border-bottom: solid 1px #e4e6eb80;
    `,
    imageCover: css`
        flex-shrink: 0;
        position: relative;
        margin-right: 1rem;
        & img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 2px;
        }
    `,
    imageInfo: css`
        display: flex;
        padding: 0.5rem 1rem;
        flex-direction: column;
        justify-content: flex-start;
        flex-grow: 1;
    `,
    itemTitle: css`
        height: 1.5rem;
        flex-shrink: 0;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        color: #252933;
        overflow: hidden;
        & a {
            color: #252933;
            text-decoration: none;
        }
    `,
    action: css`
        height: 1rem;
        color: #8a919f;
        font-size: 12px;
        line-height: 22px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 6px;
    `,
};

export function ImageCard({model, lang}: {
    model: PSImageModel, lang: string,
}) {
    const readUrl = `${lang}/images/${uuidToBase58(model.uid || model.uid)}`
    let imageUrl = model.file_url || getDefaultImageUrl()

    return <div className={styles.middleItem} key={model.uid}>
        <div className={styles.imageCover} data-article={model.uid}>
            <PSImageServer lang={lang} src={imageUrl} alt={model.title} fill={true}/>
        </div>
        <div className={styles.imageInfo}>
            <div className={styles.itemTitle}>
                <a href={readUrl} title={model.uid}>{model.title}</a></div>
            <div className={styles.action}>
                <FaEye size={'1rem'}/><span>{model.discover}</span>
                <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(model.update_time)}</span>
            </div>
        </div>
    </div>
}
