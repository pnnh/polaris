import {CSSProperties} from 'react'

export function PSImageServer({src, alt, width, height, fill, sizes, style}: {
    src: string, alt?: string, width?: number, height?: number,
    fill?: boolean, sizes?: string, style?: CSSProperties
}) {
    alt = alt ? alt : ''
    const defaultImage = '/images/default.webp'
    const imageUrl = src ? src : defaultImage
    if (fill) {
        return <img src={imageUrl} alt={alt}
                    sizes={sizes} style={style}></img>
    }
    width = width ? width : 256
    height = height ? height : 256
    return <img src={imageUrl} alt={alt} width={width}
                height={height}
                sizes={sizes} style={style}></img>
}
