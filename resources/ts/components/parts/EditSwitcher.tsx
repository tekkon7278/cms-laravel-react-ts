import React, { useEffect, useState, ReactElement } from "react";
import { Box } from "@mui/material";

export function EditSwitcher(props: {
    edit: boolean;
    children: [ReactElement, ReactElement];
    sx?: Object;
}) {
    const [editMode, setEditMode] = useState<boolean>(props.edit);
    const { children } = props;

    useEffect(() => {
        setEditMode(props.edit);
    }, [props.edit]);

    let isChildrenValid = false;
    if (props.children.length === 2 && typeof children[0] === 'object' && typeof children[1] === 'object') {
        if (children[0].type === Display && children[1].type === Editor) {
            isChildrenValid = true;
        } else if (children[0].type === Editor && children[1].type === Display) {
            isChildrenValid = true;
        }
    }
    if (!isChildrenValid) {
        throw Error('children of EditerSwitcher must be Display and Editor');
    }

    return (
        <Box sx={props.sx}>
            <Box sx={{ display: editMode ? 'none' : 'block' }}>
                {children[0]}
            </Box>
            <Box sx={{ display: !editMode ? 'none' : 'block' }}>
                {children[1]}             
            </Box>
        </Box>
    );
};

export function Display(props: any) {
    return (
        <Box {...props} />
    )
}

export function Editor(props: any) {
    return (
        <Box {...props} />
    )
}