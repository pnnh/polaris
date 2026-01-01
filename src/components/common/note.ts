import {stringHashCode} from "@pnnh/atom";

const MAX_DEFAULT_IMAGE = 16;

export function getDefaultNoteImageByUid(uid: string) {
    const hashCode = stringHashCode(uid);
    const index = Math.abs(hashCode) % MAX_DEFAULT_IMAGE + 1;
    return `/images/default/notes/${index}.jpg`
}

export function getDefaultImageUrl() {
    return '/images/default.webp'
}
