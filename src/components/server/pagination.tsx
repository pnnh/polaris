import {FullPagination} from "@pnnh/atom";
import {PSComponentLayout, PSComponentLayoutProps} from "@/components/common/component";
import {transKey} from "@/components/common/locales/normal";
import {css} from "@/gen/styled/css";

const stylePageContent = css`
    margin: 0.5rem;
`
const stylePageItemActive = css`
    background-color: rgba(42, 142, 224, 0.84);
    display: inline-block;
    min-width: 16px;
    text-decoration: none;
    width: 32px;
    text-align: center;
    color: #FFFFFF;
`

const stylePageItem = css`
    padding: 8px;
    margin-right: 4px;
    min-width: 16px;
    text-decoration: none;
    text-align: center;
    color: #000000;
    width: 32px;
    height: 32px;
`

const stylePageList = css`
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    list-style: none;
    padding: 0 16px 0 16px;
`

export function PaginationServer({lang, pagination, pageLinkFunc, inlineStyle, comId}:
                                     {
                                         lang: string,
                                         pagination: FullPagination,
                                         pageLinkFunc: (page: number) => string
                                     } & PSComponentLayoutProps) {
    return (<div className={stylePageList}>
        <div className={stylePageContent}>
            {pagination.previousPage >= 1
                ? (<a href={pageLinkFunc(pagination.previousPage)}
                      className={stylePageItem}>
                    {transKey(lang, "common.pagination.previous")}
                </a>)
                : (<></>)}
            {[...Array(pagination.endPage - pagination.startPage + 1).keys()].map((_, index) => {
                return <a key={`page-${index}`} href={pageLinkFunc(pagination.startPage + index)}
                          className={pagination.currentPage === pagination.startPage + index
                              ? stylePageItemActive
                              : stylePageItem}>{pagination.startPage + index}</a>
            })}
            {pagination.nextPage <= pagination.maxPage
                ? (<a href={pageLinkFunc(pagination.nextPage)}
                      className={stylePageItem}>
                    {transKey(lang, "common.pagination.next")}
                </a>)
                : (<></>)}
        </div>
    </div>)
}
