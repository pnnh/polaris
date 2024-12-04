import React from "react";
import './text.scss'

export interface ARButtonTextProps {
    className?: string
    children?: React.ReactNode,
    fill?: string
}

export function ARButtonText(props: ARButtonTextProps) {
    return <div className={'ARButtonText'}>
        <div className={'content'}>
            {props.children}
        </div>
    </div>
}
