'use client'

import {formatRfc3339} from 'atom'
import './table.scss'
import React from 'react'
import {PLSelectResult} from 'polaris-business'
import {PaginationPartial} from 'atom/client'
import {replaceSearchParams} from 'atom'
import {calcPagination} from "atom";
import {channelName, PSArticleModel} from "polaris-business";

export function ArticleTable(props: {
    result: PLSelectResult<PSArticleModel>,
    search: Record<string, string>
}) {
    const result = props.result
    const pagination = calcPagination(result.page, result.count, result.size)
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
                    props.result.range.map((item, index) => {
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
