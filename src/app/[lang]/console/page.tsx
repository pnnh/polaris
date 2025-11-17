import React from 'react'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {langEn} from "@/atom/common/language";
import styles from './page.module.scss'
import {useServerConfig} from "@/components/server/config";
import {serverGetUserinfo} from "@/components/server/account/account";
import {isAnonymousAccount} from "@/atom/common/models/account";
import {NeedLoginPage} from "@/components/server/content/needLogin";
import GlobalLayout from "@/components/server/global";
import ComputerIcon from '@mui/icons-material/Computer';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import {transText} from "@/components/common/locales/normal";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.INTERNAL_PORTAL_URL
    const currentUserInfo = await serverGetUserinfo(portalUrl);
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    if (!currentUserInfo || isAnonymousAccount(currentUserInfo)) {
        return <NeedLoginPage lang={lang}></NeedLoginPage>
    }

    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.consolePage}>
            <div className={styles.pageContainer}>
                <div>欢迎信息</div>
                <div className={styles.userInfo}>
                    {transText(lang, '欢迎使用控制台', 'Welcome to the console')}
                    <br/>
                    {transText(lang, '请在左侧菜单中选择功能', 'Please select a function from the left menu')}
                    <br/>
                    {currentUserInfo.nickname}
                    <a href={`/${lang}/console/userinfo`}>个人信息</a>
                    <a>退出登录</a>
                </div>
                <div className={styles.libGrid}>
                    <div className={styles.libHeader}>
                        {/*展示本地和远程库列表，数据存储在本地；使用角标显示不同库类型；主要区别是本地库是否关联了远程库的地址，类似Git；
                    当点击库链接时，根据库类型千万不同页面视图（笔记或图片，本地或远程）；*/}
                        <a className={styles.libLink}>个人目录</a>
                        <a href={`/${lang}/console/personal`} className={styles.libLink}>个人主页</a>
                    </div>
                    <div className={styles.libBody}>
                        <div className={styles.libCard}>
                            <ComputerIcon/>
                            最近笔记1
                        </div>
                        <div className={styles.libCard}>
                            <ComputerIcon/>
                            最近笔记2
                        </div>
                        <div className={styles.libCard}>
                            <ComputerIcon/>
                            <a href={`/${lang}/console/personal/images`} className={styles.libLink}>本地图片库</a>
                        </div>
                        <div className={styles.libCard}>
                            <CloudQueueIcon/>
                            最近笔记库
                        </div>
                        <div className={styles.libCard}>
                            <CloudQueueIcon/>
                            <a href={`/${lang}/console/personal/images`} className={styles.libLink}>最近图片库</a></div>

                    </div>
                </div>
                <div className={styles.libGrid}>
                    <div className={styles.libHeader}>
                        <a className={styles.libLink}>社区目录</a>
                        <a href={`/${lang}/console/community`} className={styles.libLink}>社区主页</a>
                    </div>
                    <div className={styles.libBody}>
                        <div className={styles.libCard}>
                            <ComputerIcon/>
                            频道1
                        </div>
                        <div className={styles.libCard}>
                            <ComputerIcon/>
                            <a href={`/${lang}/console/personal/images`} className={styles.libLink}>本地图片库</a>
                        </div>
                        <div className={styles.libCard}>
                            <CloudQueueIcon/>
                            频道2
                        </div>

                    </div>
                </div>
                <div className={styles.libGrid}>
                    <div className={styles.libHeader}>
                        <a className={styles.libLink}>管理目录</a>
                        <a href={`/${lang}/console/management`} className={styles.libLink}>管理主页</a>
                    </div>
                    <div className={styles.libBody}>
                        <div className={styles.libCard}>
                            <ComputerIcon/>
                            频道1
                        </div>
                        <div className={styles.libCard}>
                            <ComputerIcon/>
                            <a href={`/${lang}/console/personal/images`} className={styles.libLink}>本地图片库</a>
                        </div>
                        <div className={styles.libCard}>
                            <CloudQueueIcon/>
                            频道2
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </GlobalLayout>
}


