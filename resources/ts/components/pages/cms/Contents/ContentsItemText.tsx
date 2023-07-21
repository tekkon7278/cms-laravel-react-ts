import React from "react";
import { TextField, Typography } from "@mui/material";
import { ContentsItemCommon, ContentProps } from "./";

function displayComponent(props: {
    value: string;
}) {
    return (
        <Typography>{props.value}</Typography>
    );
};

function editorComponent(props: {
    value: string;
    isProcessing: boolean;
    onChange: Function;
}) {
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange((event.target as HTMLInputElement).value);
    }

    return (
        <TextField
            fullWidth
            multiline
            minRows="3"
            value={props.value}
            disabled={props.isProcessing}
            onChange={handleChange}
        />
    );
}

export function ContentsItemText(props: ContentProps) {
    return ContentsItemCommon(displayComponent, editorComponent)(props);
}

