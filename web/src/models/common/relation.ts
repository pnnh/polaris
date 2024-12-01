export interface RelationModel {
    pk: string
    source: string
    create_time: string
    update_time: string
    creator: string
    target: string
    direction: string
    discover: number
    status: number
    profile: string
}

export interface RelationFullModel<S, T> extends RelationModel {
    source_model: S
    target_model: T
}
