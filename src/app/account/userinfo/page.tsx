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
                          metadata={metadata} userInfo={userInfo}>
        <div className={styles.userInfoContainer}>
            <div className={styles.userInfoCard}>
                <div className={styles.avatar}>
                    <img src={userInfo.photoUrl} alt="User Avatar"/>
                </div>
                <div className={styles.editLink}>
                    <a href={'/account/userinfo/edit'}>修改资料</a>
                </div>
                <div className={styles.details}>
                    <p className={styles.row}>
                        <label className={styles.rowLabel}>用户标识:</label>
                        <span className={styles.rowContent}>{getAccountUrn(userInfo.uid)}</span>
                    </p>
                    <p className={styles.row}>
                        <label className={styles.rowLabel}>用户名: </label>
                        <span className={styles.rowContent}>{userInfo.username}</span></p>
                    <p className={styles.row}>
                        <label className={styles.rowLabel}>用户昵称：</label>
                        <span className={styles.rowContent}>{userInfo.nickname}</span>
                    </p>
                    <p className={styles.row}><label className={styles.rowLabel}>邮箱:</label>
                        <span className={styles.rowContent}>
                            {userInfo.mail}
                        </span></p>
                    <p className={styles.row}><label className={styles.rowLabel}>注册时间:</label>
                        <span className={styles.rowContent}>
                            {userInfo.create_time}
                        </span></p>
                    <p className={styles.row}><label className={styles.rowLabel}>个人简介:</label>
                        <span className={styles.rowContent}>
                            {userInfo.description}
                        </span></p>
                </div>
            </div>
        </div>
    </ContentLayout>
}
