import {headers} from "next/headers";
import {getTargetLang, langEnUS} from "@/components/common/language";
import {transKey} from "@/components/common/locales/normal";

export default async function NotFoundPage() {
    const headersList = await headers()
    const acceptLang = headersList.get('Accept-Language') || langEnUS
    const lang = getTargetLang(acceptLang, langEnUS)
    return <div>{transKey(lang, "PageNotFound")}</div>
}
