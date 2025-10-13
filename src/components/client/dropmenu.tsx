'use client';

import Menu, {MenuProps} from '@mui/material/Menu';
import {alpha, styled} from "@mui/system";

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        disablePortal={true}
        aria-hidden={undefined}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        closeAfterTransition={false}
        slotProps={{
            root: {
                'aria-hidden': undefined, // 移除 aria-hidden
            }
        }}
        {...props}
    />
))(({theme}) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: '6rem',
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '2px 0',
            '& .MuiMenuItem-root': {
                padding: '2px 8px',
                minHeight: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                marginRight: theme.spacing(1),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export {StyledMenu};
