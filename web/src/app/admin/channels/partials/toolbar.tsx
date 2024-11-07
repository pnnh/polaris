'use client'

import React from 'react'
import './toolbar.scss'

export function Toolbar() {
    return <div className={'toolbar'}>
        <div>
            <button type={'button'}
                    onClick={() => {
                        window.location.href = '/console/channel/new'
                    }}
            >
                新建频道
            </button>
        </div>
    </div>
}
