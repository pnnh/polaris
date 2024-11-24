export class NotebookModel {
    title = ''
    create_time = ''
    update_time = ''
    description = ''
    name = ''
    image = ''
    profile = ''
    profile_name = ''
    owner = ''
    owner_name = ''
}

export interface PSNotebookModel {
    urn: string
    title: string
    create_time: string
    update_time: string
    description: string
    name: string
    image: string
    profile: string
    profile_name: string
    owner: string
    owner_name: string
}
