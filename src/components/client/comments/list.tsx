import {useEffect, useState} from "react";
import {PLSelectResult} from "@pnnh/atom";
import {fetchComments, PSCommentModel} from "@/components/client/comments/comment";
import {transKey} from "@/components/common/locales/normal";
import {css} from "@/gen/styled/css";

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
            {transKey(lang, 'comments.noComments')}
        </div>
    }
    return <div className={listStyles.listContainer}>
        <div>
            {
                list.data.range.map((comment, index) => {
                    return <div key={index} className={listStyles.commentItem}>
                        <div className={listStyles.commentHeader}>
                            <div className={listStyles.commentAuthor}>{comment.nickname}</div>
                            <div className={listStyles.commentTime}>{comment.create_time}</div>
                        </div>
                        <div className={listStyles.commentContent}>{comment.content}</div>
                    </div>
                })
            }
        </div>
    </div>
}

const listStyles = {
    listContainer: css``,
    areaTitle: css`
        font-size: 1.1rem;
        font-weight: bold;
    `,
    commentItem: css`
        padding: 0.5rem 0;
    `,
    commentHeader: css`
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        font-size: 0.9rem;
        color: var(--text-primary-color);
        padding: 0.5rem 0;
        border-bottom: solid 0.5px #ccc;
    `,
    commentAuthor: css``,
    commentTime: css``,
    commentContent: css`
        margin-top: 0.5rem;
        font-size: 1rem;
        color: var(--text-primary-color);
    `
}
