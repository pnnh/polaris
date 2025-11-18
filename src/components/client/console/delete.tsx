'use client';

import * as React from 'react';
import {styled} from '@mui/material/styles';
import Button, {ButtonProps} from '@mui/material/Button';
import {red} from '@mui/material/colors';
import {Dialog} from '@mui/material';
import {CodeOk, PLDeleteResult} from "@/atom/common/models/protocol";
import {clientMakePost} from "@/atom/client/http";
import styles from './delete.module.scss';
import {transText} from "@/components/common/locales/normal";

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
            alert(transText(lang, '删除失败', 'Delete failed'));

        })
    };
    return (
        <div>
            <ColorButton variant="text" size={'small'} onClick={handleClickOpen}>{children}</ColorButton>
            <Dialog onClose={handleClose} open={open}>
                <div className={styles.deleteDialog}>

                    <div className={styles.dialogTitle}>
                        {transText(lang, '是否要删除?', 'Do you want to delete?')}
                    </div>
                    <div className={styles.resTitle}>
                        {resTitle}
                    </div>
                    <div className={styles.dialogActions}>
                        <Button variant={'contained'} size={'small'} onClick={() => handleSubmit('ok')}>
                            {transText(lang, '确定', 'OK')}
                        </Button>
                        <Button variant={'contained'} size={'small'} onClick={() => handleClose()}>
                            {transText(lang, '取消', 'Cancel')}
                        </Button>

                    </div>
                </div>
            </Dialog>
        </div>
    );
}
