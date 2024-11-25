/*
* @deprecated 使用PSLibraryModel替代
* */
export class LibraryModel {
    name = ''
    create_time: string = ''
    update_time: string = ''
    owner = ''
    description = ''
}

export interface PSLibraryModel {
    urn: string
    name: string
    create_time: string
    update_time: string
    owner: string
    description: string
}
