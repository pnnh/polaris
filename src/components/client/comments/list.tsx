import './list.scss'
import {useEffect, useState} from "react";
import {PLSelectResult} from "@/models/common/protocol";
import {PSCommentModel} from "@/models/common/comment";
import {fetchComments} from "@/services/client/comments/comment";

export function ListArea({mode, lang, assetsUrl}: { mode?: string, lang?: string, assetsUrl: string }) {
    const [list, setList] = useState<PLSelectResult<PSCommentModel>>()
    useEffect(() => {
        const context = {env: mode}
        fetchComments(context).then(result => {
            setList(result)
        })
    }, [])
    if (!list) {
        return <div>Loading</div>
    }
    if (!list.data || list.data.count === 0) {
        return <div>Empty</div>
    }
    return <div className={'listContainer'}>
        <div className={'areaTitle'}>评论列表</div>
        <div>
            {
                list.data.range.map((comment, index) => {
                    return <div key={index} className={'commentItem'}>
                        <div className={'commentHeader'}>
                            <div className={'commentAuthor'}>{comment.creator}</div>
                            <div className={'commentTime'}>{comment.create_time}</div>
                        </div>
                        <div className={'commentContent'}>{comment.content}</div>
                    </div>
                })
            }

        </div>
    </div>
}
