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
