'use client';

import {css} from "@/gen/styled/css";
import {CircleUser, Monitor} from 'lucide-react';
import {sanitizeUrl} from "@pnnh/atom";
import {AccountModel, isAnonymousAccount} from "@/components/common/models/account/account";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/client/dropmenu";
import {transTodo} from "@/components/common/locales/normal";

export function UserActionDropdown({lang, userInfo}: {
    lang: string, userInfo: AccountModel | undefined
}) {
    const photoUrl = sanitizeUrl(userInfo?.photoUrl)

    if (userInfo && !isAnonymousAccount(userInfo)) {
        return (
            <div className={styles.userAction}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className={styles.userPhoto} title={userInfo.nickname}>
                            <img src={photoUrl} alt="User Avatar"/>
                            <span className={styles.userNickname}>{userInfo.nickname}</span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <a className={styles.menuItem} href={`/${lang}/console`}>
                                <Monitor size={18}/>
                                <span>{transTodo('控制台')}</span>
                            </a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    return (
        <div className={styles.userAction}>
            <a className={styles.loginLink} href={`/${lang}/account/signin`}>
                <CircleUser size={24}/>
            </a>
        </div>
    )
}

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
    menuItem: css`
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        color: var(--text-primary-color);
        text-decoration: none;
    `,
};
