import React from 'react'
import './layout.scss'
import {HostNavbar} from "@/app/host/navbar";


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
