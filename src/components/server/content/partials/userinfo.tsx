import styles from './userinfo.module.scss'
import {AccountModel, isAnonymousAccount} from "@/components/common/models/account/account";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {sanitizeUrl} from "@pnnh/atom";

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
