import './list.scss'
import {useEffect, useState} from "react";
import {PLSelectResult} from "@/atom/common/models/protocol";
import {fetchComments} from "@/services/client/comments/comment";
import {PSCommentModel} from "@/atom/common/models/comment";

export function ListArea({resource}: { resource: string }) {
    const [list, setList] = useState<PLSelectResult<PSCommentModel>>()
    useEffect(() => {
        fetchComments(resource).then(result => {
            setList(result)
        })
    }, [])
    if (!list) {
        return <div>暂无评论</div>
    }
    if (!list.data || list.data.count === 0) {
        return <div>Empty</div>
    }
    return <div className={'listContainer'}>
        <div>
            {
                list.data.range.map((comment, index) => {
                    return <div key={index} className={'commentItem'}>
                        <div className={'commentHeader'}>
                            <div className={'commentAuthor'}>{comment.nickname || '匿名'}</div>
                            <div className={'commentTime'}>{comment.create_time}</div>
                        </div>
                        <div className={'commentContent'}>{comment.content}</div>
                    </div>
                })
            }

        </div>
    </div>
}
