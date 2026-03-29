import React from "react";
import {expect, test} from 'vitest'
import {render} from '@testing-library/react'
import {PSImageServer} from "@/components/server/image";

const comId = '308bca47-86dc-48d6-8b4e-aa822689af8f'

test('PSImageServer renders correctly', () => {
    const {container} = render(<PSImageServer src={'/abc.png'}/>)
    expect(container).toMatchSnapshot()
});
