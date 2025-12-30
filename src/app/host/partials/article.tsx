import React from "react";

export function ArticleComponent({children}: {
    children: React.ReactNode
}) {
    return <div>
        {children}
    </div>
}
