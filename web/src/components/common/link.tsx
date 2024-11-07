import React from "react";
import {CSSProperties} from "react";

const linkStyle: CSSProperties = {
    color: '#000000',
    textDecoration: 'none'
}

export function PSSTextLink(props: { children: React.ReactNode, href: string, className?: string }) {
    return <a style={linkStyle} href={props.href}>{props.children}</a>
}
