'use client'

import React from 'react'
import {useRouter} from 'next/navigation'
import styles from './toolbar.module.scss'
import {Button} from "@mui/material";

export function Toolbar() {
    const router = useRouter()
    return <div className={styles.toolbar}>
        <div>
            <Button type={'button'}
                    onClick={() => {
                        router.replace('/console/channel/new')
                    }}
            >
                新建频道
            </Button>
        </div>
    </div>
}
