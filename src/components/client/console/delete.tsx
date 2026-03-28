'use client';

import * as React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CodeOk, PLDeleteResult } from "@pnnh/atom";
import { clientMakePost } from "@pnnh/atom/browser";
import { transKey } from "@/components/common/locales/normal";
import { css } from "@/gen/styled/css";
import { Button } from '@/components/ui/button';

export default function PSDeleteButton({ children, deleteUrl, lang, resTitle }: {
    children: React.ReactNode,
    deleteUrl: string,
    lang: string,
    resTitle: string
}) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        console.debug('handleClose');
        setOpen(false);
    };

    const handleSubmit = (value: string) => {
        console.debug('handleSubmit', value);
        clientMakePost<PLDeleteResult>(deleteUrl, {}).then((deleteResult) => {
            if (deleteResult && deleteResult.code === CodeOk) {
                console.debug('Delete successful', deleteResult);
                handleClose();
                window.location.reload(); // Refresh the page to reflect changes
                return
            }
            console.error('Delete failed', deleteResult);
            alert(transKey(lang, 'console.delete.failed'));

        })
    };
    return (
        <div>
            <Button variant="destructive" size={'sm'} onClick={handleClickOpen}>{children}</Button>
            <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
                <DialogContent>
                    <div className={deleteStyles.deleteDialog}>

                        <div className={deleteStyles.dialogTitle}>
                            {transKey(lang, 'console.delete.confirm')}
                        </div>
                        <div className={deleteStyles.resTitle}>
                            {resTitle}
                        </div>
                        <div className={deleteStyles.dialogActions}>
                            <Button size={'sm'} onClick={() => handleSubmit('ok')}>
                                {transKey(lang, 'console.delete.ok')}
                            </Button>
                            <Button size={'sm'} onClick={() => handleClose()}>
                                {transKey(lang, 'console.common.cancel')}
                            </Button>

                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const deleteStyles = {
    deleteDialog: css`
        min-height: 8rem;
        min-width: 10rem;
    `,
    dialogTitle: css`
        font-size: 1.1rem;
        font-weight: bolder;
        border-bottom: solid 1px #e1e1e280;
        padding: 0.5rem 1rem;
    `,
    resTitle: css`
        padding: 0.5rem 1rem;
    `,
    dialogActions: css`
        border-top: solid 1px #e1e1e280;
        padding: 0.5rem 1rem;
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    `
}
