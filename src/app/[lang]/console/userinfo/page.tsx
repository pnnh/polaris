import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {css} from '@emotion/css';
import {useServerConfig} from "@/components/server/config";
import {getAccountUrn} from "@/atom/common/models/account";
import {serverGetUserinfo} from "@/components/server/account/account";
import {langEn} from "@/atom/common/language";
import {NeedLoginPage} from "@/components/server/content/needLogin";
import {ConsoleLayout} from "@/components/server/console/layout";
import {transText} from "@/components/common/locales/normal";
import {Request, Response} from "express";

const styles = {
    userInfoContainer: css`
        /* Parent container */
    `,
    userInfoCard: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        background-color: var(--background-color);
        margin-top: 16px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `,
    avatar: css`
        width: 12rem;
        height: 8rem;
        border-radius: 50%;
        margin-bottom: 1rem;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }
    `,
    editLink: css`
        display: inline-block;
        position: absolute;
        top: 2rem;
        right: 2rem;
    `,
    details: css`
        display: table;
        align-items: center;
        text-align: center;
        margin: 0 auto;
    `,
    row: css`
        display: table-row;
        font-weight: bold;
        margin-bottom: 10px;
    `,
    rowLabel: css`
        font-weight: normal;
        color: var(--text-primary-color);
        width: 50%;
        display: table-cell;
        text-align: right;
        padding-right: 1rem;
    `,
    rowContent: css`
        color: var(--text-primary-color);
        font-size: 1rem;
        display: table-cell;
        text-align: left;
        word-break: break-all;
    `
};

export async function Page(request: Request, response: Response) {
    const pathname = request.path


    const lang = request.params.lang || langEn

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    const serverConfig = await useServerConfig()
    const interlanPortalUrl = serverConfig.INTERNAL_PORTAL_URL

    const userInfo = await serverGetUserinfo(interlanPortalUrl)
    if (!userInfo) {
        return <NeedLoginPage lang={lang}></NeedLoginPage>
    }

    return <ConsoleLayout lang={lang}
                          metadata={metadata} userInfo={userInfo}>
        <div className={styles.userInfoContainer}>
            <div className={styles.userInfoCard}>
                <div className={styles.avatar}>
                    <img src={userInfo.photoUrl} alt="User Avatar"/>
                </div>
                <div className={styles.editLink}>
                    <a href={`/${lang}/console/userinfo/edit`}>{transText(lang, '修改资料', 'Edit profile')}</a>
                </div>
                <div className={styles.details}>
                    <p className={styles.row}>
                        <label className={styles.rowLabel}>{transText(lang, '用户标识', 'UserID')}:</label>
                        <span className={styles.rowContent}>{getAccountUrn(userInfo.uid)}</span>
                    </p>
                    <p className={styles.row}>
                        <label className={styles.rowLabel}>{transText(lang, '用户名', 'Username')}: </label>
                        <span className={styles.rowContent}>{userInfo.username}</span></p>
                    <p className={styles.row}>
                        <label className={styles.rowLabel}>{transText(lang, '用户昵称', 'Nickname')}：</label>
                        <span className={styles.rowContent}>{userInfo.nickname}</span>
                    </p>
                    <p className={styles.row}><label
                        className={styles.rowLabel}>{transText(lang, '邮箱', 'Email')}:</label>
                        <span className={styles.rowContent}>
                            {userInfo.mail}
                        </span></p>
                    <p className={styles.row}><label
                        className={styles.rowLabel}>{transText(lang, '注册时间', 'Registration Time')}:</label>
                        <span className={styles.rowContent}>
                            {userInfo.create_time}
                        </span></p>
                    <p className={styles.row}><label
                        className={styles.rowLabel}>{transText(lang, '个人简介', 'Personal Profile')}:</label>
                        <span className={styles.rowContent}>
                            {userInfo.description}
                        </span></p>
                </div>
            </div>
        </div>
    </ConsoleLayout>
}
