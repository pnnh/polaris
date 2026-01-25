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
import queryString from "query-string";
import {FilesystemIcon} from "@/components/icons/gui/filesystem";
import {LibraryIcon} from "@/components/icons/gui/library";

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

function buildUrlWithParams(lang: string, params: Record<string, string | boolean>, name: string, value: string | boolean) {
    const baseUrl = `/${lang}/host/storage/files`
    const newParams = {...params};
    newParams[name] = value;
    const quary = queryString.stringify(newParams);
    return `${baseUrl}?${quary}`;
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
    const layoutType = searchParamsValue.layoutType || 'grid'
    const viewType = searchParamsValue.viewType || 'library'
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const url = `${serverUrl}/host/storage/files?dir=${encodeURIComponent(dir)}&showIgnore=${encodeURIComponent(showIgnore)}&viewType=${encodeURIComponent(viewType)}`
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

                <a href={buildUrlWithParams(lang, searchParamsValue, 'layoutType', 'grid')}
                   title={transTodo('卡片网格视图')} className={toolbarContainerStyles.ignoreIcon}
                   style={layoutType === 'grid' ? {color: 'blue'} : {color: 'black'}}>
                    <GridIcon/>
                </a>
                <a href={buildUrlWithParams(lang, searchParamsValue, 'layoutType', 'table')}
                   title={transTodo('树形表格视图')} className={toolbarContainerStyles.ignoreIcon}
                   style={layoutType === 'table' ? {color: 'blue'} : {color: 'black'}}>
                    <TableIcon/>
                </a>
            </div>
            <div className={toolbarBoxStyles.rightArea}>
                <a href={buildUrlWithParams(lang, searchParamsValue, 'viewType', 'library')}
                   title={transTodo('库视图')} className={toolbarContainerStyles.ignoreIcon}
                   style={viewType === 'library' ? {color: 'blue'} : {color: 'black'}}>
                    <LibraryIcon/>
                </a>
                <a href={buildUrlWithParams(lang, searchParamsValue, 'viewType', 'filesystem')}
                   title={transTodo('文件系统视图')} className={toolbarContainerStyles.ignoreIcon}
                   style={viewType === 'filesystem' ? {color: 'blue'} : {color: 'black'}}>
                    <FilesystemIcon/>
                </a>
                <a href={buildUrlWithParams(lang, searchParamsValue, 'showIgnore', !showIgnore)}
                   title={showIgnore ? transTodo('隐藏忽略文件') : transTodo('显示忽略文件')}>
                    <img className={toolbarContainerStyles.ignoreIcon}
                         src={showIgnore ? '/icons/gui/show.svg' : '/icons/gui/ignore.svg'} alt={'ignore'}/>
                </a>
            </div>
        </div>
        {layoutType === 'grid' ? <GridViewContainer selectResult={selectResult} lang={lang} viewType={viewType}/> :
            <TableViewContainer selectResult={selectResult} lang={lang}/>}

    </div>
}

const notesGrid = css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
`

function GridViewContainer({selectResult, lang, viewType}: {
    selectResult: PLSelectResult<PSFileModel>,
    lang: string,
    viewType: string
}) {
    return <div className={notesGrid}>
        {
            selectResult.data.range.map((model) => {
                return <NoteItemCard lang={lang} model={model} key={model.uid} viewType={viewType}/>
            })
        }
    </div>
}


const cardStyles = {
    cardItem: css`
        border-radius: 8px;
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
        justify-content: center;
    `,
    titleBox: css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

    `
}

function NoteItemCard({lang, model, viewType}: { lang: string, model: PSFileModel, viewType: string }) {
    let linkUrl = `/${lang}/host/storage/files/${model.path}`
    if (model.is_dir) {
        linkUrl = `/${lang}/host/storage/files?dir=${encodeURIComponent(model.path)}`
    }
    return <div className={cardStyles.cardItem} style={model.is_ignore ? {opacity: 0.5} : {}}>
        <div className={cardStyles.iconBox}>
            <CardIcon model={model} viewType={viewType}/>
        </div>
        <div className={cardStyles.actionBar}>
            <div className={cardStyles.titleBox}>
                <a href={linkUrl} title={model.title}>{model.title}</a>
            </div>
        </div>
    </div>
}

function CardIcon({model, viewType}: { model: PSFileModel, viewType: string }) {
    if (model.is_dir) {
        if (model.mimetype === 'polaris/image' && viewType === 'library') {
            return <img src={model.image_url} alt={model.title} className={css`
                height: 6rem;
                width: 6rem;
                object-fit: cover;
                border: solid 1px #e0e0e0;
                border-radius: 8px;
                padding: 2px;
            `}/>
        }
        return <PSDirectoryIcon size={64}/>
    } else if (model.is_image) {
        return <img src={model.url} alt={model.title} className={css`
            height: 6rem;
            width: 6rem;
            object-fit: cover;
        `}/>
    } else {
        return <PSAutoIcon filename={model.title} size={64}/>
    }
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
