'use client'

import './table.scss'
import React from 'react'
import {PLSelectResult} from "@/models/common/protocol";
import {channelName, PSArticleModel} from "@/models/common/article";
import {PaginationPartial} from "@/components/common/pagination";
import {NoData} from "@/components/common/empty";
import {formatRfc3339} from "@/atom/common/utils/datetime";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {calcPagination} from "@/atom/common/utils/pagination";

export function AdminArticleTable(props: {
    result: PLSelectResult<PSArticleModel>,
    search: Record<string, string>
}) {
    const result = props.result
    if (!result || !result.data || !result.data.range) {
        return <NoData size={'middle'}/>
    }
    const pagination = calcPagination(result.data.page, result.data.count, result.data.size)
    return <>
        <div className={'tableContainer'}>
            <table className={'articleTable'}>
                <thead>
                <tr>
                    <th className={'columnCheck'}>
                        <label>
                            <input type="checkbox" className="checkbox"/>
                        </label>
                    </th>
                    <th>文章</th>
                    <th>频道</th>
                    <th className={'columnTime'}>修改时间</th>
                </tr>
                </thead>
                <tbody>
                {
                    props.result.data.range.map((item, index) => {
                        return <ArticleTableRow key={index} model={item}/>
                    })
                }
                </tbody>
            </table>
        </div>
        <PaginationPartial pagination={pagination}
                           calcUrl={(page) => replaceSearchParams(props.search, 'page', page.toString())}/>

    </>
}

function ArticleTableRow({model}: { model: PSArticleModel }) {
    const updateTimeString = formatRfc3339(model.update_time)
    return <tr className={'articleRow'}>
        <td>
            <label>
                <input type="checkbox" className="checkbox"/>
            </label>
        </td>
        <td className={'articleTitle'}>
            {model.title}
        </td>
        <td className={'channelTitle'}>
            <a href={'/'}>{channelName(model.channel)}</a>
        </td>
        <td>
            {updateTimeString}
        </td>
    </tr>
}
