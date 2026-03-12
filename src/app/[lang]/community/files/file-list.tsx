import {formatRfc3339, PLSelectData, STSubString, uuidToBase58} from "@pnnh/atom";
import {NoData} from "@/components/common/empty";
import {CmFileModel} from "@/components/common/models/file";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import React from "react";
import {css} from "@/gen/styled/css";
import PSDeleteButton from "@/components/client/console/delete";
import {transKey} from "@/components/common/locales/normal";
import Button from "@mui/material/Button";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EditDocumentIcon from '@mui/icons-material/EditDocument';

const fileStyles = {
    middleBody: css`
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        width: 100%;
    `,
    tableHeader: css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 8rem;
        gap: 1rem;
        font-weight: bold;
        border-bottom: 1px solid var(--border-color);
        padding: 0.5rem;
    `,
    headerLabel: css`
    `,
    middleItem: css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 8rem;
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
    mimetype: css`
        display: flex;
        align-items: center;
        font-size: 0.8rem;
        color: var(--text-secondary-color);
    `,
    action: css`
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `
}

export function ConsoleFileMiddleBody({selectData, lang, stargateUrl}: {
    selectData: PLSelectData<CmFileModel>,
    lang: string,
    stargateUrl: string
}) {
    if (!selectData || !selectData.range || selectData.range.length === 0) {
        return <NoData size='large'/>
    }
    return <div className={fileStyles.middleBody}>
        <FileHeader lang={lang}/>
        {selectData.range.map((model, index) => {
            return <FileCard key={index} model={model} lang={lang} stargateUrl={stargateUrl}/>
        })}
    </div>
}

export function FileHeader({lang}: { lang: string }) {
    return <div className={fileStyles.tableHeader}>
        <div className={fileStyles.headerLabel}>{transKey(lang, "console.file.title")}</div>
        <div className={fileStyles.headerLabel}>{transKey(lang, "console.file.description")}</div>
        <div className={fileStyles.headerLabel}>{transKey(lang, "console.file.mimetype")}</div>
        <div className={fileStyles.headerLabel}>{transKey(lang, "console.file.extendedInfo")}</div>
        <div className={fileStyles.headerLabel}>{transKey(lang, "console.file.action")}</div>
    </div>
}

export function FileCard({model, lang, stargateUrl}: {
    model: CmFileModel,
    lang: string,
    stargateUrl: string
}) {
    const prettyUid = uuidToBase58(model.uid)
    const editUrl = `/${lang}/community/files/edit?uid=${prettyUid}`
    const deleteUrl = `${stargateUrl}/community/files/${model.uid}`
    const subDirUrl = `/${lang}/community/files?parent=${encodeURIComponent(prettyUid)}`
    const viewUrl = `/${lang}/community/files/view?uid=${encodeURIComponent(prettyUid)}`

    return <div className={fileStyles.middleItem} key={model.uid} data-file={model.uid}>
        <div className={fileStyles.itemTitle}>
            {
                model.mimetype === 'directory' || model.mimetype === 'folder' ?
                    <FolderOpenIcon/> : <InsertDriveFileIcon/>
            }
            {
                model.mimetype === 'directory' || model.mimetype === 'folder' ?
                    <a href={subDirUrl} title={model.uid}>{model.title}</a>
                    : <a href={viewUrl}>{model.title}</a>}
        </div>
        <div className={fileStyles.description} title={model.description}>
            {STSubString(model.description || '', 100)}
        </div>
        <div className={fileStyles.mimetype}>
            {model.mimetype || '—'}
        </div>
        <div className={fileStyles.action}>
            <FaEye size={'1rem'}/><span>{model.discover}</span>
            <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(model.update_time)}</span>
        </div>
        <div className={fileStyles.action}>
            <Button size={'small'} href={editUrl} title={editUrl}>
                <EditDocumentIcon/>
            </Button>
            <PSDeleteButton lang={lang} deleteUrl={deleteUrl} resTitle={model.title}>
                {transKey(lang, "console.common.delete")}
            </PSDeleteButton>
        </div>
    </div>
}
