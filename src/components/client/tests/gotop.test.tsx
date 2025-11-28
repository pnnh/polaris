import React from "react";
import {expect, test} from 'vitest'
import {render} from '@testing-library/react'
import {GoTop} from "@/components/client/gotop";

test('GoTop renders correctly', () => {
    const {container} = render(<GoTop anchor={'anchor2'}/>)
    expect(container).toMatchSnapshot()
});
