'use client'

import './comments.scss'
import {EditArea} from "./edit";
import {ListArea} from "./list";
import * as React from "react";

export function CommentsClient({resource}: { resource: string }) {
    return <div className={'commentsContainer'}>
        <EditArea resource={resource}/>
        <ListArea resource={resource}/>
    </div>
}
