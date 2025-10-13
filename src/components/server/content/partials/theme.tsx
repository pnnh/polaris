'use client';

import {createTheme} from '@mui/material/styles';
import styles from './theme.module.scss'
import {useState} from "react";
import {StyledMenu} from "@/components/client/dropmenu";
import MenuItem from "@mui/material/MenuItem";
import ContrastIcon from '@mui/icons-material/Contrast';
import {clientGetCurrentTheme, clientSetCurrentTheme, ThemeType} from "@/services/client/theme";
import {clientGetCurrentLanguage} from "@/services/client/language";
import {langText} from "@/services/common/language";

const lightTheme = createTheme({
    cssVariables: true,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // 全局禁用文字大写
                },
            },
        },
    },
    palette: {
        mode: 'light',
    },
});

const darkTheme = createTheme({
    cssVariables: true,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // 全局禁用文字大写
                },
            },
        },
    },
    palette: {
        mode: 'dark',
    },
})

export {lightTheme, darkTheme};

export function ThemeSwitch() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const currentTheme = clientGetCurrentTheme()
    const currentLanguage = clientGetCurrentLanguage()

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
            {currentTheme === 'auto' ? langText(currentLanguage, "AutoTheme") : currentTheme === 'light' ?
                langText(currentLanguage, "LightTheme") : langText(currentLanguage, "DarkTheme")}
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
            <MenuItem onClick={() => switchTheme('auto')} disableRipple>
                {langText(currentLanguage, "AutoTheme")}
            </MenuItem>
            <MenuItem onClick={() => switchTheme('light')} disableRipple>
                {langText(currentLanguage, "LightTheme")}
            </MenuItem>
            <MenuItem onClick={() => switchTheme('dark')} disableRipple>
                {langText(currentLanguage, "DarkTheme")}
            </MenuItem>
        </StyledMenu>
    </>
}
