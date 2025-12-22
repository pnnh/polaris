import {GlobalLayout} from "@/components/server/global";

import {langEnUS} from "@/components/common/language";
import {filterAcceptLanguage} from "@/components/server/language";
import {PageMetadata} from "@/components/common/utils/page";
import {transKey} from "@/components/common/locales/normal";
import {Request} from 'express'

export async function NotFoundPage(request: Request) {
    const acceptLang = request.get('Accept-Language') || langEnUS
    const lang = filterAcceptLanguage(acceptLang)
    const metadata = new PageMetadata(lang)
    metadata.title = transKey(lang, "PageNotFound")
    return <GlobalLayout lang={lang} metadata={metadata}>{metadata.title}</GlobalLayout>;
}
