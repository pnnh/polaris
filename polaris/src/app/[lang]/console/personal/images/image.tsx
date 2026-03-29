import React from "react";
import {getDefaultImageUrl, PSFileModel} from "@/components/common/models/file";
import {NoData} from "@/components/widget/empty";
import {css} from "@/gen/styled/css";
import {PLSelectData} from "@pnnh/atom";

export function ConsoleImageMiddleBody({selectData, libKey, lang}: {
    libKey: string, lang: string,
    selectData: PLSelectData<PSFileModel>
}) {
    if (!selectData) {
        return <>
            <div className={imageStyles.middleBody}>
                加载图片库目录...
            </div>
        </>
    }

    if (!selectData || selectData.count === 0) {
        return <NoData size={'large'}/>
    }

    return <>
        <div className={imageStyles.middleBody}>
            {selectData.range.map((model, index) => {
                return <ImageCard key={index} model={model} lang={lang}/>
            })}
        </div>
    </>
}

export async function ImageCard({model, lang}: {
    model: PSFileModel,
    lang: string
}) {
    let imageUrl = model.url || getDefaultImageUrl()

    return <>
        <div className={imageStyles.imageCard}>
            {imageUrl && <img src={imageUrl} alt={model.name}/>}
        </div>
    </>
}

const imageStyles = {
    middleBody: css`
        display: grid;
        grid-template-columns: repeat(4, minmax(150px, 1fr));
        width: 100%;
    `,
    imageCard: css`
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
