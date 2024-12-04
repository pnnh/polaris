export interface Pagination {
    offset: number
    limit: number
    page: number
    size: number
}

export class FullPagination {
    totalCount = 0
    pageSize = 8
    currentPage = 1
    startPage = 1
    endPage = 1
    previousPage = 1
    nextPage = 1
    maxPage = 1
}

export function calcPagination(currentPage: number, totalCount: number, pageSize: number) {
    if (currentPage < 1) {
        currentPage = 1
    }
    let maxPage = Math.floor(totalCount / pageSize)
    if (totalCount % pageSize !== 0) {
        maxPage += 1
    }
    if (currentPage > maxPage) {
        currentPage = maxPage
    }
    let startPage = currentPage - 5
    if (startPage < 1) {
        startPage = 1
    }
    let endPage = currentPage + 5
    if (endPage > maxPage) {
        endPage = maxPage
    }
    const previousPage = currentPage - 1
    const nextPage = currentPage + 1

    const pagination = new FullPagination()
    pagination.totalCount = totalCount
    pagination.pageSize = pageSize
    pagination.currentPage = currentPage
    pagination.startPage = startPage
    pagination.endPage = endPage
    pagination.previousPage = previousPage
    pagination.nextPage = nextPage
    pagination.maxPage = maxPage
    return pagination
}


export function createPagination(offset: number, limit: number): Pagination {
    return {
        offset,
        limit,
        page: Math.floor(offset / limit) + 1,
        size: limit
    }
}

export function createPaginationByPage(page: number, limit: number): Pagination {
    return {
        offset: (page - 1) * limit,
        limit,
        page,
        size: limit
    }
}
