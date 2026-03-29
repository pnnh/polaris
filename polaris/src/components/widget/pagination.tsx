import {FullPagination} from "@pnnh/atom";
import {transKey} from "@/components/common/locales/normal";

export function PaginationServer({lang, pagination, pageLinkFunc}:
                                 {
                                     lang: string,
                                     pagination: FullPagination,
                                     pageLinkFunc: (page: number) => string
                                 }) {
    return (
        <div className="flex justify-center py-4">
            <div className="join">
                {pagination.previousPage >= 1 && (
                    <a href={pageLinkFunc(pagination.previousPage)}
                       className="join-item btn btn-sm btn-ghost">
                        {transKey(lang, "common.pagination.previous")}
                    </a>
                )}
                {[...Array(pagination.endPage - pagination.startPage + 1).keys()].map((_, index) => (
                    <a key={`page-${index}`}
                       href={pageLinkFunc(pagination.startPage + index)}
                       className={`join-item btn btn-sm ${
                           pagination.currentPage === pagination.startPage + index
                               ? 'btn-active'
                               : 'btn-ghost'
                       }`}>
                        {pagination.startPage + index}
                    </a>
                ))}
                {pagination.nextPage <= pagination.maxPage && (
                    <a href={pageLinkFunc(pagination.nextPage)}
                       className="join-item btn btn-sm btn-ghost">
                        {transKey(lang, "common.pagination.next")}
                    </a>
                )}
            </div>
        </div>
    )
}
