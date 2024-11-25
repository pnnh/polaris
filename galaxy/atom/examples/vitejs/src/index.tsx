import React, {useState} from 'react'
import * as ReactDOMClient from 'react-dom/client'
import {calcPagination} from "atom/client";
import {PaginationClient} from "atom/client";

function DevApp() {

    const pagination = calcPagination(1, 35, 10)
    return (
        <div>
            {/*<PaginationClient pagination={pagination} pageLinkFunc={(page) => `/?page=${page}`}/>*/}
        </div>
    )
}

const container = document.getElementById('root')
if (!container) {
    throw new Error('container is null')
}

// const root = ReactDOMClient.createRoot(container)
//
// root.render(<DevApp/>)
