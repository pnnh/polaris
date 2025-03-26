import {getPathname} from "@/services/server/pathname";
import {Metadata} from "next";
import {pageTitle} from "@/utils/page";
import AccountLayout from "@/components/server/account/layout";
import styles from "./page.module.scss";
import {SigninForm} from "./form";
import {useServerConfig} from "@/services/server/config";

export default async function Page({params, searchParams}: {
    params: Promise<{ channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams

    const metadata: Metadata = {}
    metadata.title = pageTitle('')
    const serverConfig = useServerConfig()
    return <AccountLayout lang={'zh'} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.signinCard}>
            <div className={styles.signinTitle}>登录页面</div>
            <div className={styles.signinBody}>
                <SigninForm portalUrl={serverConfig.NEXT_PUBLIC_PORTAL_URL}/>
            </div>
        </div>
    </AccountLayout>
}
