import {CSSProperties} from 'react'
import {PSComponentLayout, css, PSComponentLayoutProps} from "@/components/common/component";

export function PSImageServer({lang, src, alt, width, height, fill, sizes, style, comId, inlineStyle}: {
    src: string, alt?: string, width?: number, height?: number,
    fill?: boolean, sizes?: string, style?: CSSProperties
} & PSComponentLayoutProps) {
    alt = alt ? alt : ''
    const defaultImage = '/images/default.webp'
    const imageUrl = src ? src : defaultImage
    if (fill) {
        return <img src={imageUrl} alt={alt}
                    sizes={sizes} style={style}></img>
    }
    width = width ? width : 256
    height = height ? height : 256
    return <PSComponentLayout comId={comId} lang={lang}
                              inlineStyle={inlineStyle}><img src={imageUrl} alt={alt} width={width}
                                                             height={height}
                                                             sizes={sizes} style={style}></img>
    </PSComponentLayout>
}
