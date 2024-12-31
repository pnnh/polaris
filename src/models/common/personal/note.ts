// @Deprecated 使用 SPNoteModel 替代
export interface NoteModel {
    urn: string
    title: string
    header: string
    body: string
    create_time: string
    update_time: string
    owner: string
    keywords: string
    description: string
    cover: string
    name: string
    discover: number
    // @Deprecated 个人笔记没有 channel
    channel: string
    // @Ddeprecated 个人笔记没有 channel_name
    channel_name: string
    library: string
    notebook: string
    partition: string
    path: string
    children: number
}

export type SPNoteModel = NoteModel
