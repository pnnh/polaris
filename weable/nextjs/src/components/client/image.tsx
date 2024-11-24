'use client'

import Image from 'next/image'
import {CSSProperties, useState} from 'react'

export function PSImage(props: {
    src: string, alt?: string, width?: number, height?: number,
    fill?: boolean, sizes?: string, style?: CSSProperties
}) {
    const alt = props.alt ? props.alt : ''
    const defaultImage = '/images/default.webp'
    const imageUrl = props.src ? props.src : defaultImage
    const [src, setSrc] = useState(imageUrl)
    if (props.fill) {
        return <Image onError={() => setSrc(defaultImage)} src={src} alt={alt} fill={props.fill}
                      sizes={props.sizes} style={props.style}></Image>
    }
    const width = props.width ? props.width : 256
    const height = props.height ? props.height : 256
    return <Image onError={() => setSrc(defaultImage)} src={src} alt={alt} width={width}
                  height={height}
                  sizes={props.sizes} style={props.style}></Image>
}
