import React, { createContext, useContext, useState } from 'react';
import { ConfirmDialog } from '../components/parts';

type ConfirmModalContextType = {
    showConfirm: Function;
    closeConfirm: Function;
    isShowConfirm: boolean;
}

type DialogState = {
    isShow: Boolean;
    isOk: boolean;
}

export const ConfirmModalContext = createContext({} as ConfirmModalContextType);

export const ConfirmModalProvider = ({ children }: { children: JSX.Element }) => {
    const [isShowConfirm, setIsShowConfirm] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [dialogState] = useState<DialogState>({ isShow: false, isOk: false });

    const sleep = () => {
        return new Promise((resolve) => setTimeout(resolve, 100));
    }

    const showConfirm = async (message: string) => {
        return new Promise(async (resolve) => {
            setMessage(message);
            setIsShowConfirm(true);
            dialogState.isShow = true;
            while (dialogState.isShow) {
                await sleep();
            }
            resolve(dialogState.isOk);
        });
    }

    const closeConfirm = () => {
        dialogState.isOk = false;
        dialogState.isShow = false;
        setIsShowConfirm(false);
    }

    const handleClickOk = () => {
        dialogState.isOk = true;
        dialogState.isShow = false;
        setIsShowConfirm(false);
    }

    const handleClickCancel = () => {
        closeConfirm();
    }

    return (
        <>
            <ConfirmModalContext.Provider value={{ isShowConfirm, showConfirm, closeConfirm }}>
                {children}
            </ConfirmModalContext.Provider>
            <ConfirmDialog
                open={isShowConfirm}
                message={message}
                onClickOk={handleClickOk}
                onClickCancel={handleClickCancel}
            />
        </>
    );
}

export const useConfirmModal = () => {
    return useContext(ConfirmModalContext);
}
