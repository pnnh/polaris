import {formatRfc3339, PLSelectData, STSubString, uuidToBase58} from "@pnnh/atom";
import {NoData} from "@/components/widget/empty";
import {PSFileModel} from "@/components/common/models/file";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import React from "react";
import {css} from "@/gen/styled/css";
import PSDeleteButton from "@/components/client/console/delete";
import {transKey} from "@/components/common/locales/normal";

const photoStyles = {
    middleBody: css`
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        width: 100%;
    `,
    tableHeader: css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 8rem;
        gap: 1rem;
        font-weight: bold;
        border-bottom: 1px solid var(--border-color);
        padding: 0.5rem;
    `,
    headerLabel: css`
    `,
    middleItem: css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 8rem;
        gap: 1rem;
        border-bottom: 1px solid var(--border-color);
        padding: 0.5rem;
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

export function ConsolePhotoMiddleBody({selectData, lang, stargateUrl}: {
    selectData: PLSelectData<PSFileModel>,
    lang: string,
    stargateUrl: string
}) {
    if (!selectData || !selectData.range || selectData.range.length === 0) {
        return <NoData size='large'/>
    }
    return <div className={photoStyles.middleBody}>
        <PhotoHeader lang={lang}/>
        {selectData.range.map((model, index) => {
            return <PhotoCard key={index} model={model} lang={lang} stargateUrl={stargateUrl}/>
        })}
    </div>
}

export function PhotoHeader({lang}: {
    lang: string,
}) {
    return <div className={photoStyles.tableHeader}>
        <div className={photoStyles.headerLabel}>
            {transKey(lang, "console.image.title")}
        </div>
        <div className={photoStyles.headerLabel}>
            {transKey(lang, "console.image.description")}
        </div>
        <div className={photoStyles.headerLabel}>
            {transKey(lang, "console.image.extendedInfo")}
        </div>
        <div className={photoStyles.headerLabel}>
            {transKey(lang, "console.image.action")}
        </div>
    </div>
}

export function PhotoCard({model, lang, stargateUrl}: {
    model: PSFileModel,
    lang: string,
    stargateUrl: string
}) {
    const editUrl = `/${lang}/community/images/${uuidToBase58(model.uid)}`
    const deleteUrl = `${stargateUrl}/community/images/${model.uid}`

    return <div className={photoStyles.middleItem} key={model.uid} data-photo={model.uid}>
        <div className={photoStyles.itemTitle}>
            <a href={editUrl} title={model.uid}>{model.title}</a>
        </div>
        <div className={photoStyles.description} title={model.description}>
            {STSubString(model.description || model.body, 100)}
        </div>
        <div className={photoStyles.action}>
            <FaEye size={'1rem'}/><span>{model.discover}</span>
            <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(model.update_time)}</span>
        </div>
        <div className={photoStyles.action}>
            <PSDeleteButton lang={lang} deleteUrl={deleteUrl} resTitle={model.title || model.name}>
                {transKey(lang, "console.common.delete")}
            </PSDeleteButton>
        </div>
    </div>
}
