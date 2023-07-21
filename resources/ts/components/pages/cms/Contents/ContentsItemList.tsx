import React, { useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { ContentsItemCommon, ContentProps } from "./";
import { ListInput } from '../../../parts';

function displayComponent(props: {
    value: string[];
}) {
    return (
        <List>
        {props.value.map((itemValue, index) => (
            <ListItem key={index} sx={{ px: 1, py: 0 }}>
                <ListItemText
                    primary={itemValue}
                />
            </ListItem>
        ))}
        </List>
    );
};

function editorComponent(props: {
    value: string[];
    isProcessing: boolean;
    onChange: Function;
}) {
    const [values, setValues] = useState<string[]>(props.value);

    const handleChange = (values: string[]) => {
        props.onChange(values);
    }

    return (
        <ListInput
            values={values}
            disabled={props.isProcessing}
            onChange={handleChange}
        />
    );
}

export function ContentsItemList(props: ContentProps) {
    return ContentsItemCommon(displayComponent, editorComponent)(props);
}

