import React from 'react'

import {CSSProperties} from "react";

const noDataStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

export function NoData(props: { size: 'small' | 'middle' | 'large' }) {
    let width = 100
    if (props.size === 'middle') {
        width = 200
    } else if (props.size === 'large') {
        width = 300
    }
    return <div style={noDataStyle}>
        <img src='/images/interface/nodata.jpeg' alt='empty' width={width} height={width}></img>
    </div>
}
