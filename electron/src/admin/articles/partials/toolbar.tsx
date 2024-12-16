'use client'

import React from 'react'
import styles from './toolbar.module.css'
import {Button} from "@mui/material";

export function Toolbar() {
    return <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
            <Button type={'button'}>删除</Button>
        </div>
        <div>
        </div>
    </div>
}
