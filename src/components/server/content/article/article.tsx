import {PLSelectResult} from "@/atom/common/models/protocol";
import {NoData} from "@/components/common/empty";
import {IDomain} from "@/services/common/domain";
import {ArticleCard} from "@/components/server/content/article/card";
import {PSArticleModel} from "@/atom/common/models/article";

export function ArticleMiddleBody({selectResult, domain, lang, dir}: {
    selectResult: PLSelectResult<PSArticleModel>,
    domain: IDomain,
    lang: string,
    dir: string
}) {
    if (!selectResult || !selectResult.data || !selectResult.data.range || selectResult.data.range.length === 0) {
        return <NoData size='large'/>
    }
    return selectResult.data.range.map((model, index) => {
        return <ArticleCard key={index} model={model} domain={domain} lang={lang} dir={dir}/>
    })
}
