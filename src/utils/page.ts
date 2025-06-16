import {getLanguageProvider} from "@/services/common/language";

export function pageTitle(lang: string, title?: string | null | undefined): string {
    const langProvider = getLanguageProvider(lang)
    const slogan = langProvider.slogan
    if (!title || title.startsWith(slogan)) {
        return slogan
    }
    const suffix = ` - ${slogan}`
    return `${title.trim().replace(suffix, '')}${suffix}`
}

export class PageMetadata {
    lang: string;
    title: string;
    description?: string;
    keywords?: string;

    constructor(lang: string, title?: string | null | undefined) {
        this.lang = lang;
        this.title = pageTitle(lang, title);
    }
}
