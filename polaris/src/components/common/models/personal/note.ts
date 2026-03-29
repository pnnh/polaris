import {PSChannelModel} from "@/components/common/models/channel";

export interface PSNoteModel {
    title: string
    header: string
    body: string
    create_time: string
    update_time: string
    creator: string
    keywords: string
    description: string
    cover: string
    discover: number
    owner: string
    channel: string
    partition: string
    path: string
    uid: string
}

export interface PSNoteMetadataModel {
    uid: string
    image: string
    description: string
    title: string
    tags: string
}

export interface PSNoteFileModel {
    title: string
    path: string
    is_dir: boolean
    is_text: boolean
    is_image: boolean
    storage_path: string
}

export function channelName(channel: string | PSChannelModel): string {
    if (typeof channel === 'string') {
        return channel
    }
    return channel.name
}
