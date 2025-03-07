import {FullPagination} from "@/atom/common/utils/pagination";
import styles from './pagination.module.scss'

export function PaginationServer(props: { pagination: FullPagination, pageLinkFunc: (page: number) => string }) {
    const pagination = props.pagination
    return <div>
        <div className={styles.pageList}>
            <div className={styles.pageContent}>
                {pagination.previousPage >= 1
                    ? (<a href={props.pageLinkFunc(pagination.previousPage)}
                          className={styles.stylePageItem}>上一页</a>)
                    : (<></>)}
                {[...Array(pagination.endPage - pagination.startPage + 1).keys()].map((_, index) => {
                    return <a key={`page-${index}`} href={props.pageLinkFunc(pagination.startPage + index)}
                              className={pagination.currentPage === pagination.startPage + index
                                  ? styles.stylePageItemActive
                                  : styles.stylePageItem}>{pagination.startPage + index}</a>
                })}
                {pagination.nextPage <= pagination.maxPage
                    ? (<a href={props.pageLinkFunc(pagination.nextPage)}
                          className={styles.stylePageItem}>下一页</a>)
                    : (<></>)}
            </div>
        </div>
    </div>
}
