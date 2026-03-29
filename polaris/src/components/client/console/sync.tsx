'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CodeOk, CommonResult } from "@pnnh/atom";
import { clientMakePost } from "@pnnh/atom/browser";
import { transKey } from "@/components/common/locales/normal";
import { RefreshCw } from 'lucide-react';

export default function PSSyncButton({ children, syncUrl, lang, resTitle }: {
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
            <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{transKey(lang, 'console.article.syncConfirmTitle')}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        {transKey(lang, 'console.article.syncConfirmMessage')}
                    </DialogDescription>
                    <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{resTitle}</p>
                    <DialogFooter>
                        <Button variant="ghost" size={'sm'} onClick={handleClose}>
                            {transKey(lang, 'console.common.cancel')}
                        </Button>
                        <Button size={'sm'} onClick={handleSubmit}>
                            {transKey(lang, 'console.article.confirmSync')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
