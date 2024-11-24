import {Request} from 'express'
import {createPaginationByPage} from '@pnnh/atom'

export function fromExpressRequest(request: Request) {
    const queryPage = request.get('page')
    const querySize = request.get('size')
    const page = isNaN(Number(queryPage)) ? 1 : Number(queryPage)
    const size = isNaN(Number(querySize)) ? 10 : Number(querySize)
    return createPaginationByPage(page, size)
}
