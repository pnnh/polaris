'use client';

import {css} from "@/gen/styled/css";
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import {getLangInfo, replaceLangInUrl, supportedLanguages} from "@/components/common/language";
import LanguageIcon from '@mui/icons-material/Language';
import {StyledMenu} from "@/components/client/dropmenu";

const styles = {
    langSelector: css`
        display: inline-flex;
        height: 1.5rem;
        flex-direction: row;
        gap: 0.3rem;
        justify-items: center;
        cursor: pointer;

        & svg {
            height: 20px;
            width: 20px;
            color: var(--text-primary-color);
            fill: var(--text-primary-color);
            stroke: var(--text-primary-color);
        }
    `,
    langItem: css`
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        height: 1.5rem;
        gap: 0.3rem;
        cursor: pointer;
        font-size: 0.9rem;
        color: var(--text-primary-color);
        background-color: var(--background-color);

        & svg {
            height: 24px;
            width: 24px;
            color: var(--text-primary-color);
            fill: var(--text-primary-color);
            stroke: var(--text-primary-color);
        }
    `,
};

export function PSLanguageSelector({lang, currentUrl}: { lang: string, currentUrl: string }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const currentLanguage = lang;
    const langInfo = getLangInfo(currentLanguage)
    if (!langInfo) {
        throw new Error('Invalid language: ' + currentLanguage)
    }
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const goUrl = (targetLang: string) => {
        const targetUrl = replaceLangInUrl(window.location.href, targetLang);
        setAnchorEl(null);
        window.location.href = targetUrl;
    }
    return <>
        <div className={styles.langSelector}
             onClick={handleClick}>
            <LanguageIcon aria-hidden={undefined}/>
            {/*{langInfo.name}*/}
        </div>
        <StyledMenu
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            anchorEl={anchorEl}
            open={open}>
            {
                supportedLanguages.map(language => (
                    <MenuItem key={language.key} onClick={() => goUrl(language.key)}
                              selected={lang === language.key} disableRipple>
                        {language.name}
                    </MenuItem>
                ))
            }
        </StyledMenu>
    </>
}
