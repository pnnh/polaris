import {PLSelectData} from "@pnnh/atom";
import {NoData} from "@/components/widget/empty";
import {css} from "@/gen/styled/css";
import {PSFileModel} from "@/components/common/models/file";
import {ImageCard} from "@/components/server/content/images/card";

export async function ImageMiddleBody({selectData, lang}: {
    selectData: PLSelectData<PSFileModel>,
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

const styles = {
    middleBody: css`
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
        gap: 1rem;
    `,
};
