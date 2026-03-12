import {transKey} from "@/components/common/locales/normal";

export function pageTitle(lang: string, title?: string | null | undefined): string {
    const slogan = transKey(lang, "siteName")
    if (!title || title.startsWith(slogan)) {
        return slogan
    }
    const suffix = ` - ${slogan}`
    return `${title.trim().replace(suffix, '')}${suffix}`
}
