'use client';

import {useState} from "react";
import {StyledMenu} from "@/components/client/dropmenu";
import MenuItem from "@mui/material/MenuItem";
import ContrastIcon from '@mui/icons-material/Contrast';
import {clientSetCurrentTheme, ThemeType} from "@/components/client/theme";
import {transKey} from "@/components/common/locales/normal";


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
        <div className="themeSelector"
             onClick={handleClick}>
            <ContrastIcon className="themeIcon" aria-hidden={undefined} sx={{cursor: 'pointer'}}/>
            {/*{themeName === 'dark' ? transKey(lang, "DarkTheme") : themeName === 'light' ?*/}
            {/*    transKey(lang, "LightTheme") : transKey(lang, "AutoTheme")}*/}
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
                {transKey(lang, "AutoTheme")}
            </MenuItem>
            <MenuItem onClick={() => switchTheme('light')} disableRipple
                      selected={lang === 'light'}>
                {transKey(lang, "LightTheme")}
            </MenuItem>
            <MenuItem onClick={() => switchTheme('dark')} disableRipple
                      selected={lang === 'dark'}>
                {transKey(lang, "DarkTheme")}
            </MenuItem>
        </StyledMenu>

        <style jsx>{`
            .themeSelector {
                cursor: pointer;
                display: flex;
                flex-direction: row;
                gap: 0.2rem;
            }

            .themeSelector :global(.themeIcon) {
                color: var(--text-primary-color);
                background: var(--background-color);
            }
        `}</style>
    </>
}
