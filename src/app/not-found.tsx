import GlobalLayout from "@/components/server/global";
import {headers} from "next/headers";
import {langEnUS} from "@/services/common/language";
import {filterAcceptLanguage} from "@/services/server/language";
import {PageMetadata} from "@/utils/page";
import {transText} from "@/services/common/locales/normal";

export default async function NotFoundPage() {
    const headersList = await headers()
    const acceptLang = headersList.get('Accept-Language') || langEnUS
    const lang = filterAcceptLanguage(acceptLang)
    const metadata = new PageMetadata(lang)
    metadata.title = transText(lang, "PageNotFound")
    return <GlobalLayout lang={lang} metadata={metadata}>{metadata.title}</GlobalLayout>;
}
