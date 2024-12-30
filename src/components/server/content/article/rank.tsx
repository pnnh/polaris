import Link from "next/link";
import React from "react";
import './rank.scss'
import {PLSelectResult} from "@/models/common/protocol";
import {PSArticleModel} from "@/models/common/article";

export function ArticleRankCard({rankResult, lang}: { rankResult: PLSelectResult<PSArticleModel>, lang: string }) {
    return <div className={'rankCard'}>
        <div className={'rankHeader'}>
            年度阅读排行
        </div>
        <div className={'rankBody'}>
            {
                rankResult && rankResult.data && rankResult.data.range && rankResult.data.range.length > 0
                    ? rankResult.data.range.map((model, index) => {
                        const readUrl = `/${lang}/content/articles/${model.channel}/articles/${model.urn}`
                        return <div key={model.urn} className={'rankItem'}>
                            <div
                                className={'rankIndex' + (index <= 2 ? ' rankTop' : '')}>{index + 1}</div>
                            <div className={'rankTitle'}>
                                <Link
                                    href={readUrl}
                                    title={model.title}>{model.title}</Link>
                            </div>
                        </div>
                    })
                    : '暂无'
            }
        </div>
    </div>
}
