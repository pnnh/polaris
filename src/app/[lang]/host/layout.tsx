import React from 'react'
import './layout.scss'
import {HostNavbar} from "./navbar";


export default async function ConsoleLayout({
                                                children,
                                            }: {
    children: React.ReactNode
}) {
    return (
        <div>
            <HostNavbar/>
            <div>
                {children}
            </div>
        </div>
    )
}
