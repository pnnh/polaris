'use client';

import * as React from 'react';
import {styled} from '@mui/material/styles';
import Button, {ButtonProps} from '@mui/material/Button';
import {blue} from '@mui/material/colors';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {CodeOk, CommonResult} from "@pnnh/atom";
import {clientMakePost} from "@pnnh/atom/browser";
import {transKey} from "@/components/common/locales/normal";
import SyncIcon from '@mui/icons-material/Sync';

const ColorButton = styled(Button)<ButtonProps>(({theme}) => ({
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    '&:hover': {
        backgroundColor: blue[700],
    },
}));

export default function PSSyncButton({children, syncUrl, lang, resTitle}: {
    children: React.ReactNode,
    syncUrl: string,
    lang: string,
    resTitle: string
}) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        clientMakePost<CommonResult<string>>(syncUrl, {}).then((syncResult) => {
            if (syncResult && syncResult.code === CodeOk) {
                console.debug('Sync successful', syncResult);
                handleClose();
                window.location.reload(); // Refresh the page to reflect changes
                return
            }
            console.error('Sync failed', syncResult);
            alert(transKey(lang, 'console.article.syncFailed'));
        })
    };
    
    return (
        <div>
            <ColorButton variant="text" size={'small'} startIcon={<SyncIcon />} onClick={handleClickOpen}>
                {children}
            </ColorButton>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>{transKey(lang, 'console.article.syncConfirmTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {transKey(lang, 'console.article.syncConfirmMessage')}
                    </DialogContentText>
                    <DialogContentText sx={{ mt: 2, fontWeight: 'bold' }}>
                        {resTitle}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        {transKey(lang, 'console.common.cancel')}
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" autoFocus>
                        {transKey(lang, 'console.article.confirmSync')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
