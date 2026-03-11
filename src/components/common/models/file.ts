export interface CmFileModel {
    uid: string
    name: string
    title: string
    header: string
    body: string
    create_time: string
    update_time: string
    keywords: string
    description: string
    status: number
    cover: string
    discover: number
    owner: string
    owner_name: string
    url: string
    mimetype: string
    parent: string
    path: string
}

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
    channel: string
    body: string
    header: string
    partition: string
    uid: string
    name: string
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
