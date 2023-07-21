import React, { useState } from "react";
import { Box, TextField } from "@mui/material";

import { EditIcon } from "../../../parts/icon";
import { CmsIconButton } from "../../../styled"
import { SiteProps } from "../../../../entities";
import { EditSwitcher, Display, Editor, EditorButtonSet, ErrorsDisplay } from "../../../parts";

export function BasicItemText(props: {
    siteId: number;
    propName: keyof SiteProps;
    defaultValue: string;
    onUpdate: Function;
}) {

    const [editMode, setEditMode] = useState<boolean>(false);
    const toEdit = () => setEditMode(true);
    const toDisplay = () => setEditMode(false);

    const [originalValue, setOriginalValue] = useState<string>(props.defaultValue);
    const [value, setValue] = useState<string>(props.defaultValue);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const cancelEdit = () => {
        toDisplay();
        setValue(originalValue);
        setErrors([]);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    }

    const handleClickOk = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setErrors([]);
        setIsProcessing(true);
        try {            
            const response = await props.onUpdate(props.siteId, props.propName, value);
            if (!response.result) {
                if (response.messages !== undefined) {
                    setErrors(response.messages);
                }
                return;
            }
        } finally {
            setIsProcessing(false);
        }

        toDisplay();
        setOriginalValue(value);
    };

    return (
        <EditSwitcher edit={editMode}>

            {/* 表示モードブロック */}
            <Display>
                <Box>
                    <span>{value}</span>
                    <CmsIconButton onClick={toEdit}>
                        <EditIcon />
                    </CmsIconButton>
                </Box>
            </Display>

            {/* 編集モードブロック */}
            <Editor>
                <Box
                    sx={{
                        width: "80%",
                    }}
                >
                    <TextField
                        fullWidth
                        value={value}
                        disabled={isProcessing}
                        onChange={handleChange}
                    />
                    <ErrorsDisplay errors={errors} />
                    <EditorButtonSet
                        useDestroy={false}
                        onClickOk={handleClickOk}
                        onClickCancel={cancelEdit}
                        isProcessing={isProcessing}
                    />
                </Box>
            </Editor>

        </EditSwitcher>
    );
};

