import {calcPagination, langEn} from "@pnnh/atom";
import {PaginationServer} from "@/components/widget/pagination";
import React from "react";
import {expect, test} from 'vitest'
import {render} from '@testing-library/react'

const comId = 'd59f406b-7a36-4127-baef-2f878b462885'

test('PaginationServer renders correctly', () => {
    const pagination = calcPagination(3, 85, 10)
    const {container} = render(<PaginationServer lang={langEn} pagination={pagination}
                                                 pageLinkFunc={(page) =>
                                                     `/articles?page=` + page.toString()}/>)
    expect(container).toMatchSnapshot()
});
