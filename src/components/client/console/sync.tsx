'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {CodeOk, CommonResult} from "@pnnh/atom";
import {clientMakePost} from "@pnnh/atom/browser";
import {transKey} from "@/components/common/locales/normal";
import { RefreshCw } from 'lucide-react';

export default function PSSyncButton({children, syncUrl, lang, resTitle}: {
    children: React.ReactNode,
    syncUrl: string,
    lang: string,
    resTitle: string
}) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    const handleSubmit = () => {
        clientMakePost<CommonResult<string>>(syncUrl, {}).then((syncResult) => {
            if (syncResult && syncResult.code === CodeOk) {
                console.debug('Sync successful', syncResult);
                handleClose();
                window.location.reload();
                return
            }
            console.error('Sync failed', syncResult);
            alert(transKey(lang, 'console.article.syncFailed'));
        })
    };

    return (
        <div>
            <Button variant="ghost" size={'sm'} onClick={handleClickOpen}>
                <RefreshCw size={16} />
                {children}
            </Button>
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
                    <Button variant="ghost" size={'sm'} onClick={handleClose}>
                        {transKey(lang, 'console.common.cancel')}
                    </Button>
                    <Button size={'sm'} onClick={handleSubmit} autoFocus>
                        {transKey(lang, 'console.article.confirmSync')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
