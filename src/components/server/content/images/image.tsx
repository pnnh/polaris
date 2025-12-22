import {PLSelectData} from "@/atom/common/models/protocol";
import {NoData} from "@/components/common/empty";
import {css} from '@emotion/css'
import {PSImageModel} from "@/components/common/models/image";
import {ImageCard} from "@/components/server/content/images/card";

const styles = {
    middleBody: css`
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
        gap: 1rem;
    `
};

export async function ImageMiddleBody({selectData, lang}: {
    selectData: PLSelectData<PSImageModel>,
    lang: string,
}) {
    if (!selectData || !selectData.range || selectData.range.length === 0) {
        return <NoData size='large'/>
    }
    return <div className={styles.middleBody}>
        {selectData.range.map((model, index) => {
            return <ImageCard key={index} model={model} lang={lang}/>
        })}
    </div>
}
