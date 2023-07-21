import React from 'react';
import { Button } from '@mui/material';

export function SmallTextButton(props: {
    text: string,
    iconComponent: JSX.Element,
    onClick: Function,
}) {
    return (
        <Button
            size="small"
            variant="contained"
            sx={{
                mr: 1,
                py: 0.3,
                px: 1.5,
                fontSize: '0.8rem'
            }}
            onClick={(event) => props.onClick(event)}
            startIcon={props.iconComponent}
        >
            {props.text}
        </Button>
    );
}
