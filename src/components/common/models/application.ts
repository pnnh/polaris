export interface ApplicationLanguageProfile {
    name: string
    description: string
}

export interface ApplicationModel {
    uid: string
    url: string
    mime: string
    update_time: string
    image: string
    texts?: { [lang: string]: ApplicationLanguageProfile }
}

export interface ApplicationWithText extends ApplicationModel, ApplicationLanguageProfile {
}
