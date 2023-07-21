import React, { useState, useRef } from "react";
import { Box, IconButton } from "@mui/material";

import { AttachFileIcon } from "./icon";

export function FileInput(props: {
    onSelectFile: Function;
}) {
    const [fileInfo, setFileInfo] = useState<File | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);

    const handleClickSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (fileInput.current === null) {
            return;
        }
        fileInput.current.click();
    };

    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target === undefined || event.target.files === null) {
            return;
        }

        const file: File = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise((resolve) => {
            reader.onload = () => resolve(true);
        });

        setFileInfo(file);
        props.onSelectFile(reader.result, file);
    };

    return (
        <Box>
            <input
                ref={fileInput}
                type="file"
                style={{ display: "none" }}
                onChange={onChange}
            />
            <IconButton onClick={handleClickSelect}>
                <AttachFileIcon />
            </IconButton>
            <span>{fileInfo !== null ? fileInfo.name : ""}</span>
        </Box>
    );
};

