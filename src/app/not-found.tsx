import GlobalLayout from "@/components/server/global";
import {headers} from "next/headers";
import {getTargetLang, langEnUS} from "@/components/common/language";
import {PageMetadata} from "@/components/common/utils/page";
import {transKey} from "@/components/common/locales/normal";

export default async function NotFoundPage() {
    const headersList = await headers()
    const acceptLang = headersList.get('Accept-Language') || langEnUS
    const lang = getTargetLang(acceptLang, langEnUS)
    const metadata = new PageMetadata(lang)
    metadata.title = transKey(lang, "PageNotFound")
    return <GlobalLayout lang={lang} metadata={metadata}>{metadata.title}</GlobalLayout>;
}
