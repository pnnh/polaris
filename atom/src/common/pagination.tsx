import {FullPagination} from "@pnnh/atom";
import objToString from 'style-object-to-css-string'

const styles = {
    pageList: objToString({
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        margin: '0 auto',
        listStyle: 'none',
        padding: '0 16px 0 16px',
    }),
    pageContent: objToString({
        margin: '0.5rem'
    }),
    pageItem: objToString({
        padding: '8px',
        marginRight: '4px',
        minWidth: '16px',
        textDecoration: 'none',
        textAlign: 'center',
        color: '#000000',
        width: '32px',
        height: '32px',
    }),
    pageItemActive: objToString({
        backgroundColor: 'rgba(42, 142, 224, 0.84)',
        display: 'inline-block',
        minWidth: '16px',
        textDecoration: 'none',
        width: '32px',
        textAlign: 'center',
        color: '#FFFFFF',
    })
}

function PaginationStyle() {
    return <style>{`
        .pageList {${styles.pageList}}
        .pageContent {${styles.pageContent}}
        .pageItem {${styles.pageItem}}
        .pageItemActive {${styles.pageItemActive}}
    `}</style>
}

// @deprecated 使用区分服务器和客户端的版本
export function PaginationPartial(props: { pagination: FullPagination, calcUrl: (page: number) => string }) {
    const pagination = props.pagination
    return <div>
        <PaginationStyle/>
        <div className={styles.pageList}>
            <div className={styles.pageContent}>
                {pagination.previousPage >= 1
                    ? (<a href={props.calcUrl(pagination.previousPage)}
                          className={styles.pageItem}>上一页</a>)
                    : (<></>)}
                {[...Array(pagination.endPage - pagination.startPage + 1).keys()].map((_, index) => {
                    return <a key={`page-${index}`} href={props.calcUrl(pagination.startPage + index)}
                              className={pagination.currentPage === pagination.startPage + index
                                  ? styles.pageItemActive
                                  : styles.pageItem}>{pagination.startPage + index}</a>
                })}
                {pagination.nextPage <= pagination.maxPage
                    ? (<a href={props.calcUrl(pagination.nextPage)}
                          className={styles.pageItem}>下一页</a>)
                    : (<></>)}
            </div>
        </div>
    </div>
}
