import {css} from "@/gen/styled/css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {sanitizeUrl} from "@pnnh/atom";
import {AccountModel, isAnonymousAccount} from "@/components/common/models/account/account";

const styles = {
    userAction: css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
    `,
    userPhoto: css`
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 50%;
        overflow: hidden;
        position: relative;

        &:hover {
            cursor: pointer;
            outline: 2px solid #f85f6c;
        }

        & img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }
    `,
    userNickname: css`
        display: none;
    `,
    loginLink: css`
        color: var(--text-primary-color);
        text-decoration: none;
        position: relative;
    `,
    logoutLink: css`
        color: #f85f6c;
        text-decoration: none;
        font-size: 1rem;
        line-height: 1rem;
        position: relative;
    `,
};

export function UserAction({lang, userInfo}: {
    lang: string, userInfo: AccountModel | undefined
}) {
    const photoUrl = sanitizeUrl(userInfo?.photoUrl)
    if (userInfo && !isAnonymousAccount(userInfo)) {
        return <div className={styles.userAction}>
            <a className={styles.userPhoto} title={userInfo.nickname} href={`/${lang}/console`}>
                <img src={photoUrl} alt="User Avatar"/>
                <span className={styles.userNickname}>{userInfo.nickname}</span>
            </a>

            {/*<a className={'logoutLink'} href={'javascript:void(0)'} onClick={() => {*/}
            {/*    accountSignout(portalUrl, {}).then(() => {*/}
            {/*        window.location.href = '/'*/}
            {/*    })*/}
            {/*}}>退出</a>*/}
        </div>
    }
    return <div className={styles.userAction}>
        <a className={styles.loginLink} href={`/${lang}/account/signin`}>
            <AccountCircleIcon/>
            {/*{transKey(lang, 'signin')}*/}
        </a>
        {/*<a className={styles.loginLink} href={`${lang}/account/signup`}>注册</a>*/}
    </div>
}
