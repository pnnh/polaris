import React from "react";
import {TocItem} from "@/common/models/toc";
import {SteleBody} from "@/common/models/stele";
import {markdownToStele} from "@/common/parser/markdown";
import {buildNodeView} from "@/common/parser/view";
import {packageName} from "@/common/package";

// @Deprecated 使用 ServerBuildBodyHtml 代替
export function BuildBodyHtml(props: {
    tocList: Array<TocItem>,
    header: string,
    body: unknown,
    libUrl: string,
    assetsUrl: string
}) {
    if (!props.body) return <></>
    let bodyObject: SteleBody | null = null
    if (props.header === 'stele' && typeof props.body === 'string') {
        bodyObject = JSON.parse(props.body)
        if (!bodyObject) return <>无效文档格式</>
        if (!bodyObject.name) bodyObject.name = 'body'
    } else if (props.header === 'markdown' && typeof props.body === 'string') {
        bodyObject = markdownToStele(props.body)
    }
    if (!bodyObject) return <>无效文档格式</>
    const children = bodyObject.children
    if (!children || children.length < 1) return <></>

    return <div className={'stele-viewer'}>
        <link rel="stylesheet" href={`${props.libUrl}/${packageName}/lib/assets/index.css`}/>
        {buildNodeView(props.tocList, bodyObject, props.assetsUrl)}
    </div>
}

export type ServerBuildBodyHtml = typeof BuildBodyHtml
