import {calcPagination} from "@/atom/common/utils/pagination";
import {PaginationServer} from "@/components/server/pagination";
import React from "react";
import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import {langEn} from "@/atom/common/language";

it('PaginationServer renders correctly', () => {
    const pagination = calcPagination(3, 85, 10)
    const {container} = render(<PaginationServer lang={langEn} pagination={pagination}
                                                 pageLinkFunc={(page) =>
                                                     `/articles?page=` + page.toString()}/>)
    expect(container).toMatchSnapshot()
});
