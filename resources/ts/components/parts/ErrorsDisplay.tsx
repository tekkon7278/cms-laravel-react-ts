import React from "react";
import { List, ListItem } from "@mui/material";

export function ErrorsDisplay(props: { errors: string[] }) {
    return (
        <List sx={{
            p: 0
        }}>
            {props.errors.map((error, index) => (
                <ListItem
                    key={index}
                    sx={{
                        pt: 1,
                        pb: 0,
                        color: "error.main",
                    }}
                >
                    {error}
                </ListItem>
            ))}
        </List>
    );
};
