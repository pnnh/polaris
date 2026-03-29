'use client'

import React, {CSSProperties} from 'react'

const noDataStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

export function NoData({size, message}: { size: 'small' | 'middle' | 'large', message?: string }) {
    let width = 100
    if (size === 'middle') {
        width = 200
    } else if (size === 'large') {
        width = 300
    }
    return <div style={noDataStyle}>
        <img src='/images/interface/nodata.jpeg' alt='empty' width={width} height={width}></img>
        {message && <div style={{marginLeft: '16px', fontSize: '1.2rem', color: '#888888'}}>{message}</div>}
    </div>
}

