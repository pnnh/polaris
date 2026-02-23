import {PLSelectResult, replaceSearchParams} from "@pnnh/atom";
import React from "react";
import {css} from "@/gen/styled/css";
import {PSFileModel} from "@/components/common/models/file";
import {ResourceCard} from "@/app/[lang]/tools/tool";

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
        aspect-ratio: 1/0.8;
        position: relative;
        overflow: hidden;
    `,
}

export async function PSHomeBody({lang, selectResult, searchParams}: {
    lang: string,
    searchParams: Record<string, string>, selectResult: PLSelectResult<PSFileModel>
}) {
    return <div className={toolStyles.toolBodyComponent}>
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
