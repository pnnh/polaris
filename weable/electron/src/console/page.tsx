'use client'

import styles from './page.module.scss'
import {NotebookBar} from './sidebar'
import {PictureGrid} from './album'
import React from 'react'
import {useRecoilValue} from 'recoil'
import {pictureAtom, previewAtom} from './state/personal'
import {ConsoleLayout} from "@/console/layout";

export function ConsolePage() {
    return (
        <ConsoleLayout>
            <div className={styles.notesPage}>
                <div className={styles.directoryBar}>
                    <NotebookBar></NotebookBar>
                </div>
                <div className={styles.notesContainer}>
                    <PictureGrid></PictureGrid>
                    <PictureViewer/>
                </div>
            </div>
        </ConsoleLayout>
    )
}

function PictureViewer() {
    const pictureState = useRecoilValue(pictureAtom)
    const previewState = useRecoilValue(previewAtom)

    if (!pictureState || !pictureState.current || previewState.visible !== 1) {
        return <></>
    }

    return <div className={styles.noteViewer}>
        <div className={styles.editorArea}>
            <div className={styles.titleCol}>
                {`预览图片 ${pictureState.current.urn}\n${pictureState.current.file}`}
            </div>
            <div className={styles.previewCol}>
                <div className={styles.preview}>
                    <img src={pictureState.current.file} alt={pictureState.current.title}/>
                </div>
            </div>
        </div>
    </div>
}
