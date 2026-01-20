import {useEffect, useState} from "react";
import {PLSelectResult} from "@pnnh/atom";
import {fetchComments, PSCommentModel} from "@/components/client/comments/comment";
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

        <style jsx>{`
            .listContainer {
            }

            .areaTitle {
                font-size: 1.1rem;
                font-weight: bold;
            }

            .commentItem {
                padding: 0.5rem 0;
            }

            .commentHeader {
                display: flex;
                flex-direction: row;
                gap: 1rem;
                align-items: center;
                font-size: 0.9rem;
                color: var(--text-primary-color);
                padding: 0.5rem 0;
                border-bottom: solid 0.5px #ccc;
            }

            .commentContent {
                margin-top: 0.5rem;
                font-size: 1rem;
                color: var(--text-primary-color);
            }
        `}</style>
    </div>
}
