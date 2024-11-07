import {FullPagination} from "@pnnh/atom";
import {css} from "@emotion/css";

const styles = {
    pageList: css({
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        margin: '0 auto',
        listStyle: 'none',
        padding: '0 16px 0 16px',
    }),
    pageContent: css({
        margin: '0.5rem'
    }),
    pageItem: css({
        padding: '8px',
        marginRight: '4px',
        minWidth: '16px',
        textDecoration: 'none',
        textAlign: 'center',
        color: '#000000',
        width: '32px',
        height: '32px',
    }),
    pageItemActive: css({
        backgroundColor: 'rgba(42, 142, 224, 0.84)',
        display: 'inline-block',
        minWidth: '16px',
        textDecoration: 'none',
        width: '32px',
        textAlign: 'center',
        color: '#FFFFFF',
    })
}
 
export function PaginationClient(props: { pagination: FullPagination, pageLinkFunc: (page: number) => string }) {
    const pagination = props.pagination
    return <div>
        <div className={styles.pageList}>
            <div className={styles.pageContent}>
                {pagination.previousPage >= 1
                    ? (<a href={props.pageLinkFunc(pagination.previousPage)}
                          className={styles.pageItem}>上一页</a>)
                    : (<></>)}
                {[...Array(pagination.endPage - pagination.startPage + 1).keys()].map((_, index) => {
                    return <a key={`page-${index}`} href={props.pageLinkFunc(pagination.startPage + index)}
                              className={pagination.currentPage === pagination.startPage + index
                                  ? styles.pageItemActive
                                  : styles.pageItem}>{pagination.startPage + index}</a>
                })}
                {pagination.nextPage <= pagination.maxPage
                    ? (<a href={props.pageLinkFunc(pagination.nextPage)}
                          className={styles.pageItem}>下一页</a>)
                    : (<></>)}
            </div>
        </div>
    </div>
}
