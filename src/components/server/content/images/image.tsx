import {PLSelectData, PLSelectResult} from "@/atom/common/models/protocol";
import {NoData} from "@/components/common/empty";
import styles from './image.module.scss'
import {PSImageModel} from "@/components/common/models/image";
import {ImageCard} from "@/components/server/content/images/card";

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
