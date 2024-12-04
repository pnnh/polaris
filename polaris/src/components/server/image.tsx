import {CSSProperties} from 'react'

export function PSImageServer(props: {
    src: string, alt?: string, width?: number, height?: number,
    fill?: boolean, sizes?: string, style?: CSSProperties
}) {
    const alt = props.alt ? props.alt : ''
    const defaultImage = '/images/default.webp'
    const imageUrl = props.src ? props.src : defaultImage
    if (props.fill) {
        return <img src={imageUrl} alt={alt}
                    sizes={props.sizes} style={props.style}></img>
    }
    const width = props.width ? props.width : 256
    const height = props.height ? props.height : 256
    return <img src={imageUrl} alt={alt} width={width}
                height={height}
                sizes={props.sizes} style={props.style}></img>
}
