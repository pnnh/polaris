import React from 'react'
import './layout.scss'


export default async function ConsoleLayout({
                                                children,
                                            }: {
    children: React.ReactNode
}) {
    return (
        <div className={'consolePage'}>
            <div className={'mainContainer'}>
                <div className={'rightBody'}>
                    {children}
                </div>
            </div>
        </div>
    )
}
