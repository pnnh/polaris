import {PLSelectResult, tryBase58ToUuid, uuidToBase58} from "@pnnh/atom";
import React from "react";
import {css} from "@/gen/styled/css";
import {PSFileModel} from "@/components/common/models/file";
import {ResourceCard} from "@/components/community/resource";
import {selectFilePathFromBackend} from "@/components/community/files";

export async function PSHomeBody({lang, selectResult, searchParams}: {
    lang: string,
    searchParams: Record<string, string>, selectResult: PLSelectResult<PSFileModel>
}) {

    let parent = searchParams.parent
    let parentUid: string | undefined = undefined
    if (parent) {
        parentUid = tryBase58ToUuid(parent)
    }
    return <div className={resStyles.resBodyComponent}>
        <PSFilePath lang={lang} uid={parentUid}/>
        <div className={resStyles.resGrid}>
            {
                selectResult.data.range.map(async (fileModel) => {
                    return <div className={resStyles.resCard}>
                        <ResourceCard searchParams={searchParams} model={fileModel} lang={lang}/>
                    </div>
                })
            }
        </div>
    </div>
}

const resStyles = {
    resBodyComponent: css`
        width: 100%;
        max-width: 80rem;
        margin: 0 auto;
        padding: 1.5rem 1rem 2rem;
        @media screen and (min-width: 48rem) {
            padding: 2rem 1.5rem;
        }
        @media screen and (min-width: 80rem) {
            padding: 2rem;
        }
    `,
    resGrid: css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.875rem;
        width: 100%;
        margin-bottom: 1rem;
        @media screen and (min-width: 48rem) {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }
        @media screen and (min-width: 80rem) {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.25rem;
        }
    `,
    resCard: css`
        background-color: var(--background-color);
        border-radius: 12px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.25s ease, transform 0.25s ease;

    `,
}

const pathStyles = {
    container: css`
        margin-bottom: 1.25rem;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.25rem;
        padding: 0.5rem 0.875rem;
        background-color: var(--action-hover-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        font-size: 0.875rem;
        color: var(--text-secondary-color);
    `,
    dir: css`
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;

        & a {
            color: var(--primary-color);
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
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
