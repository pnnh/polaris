import {NCChannelModel} from "@/common/models/channel";

export interface NCPictureModel {
    uid: string
    urn: string
    name: string
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
    channel: string | NCChannelModel
    partition: string
    path: string
}

export function channelName(channel: string | NCChannelModel): string {
    if (typeof channel === 'string') {
        return channel
    }
    return channel.name
}
