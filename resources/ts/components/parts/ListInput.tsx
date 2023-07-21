import React, { useState } from "react";
import { Box, TextField, List, ListItem, IconButton } from "@mui/material";

import { AddCircleIcon, DeleteIcon } from "./icon";

export function ListInput(props: {
    values?: string[],
    disabled: boolean;
    onChange: Function;
}) {
    const [values, setValues] = useState<string[]>(props.values || []);

    const changeItem = (value: string, index: number) => {
        let _values = [...values];
        _values[index] = value;
        setValues(_values);
        props.onChange(_values);
    }

    const appnedItem = () => {
        let _values = [...values];
        _values.push('');
        setValues(_values);
        props.onChange(_values);
    }

    const removeItem = (index: number) => {
        let _values: string[] = [...values];
        _values.splice(index, 1);
        setValues(_values);
        props.onChange(_values);
    }

    return (
        <>
            <List>
            {values.map((itemValue, index) => (
                <ListItem key={index} sx={{ py: 0.5, px: 1 }}>
                    <TextField
                        fullWidth
                        multiline
                        value={itemValue}
                        disabled={props.disabled}
                        onChange={(event) => changeItem(event.target.value, index)}
                    />
                    <IconButton onClick={() => removeItem(index)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItem>
            ))}
            </List>
            <Box sx={{ ml: 1 }}>
                <IconButton onClick={appnedItem} sx={{ p: 0 }}>
                    <AddCircleIcon />
                </IconButton>
            </Box>
        </>
    );
}

