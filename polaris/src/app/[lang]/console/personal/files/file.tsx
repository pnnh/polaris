import React from "react";
import {NoData} from "@/components/common/empty";
import {css} from "@/gen/styled/css";
import {PLSelectData} from "@pnnh/atom";
import {getDefaultImageUrl} from "@/components/common/note"
import {PSFileModel} from "@/components/common/models/file";

export function ConsoleFileMiddleBody({selectData, libKey, lang}: {
    libKey: string, lang: string,
    selectData: PLSelectData<PSFileModel>
}) {
    if (!selectData) {
        return <>
            <div className={fileStyles.middleBody}>
                加载图片库目录...
            </div>
        </>
    }

    if (!selectData || selectData.count === 0) {
        return <NoData size={'large'}/>
    }

    return <>
        <div className={fileStyles.middleBody}>
            {selectData.range.map((model, index) => {
                return <FileCard key={index} model={model} lang={lang}/>
            })}
        </div>
    </>
}

async function FileCard({model, lang}: {
    model: PSFileModel,
    lang: string
}) {
    let fileUrl = model.url || getDefaultImageUrl()

    return <>
        <div className={fileStyles.fileCard}>
            {fileUrl && <img src={fileUrl} alt={model.name}/>}
        </div>
    </>
}

const fileStyles = {
    middleBody: css`
        display: grid;
        grid-template-columns: repeat(4, minmax(150px, 1fr));
        width: 100%;
    `,
    fileCard: css`
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        & img {
            height: 8rem;
            width: 8rem;
            object-fit: cover;
        }
    `
}
