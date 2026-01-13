'use client'
import React from 'react'
import Button from "@mui/material/Button";
import {stringToBase58} from "@pnnh/atom";

export function OpenToolbar() {
    return <div>
        <Button onClick={() => {
            window.serverAPI.openFolder().then((dir: string) => {
                console.log('打开的目录是', dir)
                if (!dir) {
                    return
                }
                const dirParam = stringToBase58(dir, 'base58')
                const targetUrl = `/host/storage/files?dir=${dirParam}`
                window.location.href = targetUrl
            })
        }}>打开本地目录</Button>
    </div>
}
