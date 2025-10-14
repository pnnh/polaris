'use client';

import styles from './theme.module.scss'
import {useState} from "react";
import {StyledMenu} from "@/components/client/dropmenu";
import MenuItem from "@mui/material/MenuItem";
import ContrastIcon from '@mui/icons-material/Contrast';
import {clientSetCurrentTheme, ThemeType} from "@/services/client/theme";
import {langText} from "@/services/common/language";

export function ThemeSwitch({themeName, lang}: { themeName: string, lang: string }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const switchTheme = (targetTheme: ThemeType) => {
        clientSetCurrentTheme(targetTheme)
        setAnchorEl(null);
        window.location.reload()
    }
    return <>
        <div className={styles.themeSelector}
             onClick={handleClick}>
            <ContrastIcon className={styles.themeIcon} aria-hidden={undefined} sx={{cursor: 'pointer'}}/>
            {themeName === 'dark' ? langText(lang, "DarkTheme") : themeName === 'light' ?
                langText(lang, "LightTheme") : langText(lang, "AutoTheme")}
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
            <MenuItem onClick={() => switchTheme('auto')} disableRipple
                      selected={lang === 'auto'}>
                {langText(lang, "AutoTheme")}
            </MenuItem>
            <MenuItem onClick={() => switchTheme('light')} disableRipple
                      selected={lang === 'light'}>
                {langText(lang, "LightTheme")}
            </MenuItem>
            <MenuItem onClick={() => switchTheme('dark')} disableRipple
                      selected={lang === 'dark'}>
                {langText(lang, "DarkTheme")}
            </MenuItem>
        </StyledMenu>
    </>
}
