import React from 'react'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {langEn, localText} from "@/atom/common/language";
import styles from './page.module.scss'
import {useServerConfig} from "@/components/server/config";
import {serverGetUserinfo} from "@/components/server/account/account";
import {isAnonymousAccount} from "@/atom/common/models/account";
import {NeedLoginPage} from "@/components/server/content/needLogin";
import GlobalLayout from "@/components/server/global";
import ComputerIcon from '@mui/icons-material/Computer';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    const currentUserInfo = await serverGetUserinfo(portalUrl);
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    if (!currentUserInfo || isAnonymousAccount(currentUserInfo)) {
        return <NeedLoginPage lang={lang}></NeedLoginPage>
    }

    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.consolePage}>
            <div>欢迎信息</div>
            <div className={styles.userInfo}>
                {localText(lang, '欢迎使用控制台', 'Welcome to the console')}
                <br/>
                {localText(lang, '请在左侧菜单中选择功能', 'Please select a function from the left menu')}
                <br/>
                {currentUserInfo.nickname}
                <a href={`/${lang}/console/userinfo`}>个人信息</a>
                <a>退出登录</a>
            </div>
            <div className={styles.libGrid}>
                <div className={styles.libHeader}>
                    {/*展示本地和远程库列表，数据存储在本地；使用角标显示不同库类型；主要区别是本地库是否关联了远程库的地址，类似Git；
                    当点击库链接时，根据库类型千万不同页面视图（笔记或图片，本地或远程）；*/}
                    <a className={styles.libLink}>最近使用的库</a>
                    <a href={`/${lang}/console/libraries`} className={styles.libLink}>全部库</a>
                </div>
                <div className={styles.libBody}>
                    <div className={styles.libCard}>
                        <ComputerIcon/>
                        本地笔记库
                    </div>
                    <div className={styles.libCard}>
                        <ComputerIcon/>
                        <a href={`/${lang}/console/images`} className={styles.libLink}>本地图片库</a>
                    </div>
                    <div className={styles.libCard}>
                        <CloudQueueIcon/>
                        远程笔记库
                    </div>
                    <div className={styles.libCard}>
                        <CloudQueueIcon/>
                        <a href={`/${lang}/console/images`} className={styles.libLink}>远程图片库</a></div>

                </div>
            </div>
            <div className={styles.libGrid}>
                <div className={styles.libHeader}>
                    <a className={styles.libLink}>最近使用的频道</a>
                    <a href={`/${lang}/console/channels`} className={styles.libLink}>全部频道</a>
                </div>
                <div className={styles.libBody}>
                    <div className={styles.libCard}>
                        <ComputerIcon/>
                        频道1
                    </div>
                    <div className={styles.libCard}>
                        <ComputerIcon/>
                        <a href={`/${lang}/console/images`} className={styles.libLink}>本地图片库</a>
                    </div>
                    <div className={styles.libCard}>
                        <CloudQueueIcon/>
                        频道2
                    </div>

                </div>
            </div>
        </div>
    </GlobalLayout>
}


