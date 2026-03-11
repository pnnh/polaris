export interface CMFileModel {
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

// 根目录的文件uid，固定不变
export const RootFileUid = "76de121c-0fab-11f1-a643-6c02e0549f86";
