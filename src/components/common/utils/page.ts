import {transExtra} from "@/components/common/locales/normal";

export function pageTitle(lang: string, title?: string | null | undefined): string {
    const slogan = transExtra(lang, "希波", "HUABLE", "siteName")
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
