import React from 'react'
import { calcPagination } from 'atom'
import {PaginationServer} from "atom/server";

export default function Page() {

    const pagination = calcPagination(1, 35, 10)
    return (
        <div>
            <PaginationServer pagination={pagination} pageLinkFunc={(page) => `/?page=${page}`}/>
        </div>
    )
}
