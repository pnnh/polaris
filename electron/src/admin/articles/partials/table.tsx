'use client'

import {formatRfc3339} from '@pnnh/atom'
import styles from './table.module.scss'
import React from 'react'
import Link from 'next/link'
import {PLSelectResult} from '@pnnh/polaris-business'
import {PaginationPartial} from '@pnnh/atom-react/client'
import {replaceSearchParams} from '@pnnh/atom'
import {calcPagination} from "@pnnh/atom";
import {channelName, PSArticleModel} from "@pnnh/polaris-business";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export function ArticleTable(props: {
    result: PLSelectResult<PSArticleModel>,
    search: Record<string, string>
}) {
    const result = props.result
    const pagination = calcPagination(result.page, result.count, result.size)
    return <>
        <TableContainer className={styles.tableContainer}>
            <Table className={styles.articleTable}>
                <TableHead>
                    <TableRow>
                        <TableCell className={styles.columnCheck}>
                            <label>
                                <input type="checkbox" className="checkbox"/>
                            </label>
                        </TableCell>
                        <TableCell>文章</TableCell>
                        <TableCell>频道</TableCell>
                        <TableCell className={styles.columnTime}>修改时间</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.result.range.map((item, index) => {
                            return <ArticleTableRow key={index} model={item}/>
                        })
                    }

                </TableBody>
            </Table>
        </TableContainer>
        <PaginationPartial pagination={pagination}
                           calcUrl={(page) => replaceSearchParams(props.search, 'page', page.toString())}/>

    </>
}

function ArticleTableRow({model}: { model: PSArticleModel }) {
    const updateTimeString = formatRfc3339(model.update_time)
    return <TableRow className={styles.articleRow}>
        <TableCell>
            <label>
                <input type="checkbox" className="checkbox"/>
            </label>
        </TableCell>
        <TableCell className={styles.articleTitle}>
            {model.title}
        </TableCell>
        <TableCell className={styles.channelTitle}>
            <Link href={'/'}>{channelName(model.channel)}</Link>
        </TableCell>
        <TableCell>
            {updateTimeString}
        </TableCell>
    </TableRow>
}
