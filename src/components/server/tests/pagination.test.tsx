import {calcPagination} from "@/atom/common/utils/pagination";
import {PaginationServer} from "@/components/server/pagination";
import React from "react";
import {expect, test} from 'vitest'
import {render, screen} from '@testing-library/react'
import {langEn} from "@/atom/common/language";

const comId = 'd59f406b-7a36-4127-baef-2f878b462885'

test('PaginationServer renders correctly', () => {
    const pagination = calcPagination(3, 85, 10)
    const {container} = render(<PaginationServer comId={comId} lang={langEn} pagination={pagination} inlineStyle={true}
                                                 pageLinkFunc={(page) =>
                                                     `/articles?page=` + page.toString()}/>)
    expect(container).toMatchSnapshot()
});
