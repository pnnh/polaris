import {CSSProperties, useEffect, useState} from 'react'
import styles from './album.module.scss'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import {PLSelectResult} from '@/models/common-result'
import {libraryAtom, pictureAtom, albumAtom, previewAtom} from './state/personal'
import React from 'react'
import {selectPictures} from "@/services/client/personal/picture";
import {NPPictureModel} from "@pnnh/venus-business";
import {css} from "~/@emotion/css";

const classContainer = css`
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
`

const classGrid = css({
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: '1rem',
    padding: '1rem 0.5rem'
})

export function PictureGrid() {
    const [picturesResult, setPicturesResult] = useState<PLSelectResult<NPPictureModel>>()
    const libraryState = useRecoilValue(libraryAtom)
    const albumState = useRecoilValue(albumAtom)
    const previewState = useRecoilValue(previewAtom)

    const styleContainer: CSSProperties = {}
    const styleGrid: CSSProperties = {}
    if (previewState.visible === 1) {
        styleContainer.width = '50%'
        styleGrid.gridTemplateColumns = 'repeat(4, 1fr)'
    }

    useEffect(() => {
        if (!libraryState || !libraryState.current || !libraryState.current.urn || !albumState ||
            !albumState.current || !albumState.current.urn) {
            return
        }
        selectPictures(libraryState.current.urn, albumState.current.urn).then(selectResult => {
            setPicturesResult(selectResult)
        })
    }, [albumState])

    if (!picturesResult || !picturesResult.range || picturesResult.range.length <= 0) {
        return <div>Empty</div>
    }
    return <div className={classContainer} style={styleContainer}>
        <div className={classGrid} style={styleGrid}>
            {
                picturesResult.range.map(item => {
                    return <PictureCard key={item.uid} item={item}/>
                })
            }
        </div>
    </div>
}

function PictureCard({item}: { item: NPPictureModel }) {
    const setPictureState = useSetRecoilState(pictureAtom)
    const setPreviewState = useSetRecoilState(previewAtom)

    const handleClick = () => {
        setPictureState({
            current: item
        })
        setPreviewState({
            visible: 1
        })
    }

    return <div className={styles.noteCard}>
        <div className={styles.noteSelf}>
            <div className={styles.imgPreview}>
                <img src={item.file} alt={item.title} onClick={handleClick}/>
            </div>
            <div className={styles.noteName} title={item.title} onClick={handleClick}>
                {item.title}
            </div>
        </div>
    </div>
}
