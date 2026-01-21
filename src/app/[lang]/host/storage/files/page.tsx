import React from 'react'
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {useServerConfig} from "@/components/server/config";
import {PLSelectResult} from "@pnnh/atom";
import {css} from "@/gen/styled/css";
import {PSAutoIcon, PSDirectoryIcon} from "@/components/icons/file-icon";
import {PSFileModel} from "@/components/common/models/file";
import {transTodo} from "@/components/common/locales/normal";
import {GridIcon} from "@/components/icons/gui/grid";
import {TableIcon} from "@/components/icons/gui/table";


const toolbarContainerStyles = {
    toolbarBox: css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
    `,
    ignoreIcon: css`
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 8px;
        cursor: pointer;

        &:hover {
            background-color: #f0f0f0;
            border-radius: 4px;
        }
    `
}

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const paramsValue = await params
    const lang = paramsValue.lang
    const searchParamsValue = await searchParams
    const dir = searchParamsValue.dir
    if (!dir) {
        throw new Error("Not Found")
    }
    const showIgnore = searchParamsValue.showIgnore === 'true'
    const viewType = searchParamsValue.viewType || 'grid'
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const url = `${serverUrl}/host/storage/files?dir=${encodeURIComponent(dir)}&showIgnore=${showIgnore}`
    const selectResult = await serverMakeGet<PLSelectResult<PSFileModel>>(url, '')
    if (!selectResult || selectResult.code !== 200) {
        throw new Error("host notebook")
    }

    const toolbarBoxStyles = {
        leftArea: css`
            display: flex;
            flex-direction: row;
            gap: 8px;
        `,
        rightArea: css`
            display: flex;
            flex-direction: row;
            gap: 8px;
        `
    }
    return <div>
        <div className={toolbarContainerStyles.toolbarBox}>
            <div className={toolbarBoxStyles.leftArea}>

                <a href={`/${lang}/host/storage/files?dir=${encodeURIComponent(dir)}&showIgnore=${showIgnore}&viewType=grid`}
                   title={transTodo('卡片网格视图')} className={toolbarContainerStyles.ignoreIcon}
                   style={viewType === 'grid' ? {color: 'blue'} : {color: 'black'}}>
                    <GridIcon/>
                </a>
                <a href={`/${lang}/host/storage/files?dir=${encodeURIComponent(dir)}&showIgnore=${showIgnore}&viewType=table`}
                   title={transTodo('树形表格视图')} className={toolbarContainerStyles.ignoreIcon}
                   style={viewType === 'table' ? {color: 'blue'} : {color: 'black'}}>
                    <TableIcon/>
                </a>
            </div>
            <div className={toolbarBoxStyles.rightArea}>

                <a href={`/${lang}/host/storage/files?dir=${encodeURIComponent(dir)}&showIgnore=${!showIgnore}`}
                   title={showIgnore ? transTodo('隐藏忽略文件') : transTodo('显示忽略文件')}>
                    <img className={toolbarContainerStyles.ignoreIcon}
                         src={showIgnore ? '/icons/gui/show.svg' : '/icons/gui/ignore.svg'} alt={'ignore'}/>
                </a>
            </div>
        </div>
        {viewType === 'grid' ? <GridViewContainer selectResult={selectResult} lang={lang}/> :
            <TableViewContainer selectResult={selectResult} lang={lang}/>}

    </div>
}

const notesGrid = css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
`

function GridViewContainer({selectResult, lang}: { selectResult: PLSelectResult<PSFileModel>, lang: string }) {
    return <div className={notesGrid}>
        {
            selectResult.data.range.map((model) => {
                return <NoteItemCard lang={lang} model={model} key={model.uid}/>
            })
        }
    </div>
}


const cardStyles = {
    cardItem: css`
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #fafafa;
        transition: box-shadow 0.3s ease;
        position: relative;
    `,
    iconBox: css`
        height: 6rem;
        display: flex;
        justify-content: center;
        align-items: center;
    `,
    actionBar: css`
        height: 2rem;
        width: 100%;
        padding: 0 0.5rem 0 0.5rem;
        display: flex;
        align-items: center;
    `,
    titleBox: css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

    `
}

function NoteItemCard({lang, model}: { lang: string, model: PSFileModel }) {
    let linkUrl = `/${lang}/host/storage/files/${model.path}`
    if (model.is_dir) {
        linkUrl = `/${lang}/host/storage/files?dir=${encodeURIComponent(model.path)}`
    }
    return <div className={cardStyles.cardItem} style={model.is_ignore ? {opacity: 0.5} : {}}>
        <div className={cardStyles.iconBox}>
            {model.is_dir ?
                <PSDirectoryIcon size={64}/> :
                <PSAutoIcon filename={model.title} size={64}/>
            }
        </div>
        <div className={cardStyles.actionBar}>
            <div className={cardStyles.titleBox}>
                {model.is_ignore}
                <a href={linkUrl} title={model.title}>{model.title}</a>
            </div>
        </div>
    </div>
}

const notesTable = css`
    width: 100%;
`

function TableViewContainer({selectResult, lang}: { selectResult: PLSelectResult<PSFileModel>, lang: string }) {
    return <div className={notesTable}>
        <NoteTableHeader lang={lang}/>
        {
            selectResult.data.range.map((model) => {
                return <NoteTableItem lang={lang} model={model} key={model.uid}/>
            })
        }
    </div>
}

const tableItemStyles = {
    tableRow: css`
        display: flex;
        flex-direction: row;
        gap: 1rem;
    `,
    iconBox: css`
        display: flex;
        justify-content: center;
        align-items: center;
    `,
}


function NoteTableHeader({lang}: { lang: string }) {

    return <div className={tableItemStyles.tableRow}>
        <div className={tableItemStyles.iconBox}>
            {transTodo('图标')}
        </div>
        <div>
            {transTodo('文件名')}
        </div>
    </div>
}

function NoteTableItem({lang, model}: { lang: string, model: PSFileModel }) {
    let linkUrl = `/${lang}/host/storage/files/${model.path}`
    if (model.is_dir) {
        linkUrl = `/${lang}/host/storage/files?dir=${encodeURIComponent(model.path)}`
    }
    return <div className={tableItemStyles.tableRow} style={model.is_ignore ? {opacity: 0.5} : {}}>
        <div className={tableItemStyles.iconBox}>
            {model.is_dir ?
                <PSDirectoryIcon size={32}/> :
                <PSAutoIcon filename={model.title} size={32}/>
            }
        </div>
        <div>
            <div>
                {model.is_ignore}
                <a href={linkUrl} title={model.title}>{model.title}</a>
            </div>
        </div>
    </div>
}
