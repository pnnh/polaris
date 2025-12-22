import {AccountModel, isAnonymousAccount} from "@/atom/common/models/account";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {transKey} from "@/components/common/locales/normal";
import {sanitizeUrl} from "@/atom/common/utils/uri";

export const userAction = `
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
`;
export const userPhoto = `
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  overflow: hidden;
  position: relative;

  &:hover {
    cursor: pointer;
    outline: 2px solid #f85f6c;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;
export const loginLink = `
  color: var(--text-primary-color);
  text-decoration: none;
  position: relative;
`;
export const logoutLink = `
  color: #f85f6c;
  text-decoration: none;
  font-size: 1rem;
  line-height: 1rem;
  position: relative;
`;

export function UserAction({lang, userInfo}: {
    lang: string, userInfo: AccountModel | undefined
}) {
    const photoUrl = sanitizeUrl(userInfo?.photoUrl)
    if (userInfo && !isAnonymousAccount(userInfo)) {
        return <div className={userAction}>
            <a className={userPhoto} title={userInfo.nickname} href={`/${lang}/console`}>
                <img src={photoUrl} alt="User Avatar"/>
                <span>{userInfo.nickname}</span>
            </a>

            {/*<a className={'logoutLink'} href={'javascript:void(0)'} onClick={() => {*/}
            {/*    accountSignout(portalUrl, {}).then(() => {*/}
            {/*        window.location.href = '/'*/}
            {/*    })*/}
            {/*}}>退出</a>*/}
        </div>
    }
    return <div className={userAction}>
        <a className={loginLink} href={`/${lang}/account/signin`}>
            <AccountCircleIcon/>
            {transKey(lang, 'signin')}
        </a>
        {/*<a className={loginLink} href={`${lang}/account/signup`}>注册</a>*/}
    </div>
}
