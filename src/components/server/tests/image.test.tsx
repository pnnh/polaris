import React from "react";
import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import {PSImageServer} from "@/components/server/image";
import {langEn} from "@/atom/common/language";

const comId = '308bca47-86dc-48d6-8b4e-aa822689af8f'

it('PSImageServer renders correctly', () => {
    const {container} = render(<PSImageServer lang={langEn} comId={comId} inlineStyle={true} src={'/abc.png'}/>)
    expect(container).toMatchSnapshot()
});
