'use client'

import './comments.scss'
import {EditArea} from "./edit";
import {ListArea} from "./list";
import * as React from "react";

export function CommentsClient() {
    return <div className={'commentsContainer'}>
        <EditArea />
        <ListArea />
    </div>
}
