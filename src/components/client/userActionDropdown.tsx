'use client';

import {css} from "@/gen/styled/css";
import { CircleUser, Monitor, Cloud } from 'lucide-react';
import {sanitizeUrl} from "@pnnh/atom";
import {AccountModel, isAnonymousAccount} from "@/components/common/models/account/account";
import {StyledMenu} from "@/components/client/dropmenu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import {transTodo} from "@/components/common/locales/normal";

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

export function UserActionDropdown({lang, userInfo}: {
    lang: string, userInfo: AccountModel | undefined
}) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const photoUrl = sanitizeUrl(userInfo?.photoUrl)

    if (userInfo && !isAnonymousAccount(userInfo)) {
        return <div className={styles.userAction}>
            <div className={styles.userPhoto} title={userInfo.nickname} onClick={handleClick}>
                <img src={photoUrl} alt="User Avatar"/>
                <span className={styles.userNickname}>{userInfo.nickname}</span>
            </div>
            <StyledMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <a className={styles.menuItem} href={`/${lang}/console`}>
                        <Monitor size={18}/>
                        <span>{transTodo('个人控制台')}</span>
                    </a>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <a className={styles.menuItem} href={`/${lang}/community`}>
                        <Cloud size={18}/>
                        <span>{transTodo('社区控制台')}</span>
                    </a>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <a className={styles.menuItem} href={`/${lang}/management`}>
                        <Monitor size={18}/>
                        <span>{transTodo('管理控制台')}</span>
                    </a>
                </MenuItem>
            </StyledMenu>
        </div>
    }

    return <div className={styles.userAction}>
        <a className={styles.loginLink} href={`/${lang}/account/signin`}>
            <CircleUser size={24}/>
        </a>
    </div>
}
