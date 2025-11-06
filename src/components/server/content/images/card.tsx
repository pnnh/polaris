import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import React from "react";
import styles from './card.module.scss'
import {formatRfc3339} from "@/atom/common/utils/datetime";
import {uuidToBase58} from "@/atom/common/utils/basex";
import {PSImageServer} from "@/components/server/image";
import {getDefaultImageUrl, getDefaultNoteImageByUid} from "@/components/common/note";
import {PSImageModel} from "@/components/common/models/image";

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
