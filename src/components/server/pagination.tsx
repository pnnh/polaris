import {FullPagination} from "@/atom/common/utils/pagination";
import styles from './pagination.module.scss'
import {localText} from "@/atom/common/language";

export function PaginationServer({lang, pagination, pageLinkFunc}:
                                 {
                                     lang: string,
                                     pagination: FullPagination,
                                     pageLinkFunc: (page: number) => string
                                 }) {
    return <div className={styles.pageList}>
        <div className={styles.pageContent}>
            {pagination.previousPage >= 1
                ? (<a href={pageLinkFunc(pagination.previousPage)}
                      className={styles.stylePageItem}>
                    {localText(lang, '上一页', 'Previous Page')}
                </a>)
                : (<></>)}
            {[...Array(pagination.endPage - pagination.startPage + 1).keys()].map((_, index) => {
                return <a key={`page-${index}`} href={pageLinkFunc(pagination.startPage + index)}
                          className={pagination.currentPage === pagination.startPage + index
                              ? styles.stylePageItemActive
                              : styles.stylePageItem}>{pagination.startPage + index}</a>
            })}
            {pagination.nextPage <= pagination.maxPage
                ? (<a href={pageLinkFunc(pagination.nextPage)}
                      className={styles.stylePageItem}>
                    {localText(lang, '下一页', 'Next Page')}
                </a>)
                : (<></>)}
        </div>
    </div>
}
