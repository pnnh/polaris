import {getPathname} from "@/components/server/pathname";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {css} from "@/gen/styled/css";
import {useServerConfig} from "@/components/server/config";
import {serverGetUserinfo} from "@/components/server/account/account";
import {langEn} from "@pnnh/atom";
import {NeedLoginPage} from "@/components/server/content/needLogin";
import ConsoleLayout from "@/components/server/console/layout";
import {getAccountUrn} from "@/components/common/models/account/account";
import {transKey} from "@/components/common/locales/normal";

const pageStyles = {
    userInfoContainer: css`
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
        padding-bottom: 1rem;
    `,
    rowContent: css`
        width: 50%;
        display: table-cell;
        text-align: left;
        padding-left: 1rem;
        padding-bottom: 1rem;
    `
}

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
    const interlanPortalUrl = serverConfig.INTERNAL_PORTAL_URL

    const userInfo = await serverGetUserinfo(interlanPortalUrl)
    if (!userInfo) {
        return <NeedLoginPage lang={lang}></NeedLoginPage>
    }

    return <ConsoleLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={userInfo}>
        <div className={pageStyles.userInfoContainer}>
            <div className={pageStyles.userInfoCard}>
                <div className={pageStyles.avatar}>
                    <img src={userInfo.photoUrl} alt="User Avatar"/>
                </div>
                <div className={pageStyles.editLink}>
                    <a href={`/${lang}/console/userinfo/edit`}>{transKey(lang, "console.userinfo.editProfile")}</a>
                </div>
                <div className={pageStyles.details}>
                    <p className={pageStyles.row}>
                        <label className={pageStyles.rowLabel}>{transKey(lang, "console.userinfo.userId")}:</label>
                        <span className={pageStyles.rowContent}>{getAccountUrn(userInfo.uid)}</span>
                    </p>
                    <p className={pageStyles.row}>
                        <label className={pageStyles.rowLabel}>{transKey(lang, "console.userinfo.username")}: </label>
                        <span className={pageStyles.rowContent}>{userInfo.username}</span></p>
                    <p className={pageStyles.row}>
                        <label className={pageStyles.rowLabel}>{transKey(lang, "console.userinfo.nickname")}：</label>
                        <span className={pageStyles.rowContent}>{userInfo.nickname}</span>
                    </p>
                    <p className={pageStyles.row}><label
                        className={pageStyles.rowLabel}>{transKey(lang, "console.userinfo.email")}:</label>
                        <span className={pageStyles.rowContent}>
                            {userInfo.mail}
                        </span></p>
                    <p className={pageStyles.row}><label
                        className={pageStyles.rowLabel}>{transKey(lang, "console.userinfo.registrationTime")}:</label>
                        <span className={pageStyles.rowContent}>
                            {userInfo.create_time}
                        </span></p>
                    <p className={pageStyles.row}><label
                        className={pageStyles.rowLabel}>{transKey(lang, "console.userinfo.personalProfile")}:</label>
                        <span className={pageStyles.rowContent}>
                            {userInfo.description}
                        </span></p>
                </div>
            </div>
        </div>
    </ConsoleLayout>
}
