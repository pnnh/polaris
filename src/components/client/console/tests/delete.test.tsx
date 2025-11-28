import React from "react";
import {expect, test} from 'vitest'
import {render} from '@testing-library/react'
import PSDeleteButton from "@/components/client/console/delete";

test('PSDeleteButton renders correctly', () => {
    const {container} = render(<PSDeleteButton lang={'en'} deleteUrl={'/delete'}
                                               resTitle={'resTitle'}>删除</PSDeleteButton>)
    expect(container).toMatchSnapshot()
});
