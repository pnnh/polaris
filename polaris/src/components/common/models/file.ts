import {EmptyUUID, stringHashCode} from "@pnnh/atom";

export interface PSFileModel {
    title: string
    create_time: string
    update_time: string
    creator: string
    keywords: string
    description: string
    discover: number
    status: number
    owner: string
    owner_name: string
    channel: string
    channel_name: string
    lang: string
    body: string
    header: string
    cover: string
    coverUrl: string
    content: string
    styles: string
    partition: string
    uid: string
    name: string
    parent: string
    url: string
    image_url: string
    mimetype: string
    path: string
    is_dir: boolean
    is_text: boolean
    is_image: boolean
    storage_path: string
    full_repo_path: string
    is_ignore: string
    object_uid: string
}


export function NewFileModel(): PSFileModel {
    return {
        parent: "",
        owner_name: "",
        coverUrl: "",
        cover: "",
        channel_name: "", content: "", lang: "", styles: "",
        image_url: "", is_dir: false, is_ignore: "", is_image: false, is_text: false, object_uid: "", storage_path: "",
        mimetype: "",
        status: 0,
        full_repo_path: "", url: "",
        name: "",
        channel: '',
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
        create_time: '',
        update_time: ''
    }
}


export interface CMFileModel extends PSFileModel {
}


// 根目录的文件uid，固定不变
export const RootFileUid = "76de121c-0fab-11f1-a643-6c02e0549f86";

const MAX_DEFAULT_IMAGE = 16;


export function getDefaultNoteImageByUid(uid: string) {
    const hashCode = stringHashCode(uid);
    const index = Math.abs(hashCode) % MAX_DEFAULT_IMAGE + 1;
    return `/images/default/notes/${index}.jpg`
}

export function getDefaultImageUrl() {
    return '/images/default.webp'
}
