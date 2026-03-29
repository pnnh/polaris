export interface PSChannelModel {
    uid: string
    name: string
    description: string
    image: string
    owner: string
    status: number
    owner_name?: string
    create_time: string
    update_time: string
    match?: string
}

import {stringHashCode} from "@pnnh/atom";

const MAX_DEFAULT_IMAGE = 16;

export function getDefaultChanImageByUid(uid: string) {
    const hashCode = stringHashCode(uid);
    const index = Math.abs(hashCode) % MAX_DEFAULT_IMAGE + 1;
    return `/images/default/notes/${index}.jpg`
}
