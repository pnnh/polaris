export interface ApplicationLanguageProfile {
    lang: string
    name: string
    description: string
}

export interface ApplicationModel extends ApplicationLanguageProfile {
    urn: string
    url: string
    update_time: string
    image: string
}
