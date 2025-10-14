'use client';

import styles from './language.module.css';

import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import {
    getLangInfo,
    langEnUS, replaceLangInUrl,
    supportedLanguages
} from "@/services/common/language";
import LanguageIcon from '@mui/icons-material/Language';
import {StyledMenu} from "@/components/client/dropmenu";

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
            {langInfo.name}
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
