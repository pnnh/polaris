import React from "react";
import {ArticleStyle} from "./style";

export function ArticleComponent({children}: {
    children: React.ReactNode
}) {
    return <div>
        <ArticleStyle/>
        {children}
    </div>
}
