import {PLSelectResult, replaceSearchParams, tryBase58ToUuid, uuidToBase58} from "@pnnh/atom";
import React from "react";
import {css} from "@/gen/styled/css";
import {PSFileModel} from "@/components/common/models/file";
import {ResourceCard} from "@/app/[lang]/tools/tool";
import {FileSelectOptions, selectFilePathFromBackend, selectFilesFromBackend} from "@/components/server/tools/tools";

const toolStyles = {
    toolBodyComponent: css`
        width: 1024px;
        margin: 0 auto;
        padding-top: 2rem;
        padding-bottom: 2rem;
    `,
    appGrid: css`
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 1rem;
        width: 100%;
        margin-bottom: 1rem;
        grid-auto-rows: 1fr;
    `,
    appCard: css`
        border: 1px solid #e0e0e0;
        background-color: #ffffff;
        border-radius: 4px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        aspect-ratio: 1/1.2;
        position: relative;
        overflow: hidden;
    `,
}

export async function PSHomeBody({lang, selectResult, searchParams}: {
    lang: string,
    searchParams: Record<string, string>, selectResult: PLSelectResult<PSFileModel>
}) {

    let parent = searchParams.parent
    let parentUid: string | undefined = undefined
    if (parent) {
        parentUid = tryBase58ToUuid(parent)
    }
    return <div className={toolStyles.toolBodyComponent}>
        <PSFilePath lang={lang} uid={parentUid}/>
        <div className={toolStyles.appGrid}>
            {
                selectResult.data.range.map(async (app) => {
                    return <div className={toolStyles.appCard}>
                        <ResourceCard searchParams={searchParams} model={app} lang={lang}/>
                    </div>
                })
            }
        </div>
    </div>
}

const pathStyles = {
    container: css`
        margin-bottom: 1rem;
        background-color: #f3f3f3;
        padding: 0.5rem 1rem;
        border-radius: 4px;
    `,
    dir: css`
        display: inline-block;
    `
}

async function PSFilePath({lang, uid}: { lang: string, uid: string | undefined }) {

    if (!uid) {
        return <div className={pathStyles.container}>
            <div className={pathStyles.dir}>
                <span>/</span>
            </div>
        </div>
    }
    const selectResult = await selectFilePathFromBackend(uid)
    if (!selectResult || !selectResult.data || !selectResult.data.range) {
        return <div>文件不存在</div>
    }
    return <div className={pathStyles.container}>
        {
            selectResult.data.range.map(async (model, index) => {
                const newUrl = `/${lang}?parent=${uuidToBase58(model.uid)}`
                return <div className={pathStyles.dir} key={index}>
                    <span>/</span>
                    <a href={newUrl}>{model.title}</a>
                </div>
            })
        }
    </div>
}
