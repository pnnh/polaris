import React from 'react'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {langEn} from "@pnnh/atom";
import {css} from "@/gen/styled/css";
import {useServerConfig} from "@/components/server/config";
import {serverGetUserinfo} from "@/components/server/account/account";
import {NeedLoginPage} from "@/components/server/content/needLogin";
import GlobalLayout from "@/components/server/global";
import ComputerIcon from '@mui/icons-material/Computer';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import {transText} from "@/components/common/locales/normal";
import {isAnonymousAccount} from "@/components/common/models/account/account";

const pageStyles = {
    consolePage: css`
        overflow-x: hidden;
        overflow-y: auto;
        height: 100vh;
    `,
    pageContainer: css`
        width: 1024px;
        margin: 0 auto;
    `,
    userInfo: css`
        margin-top: 1rem;
        font-size: 1rem;
    `,
    libGrid: css`
        margin-top: 1rem;
    `,
    libHeader: css`
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        gap: 1rem;
        background-color: #f0f0f0;
    `,
    libLink: css`
        font-size: 1.2rem;
        color: #000;
        text-decoration: none;
        padding: 0.5rem 1rem;
        
        &:hover {
            background-color: #f0f0f0;
        }
    `,
    libBody: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-top: 1rem;
    `,
    libCard: css`
        border: solid 1px #ccc;
        min-height: 4rem;
    `,
    toolGrid: css`
        margin-top: 1rem;
    `,
    toolHeader: css`
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        gap: 1rem;
        background-color: #f0f0f0;
    `,
    toolLink: css`
        font-size: 1.2rem;
        color: #000;
        text-decoration: none;
        padding: 0.5rem 1rem;
        
        &:hover {
            background-color: #f0f0f0;
        }
    `,
    toolBody: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-top: 1rem;
    `,
    toolCard: css`
        border: solid 1px #ccc;
        min-height: 4rem;
    `
}

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
        <div className={pageStyles.consolePage}>
            <div className={pageStyles.pageContainer}>
                <div>欢迎信息</div>
                <div className={pageStyles.userInfo}>
                    {transText(lang, '欢迎使用控制台', 'Welcome to the console')}
                    <br/>
                    {transText(lang, '请在左侧菜单中选择功能', 'Please select a function from the left menu')}
                    <br/>
                    {currentUserInfo.nickname}
                    <a href={`/${lang}/console/userinfo`}>个人信息</a>
                    <a>退出登录</a>
                </div>
                <div className={pageStyles.libGrid}>
                    <div className={pageStyles.libHeader}>
                        {/*展示本地和远程库列表，数据存储在本地；使用角标显示不同库类型；主要区别是本地库是否关联了远程库的地址，类似Git；
                    当点击库链接时，根据库类型千万不同页面视图（笔记或图片，本地或远程）；*/}
                        <a className={pageStyles.libLink}>个人目录</a>
                        <a href={`/${lang}/console/personal`} className={pageStyles.libLink}>个人主页</a>
                    </div>
                    <div className={pageStyles.libBody}>
                        <div className={pageStyles.libCard}>
                            <ComputerIcon/>
                            最近笔记1
                        </div>
                        <div className={pageStyles.libCard}>
                            <ComputerIcon/>
                            最近笔记2
                        </div>
                        <div className={pageStyles.libCard}>
                            <ComputerIcon/>
                            <a href={`/${lang}/console/personal/images`} className={pageStyles.libLink}>本地图片库</a>
                        </div>
                        <div className={pageStyles.libCard}>
                            <CloudQueueIcon/>
                            最近笔记库
                        </div>
                        <div className={pageStyles.libCard}>
                            <CloudQueueIcon/>
                            <a href={`/${lang}/console/personal/images`} className={pageStyles.libLink}>最近图片库</a></div>

                    </div>
                </div>
                <div className={pageStyles.libGrid}>
                    <div className={pageStyles.libHeader}>
                        <a className={pageStyles.libLink}>社区目录</a>
                        <a href={`/${lang}/console/community`} className={pageStyles.libLink}>社区主页</a>
                    </div>
                    <div className={pageStyles.libBody}>
                        <div className={pageStyles.libCard}>
                            <ComputerIcon/>
                            频道1
                        </div>
                        <div className={pageStyles.libCard}>
                            <ComputerIcon/>
                            <a href={`/${lang}/console/personal/images`} className={pageStyles.libLink}>本地图片库</a>
                        </div>
                        <div className={pageStyles.libCard}>
                            <CloudQueueIcon/>
                            频道2
                        </div>

                    </div>
                </div>
                <div className={pageStyles.libGrid}>
                    <div className={pageStyles.libHeader}>
                        <a className={pageStyles.libLink}>管理目录</a>
                        <a href={`/${lang}/console/management`} className={pageStyles.libLink}>管理主页</a>
                    </div>
                    <div className={pageStyles.libBody}>
                        <div className={pageStyles.libCard}>
                            <ComputerIcon/>
                            频道1
                        </div>
                        <div className={pageStyles.libCard}>
                            <ComputerIcon/>
                            <a href={`/${lang}/console/personal/images`} className={pageStyles.libLink}>本地图片库</a>
                        </div>
                        <div className={pageStyles.libCard}>
                            <CloudQueueIcon/>
                            频道2
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </GlobalLayout>
}


