import React, { useState, useEffect }  from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';

export function ConfirmDialog(props: {
    open: boolean;
    message: string;
    onClickOk: Function;
    onClickCancel: Function;
}) {
    const [open, setOpen] = useState(props.open);

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    const handleClickOk = () => {
        props.onClickOk();
    }

    const handleClickCancel = () => {
        props.onClickCancel();
    }

    return (
        <Dialog
            open={open}
            onClose={close}
       >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickCancel}>キャンセル</Button>
                <Button onClick={handleClickOk} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    );
}
