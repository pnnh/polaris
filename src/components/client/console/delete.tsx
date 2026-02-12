'use client';

import * as React from 'react';
import {styled} from '@mui/material/styles';
import Button, {ButtonProps} from '@mui/material/Button';
import {red} from '@mui/material/colors';
import {Dialog} from '@mui/material';
import {CodeOk, PLDeleteResult} from "@pnnh/atom";
import {clientMakePost} from "@pnnh/atom/browser";
import {transKey} from "@/components/common/locales/normal";

const ColorButton = styled(Button)<ButtonProps>(({theme}) => ({
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
        backgroundColor: red[700],
    },
}));

export default function PSDeleteButton({children, deleteUrl, lang, resTitle}: {
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
            <style jsx={true}>{`
                .deleteDialog {
                    min-height: 8rem;
                    min-width: 10rem;

                    .dialogTitle {
                        font-size: 1.1rem;
                        font-weight: bolder;
                        border-bottom: solid 1px #e1e1e280;
                        padding: 0.5rem 1rem;
                    }

                    .resTitle {
                        padding: 0.5rem 1rem;
                    }

                    .dialogActions {
                        border-top: solid 1px #e1e1e280;
                        padding: 0.5rem 1rem;
                        display: flex;
                        flex-direction: row;
                        gap: 0.5rem;
                    }
                }
            `}</style>
            <ColorButton variant="text" size={'small'} onClick={handleClickOpen}>{children}</ColorButton>
            <Dialog onClose={handleClose} open={open}>
                <div className={'deleteDialog'}>

                    <div className={'dialogTitle'}>
                        {transKey(lang, 'console.delete.confirm')}
                    </div>
                    <div className={'resTitle'}>
                        {resTitle}
                    </div>
                    <div className={'dialogActions'}>
                        <Button variant={'contained'} size={'small'} onClick={() => handleSubmit('ok')}>
                            {transKey(lang, 'console.delete.ok')}
                        </Button>
                        <Button variant={'contained'} size={'small'} onClick={() => handleClose()}>
                            {transKey(lang, 'console.common.cancel')}
                        </Button>

                    </div>
                </div>
            </Dialog>
        </div>
    );
}
