import Link from "next/link";
import React from "react";
import './rank.scss'
import {PLSelectResult} from "@/atom/common/models/protocol";
import {PSArticleModel} from "@/atom/common/models/article";

export function ArticleRankCard({rankResult, lang}: { rankResult: PLSelectResult<PSArticleModel>, lang: string }) {
    return <div className={'rankCard'}>
        <div className={'rankHeader'}>
            年度阅读排行
        </div>
        <div className={'rankBody'}>
            {
                rankResult && rankResult.data && rankResult.data.range && rankResult.data.range.length > 0
                    ? rankResult.data.range.map((model, index) => {
                        const readUrl = `/${lang}/content/articles/${model.channel}/articles/${model.uid}`
                        return <div key={index} className={'rankItem'}>
                            <div
                                className={'rankIndex' + (index <= 2 ? ' rankTop' : '')}>{index + 1}</div>
                            <div className={'rankTitle'}>
                                <a href={readUrl} title={model.title}>{model.title}</a>
                            </div>
                        </div>
                    })
                    : '暂无'
            }
        </div>
    </div>
}
