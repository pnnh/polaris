export interface NPDirectoryModel {
    uid: string
    title: string
    create_time: string
    update_time: string
    owner: string
    description: string
    parent: string
    level: number
    album: string
    album_name: string
    name: string
    profile: string
    profile_name: string
    path: string
    children: NPDirectoryModel[] | undefined
    urn: string
}
