import React from 'react';
import { Tooltip, IconButton } from '@mui/material';

export function TooltipIconButton(props: {
    iconComponent: JSX.Element;
    popupText?: string;
    onClick?: Function;
    disabled?: boolean;
    sx?: Object;
}) {

    const sx = {
        ...props.sx,
        color: 'cms_icon.main'
    };

    const handleClick = () => {
        if (props.onClick === undefined) {
            return;
        }
        props.onClick();
    }

    return (
        <Tooltip title={props.popupText}>
            <IconButton
                sx={sx}
                onClick={handleClick}
                disabled={props.disabled}
            >
                {props.iconComponent}
            </IconButton>
        </Tooltip>
    );
}
