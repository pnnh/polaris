import React from 'react'
import {ConsoleFeature} from './partials/feature'
import './layout.scss'

export function ConsoleLayout({
                                  children
                              }: {
    children: React.ReactNode
}) {
    return (
        <div className={'consolePage'}>
            <div className={'mainContainer'}>
                <div className={'leftNav'}>
                    <ConsoleFeature/>
                </div>
                <div className={'rightBody'}>
                    {children}
                </div>
            </div>
        </div>
    )
}
