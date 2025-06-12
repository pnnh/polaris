import Link from "next/link";
import styles from './userinfo.module.scss'
import {AccountModel, isAnonymousAccount} from "@/atom/common/models/account";

export function UserAction({portalUrl, userInfo}: { portalUrl: string, userInfo: AccountModel }) {

    if (userInfo && !isAnonymousAccount(userInfo)) {
        return <div className={styles.userAction}>
            <a className={styles.userPhoto} title={userInfo.nickname} href={'/account/userinfo'}>
                <img src={userInfo.photoUrl} alt="User Avatar"/>
            </a>

            {/*<a className={'logoutLink'} href={'javascript:void(0)'} onClick={() => {*/}
            {/*    accountSignout(portalUrl, {}).then(() => {*/}
            {/*        window.location.href = '/'*/}
            {/*    })*/}
            {/*}}>退出</a>*/}
        </div>
    }
    return <div className={styles.userAction}>
        <a className={styles.loginLink} href={'/account/signin'}>登录</a>
        <a className={styles.loginLink} href={'/account/signup'}>注册</a>
    </div>
}
