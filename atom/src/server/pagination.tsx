import {css, StyleItem} from "@/common/style";
import {FullPagination} from "@pnnh/atom";

const pageList = css`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin: 0 auto;
    list-style: none;
    padding: 0 16px 0 16px;
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
const stylePageItemActive = css`
    background-color: rgba(42, 142, 224, 0.84);
    display: inline-block;
    min-width: 16px;
    text-decoration: none;
    width: 32px;
    text-align: center;
    color: #FFFFFF;
`

const pageContent = css`
    margin: 0.5rem
`

function RenderStyle({styleList}: { styleList: StyleItem[] }) {
    const styleText = styleList.map((item) => {
        return `.${item.className} {${item.contentText}}`
    }).join('\n')
    return <style>{styleText}</style>
}

export function PaginationServer(props: { pagination: FullPagination, pageLinkFunc: (page: number) => string }) {
    const pagination = props.pagination
    return <div>
        <RenderStyle styleList={[pageList, pageContent, stylePageItem, stylePageItemActive]}/>
        <div className={pageList.className}>
            <div className={pageContent.className}>
                {pagination.previousPage >= 1
                    ? (<a href={props.pageLinkFunc(pagination.previousPage)}
                          className={stylePageItem.className}>上一页</a>)
                    : (<></>)}
                {[...Array(pagination.endPage - pagination.startPage + 1).keys()].map((_, index) => {
                    return <a key={`page-${index}`} href={props.pageLinkFunc(pagination.startPage + index)}
                              className={pagination.currentPage === pagination.startPage + index
                                  ? stylePageItemActive.className
                                  : stylePageItem.className}>{pagination.startPage + index}</a>
                })}
                {pagination.nextPage <= pagination.maxPage
                    ? (<a href={props.pageLinkFunc(pagination.nextPage)}
                          className={stylePageItem.className}>下一页</a>)
                    : (<></>)}
            </div>
        </div>
    </div>
}
