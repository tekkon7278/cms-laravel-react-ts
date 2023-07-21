import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

import { DoneIcon, EditOffIcon, DeleteIcon } from "./icon";
import { TooltipIconButton } from './'

export function EditorButtonSet(props: {
    useOk?: boolean;
    useCancel?: boolean;
    useDestroy?: boolean;
    onClickOk?: Function;
    onClickCancel?: Function;
    onClickDestroy?: Function;
    isProcessing?: boolean;
}) {
    const [useOk] = useState<boolean>(props.useOk || true);
    const [useCancel] = useState<boolean>(props.useCancel || true);
    const [useDestroy] = useState<boolean>(props.useDestroy || true);
    const [isProcessing, setIsProcessing] = useState<boolean>(props.isProcessing || false);

    useEffect(() => {
        setIsProcessing(props.isProcessing || false);
    }, [props.isProcessing]);

    const handleClickOk = (event: React.MouseEvent) => {
        if (props.onClickOk === undefined) {
            return;
        }
        props.onClickOk(event);
    }

    const handleClickCancel = (event: React.MouseEvent) => {
        if (props.onClickCancel === undefined) {
            return;
        }
        props.onClickCancel(event);
    }

    const handleClickDestroy = (event: React.MouseEvent) => {
        if (props.onClickDestroy === undefined) {
            return;
        }
        props.onClickDestroy(event);
    }

    return (
        <Box sx={{ mt: 1 }}>
            {useOk && (
                <TooltipIconButton
                    iconComponent={<DoneIcon />}
                    popupText="OK"
                    onClick={handleClickOk}
                    disabled={props.isProcessing}
                />
            )}
            {useCancel && (
                <TooltipIconButton
                    iconComponent={<EditOffIcon />}
                    popupText="編集キャンセル"
                    onClick={handleClickCancel}
                    disabled={props.isProcessing}
                />
            )}
            {useDestroy && (
                <TooltipIconButton
                    iconComponent={<DeleteIcon />}
                    popupText="削除"
                    onClick={handleClickDestroy}
                    disabled={props.isProcessing}
                />
            )}
            {isProcessing && <CircularProgress size="2rem" />}
        </Box>
    );
};
