'use client'

import './pagination.scss'
import {FullPagination} from "@/common/utils/pagination";

export function PaginationClient(props: { pagination: FullPagination, pageLinkFunc: (page: number) => string }) {
    const pagination = props.pagination
    return <div>
        <div className={'pageList'}>
            <div className={'pageContent'}>
                {pagination.previousPage >= 1
                    ? (<a href={props.pageLinkFunc(pagination.previousPage)}
                          className={'pageItem'}>上一页</a>)
                    : (<></>)}
                {[...Array(pagination.endPage - pagination.startPage + 1).keys()].map((_, index) => {
                    return <a key={`page-${index}`} href={props.pageLinkFunc(pagination.startPage + index)}
                              className={pagination.currentPage === pagination.startPage + index
                                  ? 'pageItemActive'
                                  : 'pageItem'}>{pagination.startPage + index}</a>
                })}
                {pagination.nextPage <= pagination.maxPage
                    ? (<a href={props.pageLinkFunc(pagination.nextPage)}
                          className={'pageItem'}>下一页</a>)
                    : (<></>)}
            </div>
        </div>
    </div>
}
