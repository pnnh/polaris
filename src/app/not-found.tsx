import GlobalLayout from "@/components/server/global";
import {headers} from "next/headers";
import {langEnUS} from "@/components/common/language";
import {filterAcceptLanguage} from "@/components/server/language";
import {PageMetadata} from "@/components/common/utils/page";
import {transText} from "@/components/common/locales/normal";

export default async function NotFoundPage() {
    const headersList = await headers()
    const acceptLang = headersList.get('Accept-Language') || langEnUS
    const lang = filterAcceptLanguage(acceptLang)
    const metadata = new PageMetadata(lang)
    metadata.title = transText(lang, "PageNotFound")
    return <GlobalLayout lang={lang} metadata={metadata}>{metadata.title}</GlobalLayout>;
}
