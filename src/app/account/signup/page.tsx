import {getPathname} from "@/services/server/pathname";
import {Metadata} from "next";
import {pageTitle} from "@/utils/page";
import AccountLayout from "@/components/server/account/layout";
import styles from './page.module.scss'
import {SignupForm} from "@/app/account/signup/form";

export default async function Page({params, searchParams}: {
    params: Promise<{ channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams

    const metadata: Metadata = {}
    metadata.title = pageTitle('')

    return <AccountLayout lang={'zh'} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.signupCard}>
            <div className={styles.signupTitle}>注册页面</div>
            <div className={styles.signupBody}>
                <SignupForm/>
            </div>
        </div>
    </AccountLayout>
}
