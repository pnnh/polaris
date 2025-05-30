import {getPathname} from "@/services/server/pathname";
import {Metadata} from "next";
import {pageTitle} from "@/utils/page";
import styles from './page.module.scss'
import {useServerConfig} from "@/services/server/config";
import ContentLayout from "@/components/server/content/layout";
import {getDefaultNoteImageByUid} from "@/services/common/note";
import {getUserinfo} from "@/atom/client/account/account";
import {CodeOk} from "@/atom/common/models/protocol";
import {getAccountUrn} from "@/atom/common/models/account";
import {UserinfoEditForm} from "@/app/account/userinfo/edit/form";
import {serverGetUserinfo} from "@/atom/server/account/account";

export default async function Page({params, searchParams}: {
    params: Promise<{ channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams

    const metadata: Metadata = {}
    metadata.title = pageTitle('')
    const serverConfig = useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL

    const userInfo = await serverGetUserinfo(portalUrl)
    if (!userInfo) {
        return <div>遇到错误</div>
    }

    return <ContentLayout lang={'zh'} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div>
            <UserinfoEditForm portalUrl={portalUrl} userInfo={userInfo}/>
        </div>
    </ContentLayout>
}
