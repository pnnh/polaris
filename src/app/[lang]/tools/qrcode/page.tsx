import {css} from "@/gen/styled/css";
import ContentLayout from "@/components/server/content/layout";
import {langEn, SymbolUnknown} from "@pnnh/atom";
import {getPathname} from "@/components/server/pathname";
import {qrcodeUid, queryTool} from "@/components/server/tools/tools";
import {notFound} from "next/navigation";

import {QRCodeComponent} from "./qrcode";

const pageStyles = {
    qrcodePage: css`
        width: 960px;
        margin: 0 auto;
    `
}

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams

    const appInfo = await queryTool(lang, qrcodeUid)
    if (!appInfo) {
        notFound()
    }

    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          userInfo={SymbolUnknown}>
        <div className={pageStyles.qrcodePage}>
            <QRCodeComponent lang={lang}/>
        </div>
    </ContentLayout>
}
