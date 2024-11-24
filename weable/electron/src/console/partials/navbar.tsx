'use client'

import React from 'react'
import styles from './navbar.module.scss'
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import {useRecoilState} from "recoil";
import {Button, IconButton} from "@mui/material";
import {pictureAtom, previewAtom} from "@/console/state/personal";

export function ConsoleNavbar() {
    return <div className={styles.navHeader}>
        <div className={styles.leftNav}>
            <a className={styles.brandLink} href={'/'}>
                <img src='/images/logo.png' alt='logo' width={28} height={28} sizes={'32px,32px'}/>
            </a>
        </div>
        <div className={styles.rightNav}>
            <UserAction/>
        </div>
    </div>
}

function UserAction(props: { account?: string }) {
    const [pictureState, setPictureState] = useRecoilState(previewAtom)
    return <IconButton size={'small'} onClick={() => {
        setPictureState({
            visible: pictureState.visible === 1 ? 0 : 1
        })
    }}>
        {pictureState.visible ? <AutoAwesomeMosaicIcon/> : <AutoAwesomeMosaicOutlinedIcon/>}
    </IconButton>
}
