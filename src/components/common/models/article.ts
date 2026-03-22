import {PSChannelModel} from "@/components/common/models/channel";
import {EmptyUUID} from "@pnnh/atom";

export interface PSArticleModel {
    title: string
    header: string
    body: string
    create_time: string
    update_time: string
    creator: string
    keywords: string
    description: string
    cover: string
    coverUrl: string
    discover: number
    owner: string
    owner_name: string
    channel: string
    partition: string
    path: string
    uid: string
    lang: string
    channel_name: string
    name: string
    url: string
    repo_url: string
    full_repo_url: string
    full_repo_path: string
    mimetype: string
    status: number
    content?: string
    styles?: string
}

export function NewArticleModel(): PSArticleModel {
    return {
        mimetype: "", owner_name: "", status: 0,
        full_repo_path: "", full_repo_url: "", repo_url: "", url: "",
        name: "",
        channel_name: "",
        channel: '',
        cover: "",
        coverUrl: "",
        creator: "",
        discover: 0,
        header: "",
        owner: "",
        partition: "",
        path: "",
        uid: EmptyUUID,     // 设置为空以供form表单识别是新建文章
        title: '',
        description: '',
        keywords: '',
        body: '',
        lang: '',
        create_time: '',
        update_time: ''
    }
}

export interface PSArticleMetadataModel {
    uid: string
    image: string
    description: string
    title: string
    tags: string
}

export interface PSArticleFileModel {
    title: string
    path: string
    is_dir: boolean
    is_text: boolean
    is_image: boolean
    storage_path: string
    full_repo_path: string
}

export function channelName(channel: string | PSChannelModel): string {
    if (typeof channel === 'string') {
        return channel
    }
    return channel.name
}
