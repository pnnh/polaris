import {Request} from 'express'

export interface Pagination {
    offset: number
    limit: number
    page: number
    size: number
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

export function fromExpressRequest(request: Request) {
    const queryPage = request.get('page')
    const querySize = request.get('size')
    const page = isNaN(Number(queryPage)) ? 1 : Number(queryPage)
    const size = isNaN(Number(querySize)) ? 10 : Number(querySize)
    return createPaginationByPage(page, size)
}
