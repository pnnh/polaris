import {getPathname} from "@/services/server/pathname";
import {PageMetadata, pageTitle} from "@/utils/page";
import styles from './page.module.scss'
import {useServerConfig} from "@/services/server/config";
import ContentLayout from "@/components/server/content/layout";
import {getAccountUrn} from "@/atom/common/models/account";
import {serverGetUserinfo} from "@/services/server/account/account";
import {langEn, localText} from "@/atom/common/language";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL

    const userInfo = await serverGetUserinfo(portalUrl)
    if (!userInfo) {
        return <div>{localText(lang, '遇到错误', 'Something error')}</div>
    }

    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={userInfo}>
        <div className={styles.userInfoContainer}>
            <div className={styles.userInfoCard}>
                <div className={styles.avatar}>
                    <img src={userInfo.photoUrl} alt="User Avatar"/>
                </div>
                <div className={styles.editLink}>
                    <a href={'/account/userinfo/edit'}>{localText(lang, '修改资料', 'Edit profile')}</a>
                </div>
                <div className={styles.details}>
                    <p className={styles.row}>
                        <label className={styles.rowLabel}>{localText(lang, '用户标识', 'UserID')}:</label>
                        <span className={styles.rowContent}>{getAccountUrn(userInfo.uid)}</span>
                    </p>
                    <p className={styles.row}>
                        <label className={styles.rowLabel}>{localText(lang, '用户名', 'Username')}: </label>
                        <span className={styles.rowContent}>{userInfo.username}</span></p>
                    <p className={styles.row}>
                        <label className={styles.rowLabel}>{localText(lang, '用户昵称', 'Nickname')}：</label>
                        <span className={styles.rowContent}>{userInfo.nickname}</span>
                    </p>
                    <p className={styles.row}><label
                        className={styles.rowLabel}>{localText(lang, '邮箱', 'Email')}:</label>
                        <span className={styles.rowContent}>
                            {userInfo.mail}
                        </span></p>
                    <p className={styles.row}><label
                        className={styles.rowLabel}>{localText(lang, '注册时间', 'Registration Time')}:</label>
                        <span className={styles.rowContent}>
                            {userInfo.create_time}
                        </span></p>
                    <p className={styles.row}><label
                        className={styles.rowLabel}>{localText(lang, '个人简介', 'Personal Profile')}:</label>
                        <span className={styles.rowContent}>
                            {userInfo.description}
                        </span></p>
                </div>
            </div>
        </div>
    </ContentLayout>
}
