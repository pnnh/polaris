import Link from "next/link";
import React from "react";
import './rank.scss'
import {PLSelectResult} from "@/models/common/common-result";
import {PSArticleModel} from "@/models/common/article";

export function ArticleRankCard({rankResult}: { rankResult: PLSelectResult<PSArticleModel> }) {
    return <div className={'rankCard'}>
        <div className={'rankHeader'}>
            年度阅读排行
        </div>
        <div className={'rankBody'}>
            {
                rankResult && rankResult.range && rankResult.range.length > 0
                    ? rankResult.range.map((model, index) => {
                        const readUrl = `/content/channels/${model.channel}/articles/${model.urn}`
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
