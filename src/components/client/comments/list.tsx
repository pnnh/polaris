import './list.scss'
import {useEffect, useState} from "react";
import {PLSelectResult} from "@/atom/common/models/protocol";
import {PSCommentModel} from "@/atom/common/models/comment";
import {fetchComments} from "@/components/client/comments/comment";
import {transText} from "@/components/common/locales/normal";

export function ListArea({portalUrl, resource, lang}: { portalUrl: string, resource: string, lang: string }) {
    const [list, setList] = useState<PLSelectResult<PSCommentModel>>()
    useEffect(() => {
        fetchComments({portalUrl, resource}).then(result => {
            setList(result)
        })
    }, [])
    if (!list) {
        return <div>Loading...</div>
    }
    if (!list.data || list.data.count === 0 || !list.data.range) {
        return <div>
            {transText(lang, '暂无评论', 'No comments yet')}
        </div>
    }
    return <div className={'listContainer'}>
        <div>
            {
                list.data.range.map((comment, index) => {
                    return <div key={index} className={'commentItem'}>
                        <div className={'commentHeader'}>
                            <div className={'commentAuthor'}>{comment.nickname}</div>
                            <div className={'commentTime'}>{comment.create_time}</div>
                        </div>
                        <div className={'commentContent'}>{comment.content}</div>
                    </div>
                })
            }

        </div>
    </div>
}
