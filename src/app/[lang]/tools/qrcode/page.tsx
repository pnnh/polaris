import styles from './page.module.scss'
import ContentLayout from "@/components/server/content/layout";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {getPathname} from "@/components/server/pathname";
import {langEn} from "@/atom/common/language";
import {qrcodeUid, queryApp} from "@/components/server/tools/tools";
import {notFound} from "~/next/navigation";
import {PageMetadata} from "@/components/common/utils/page";
import {QRCodeComponent} from "./qrcode";

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams

    const appInfo = queryApp(lang, qrcodeUid)
    if (!appInfo) {
        notFound()
    }

    const metadata = new PageMetadata(lang, appInfo.name)
    metadata.description = appInfo.description
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={styles.qrcodePage}>
            <QRCodeComponent lang={lang}/>
        </div>
    </ContentLayout>
}
