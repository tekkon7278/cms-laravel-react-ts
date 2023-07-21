import React, { useState, useRef } from "react";
import { Box, TextField } from "@mui/material";

import { AddCircleIcon } from "../../../parts/icon";
import { useRepository } from "../../../../contexts/repository-context";
import { Explain, CmsIconButton } from "../../../styled"
import { EditSwitcher, Display, Editor, ErrorsDisplay, EditorButtonSet } from "../../../parts";

export function SiteCreater(
    props: { onCreated: Function }
) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const toEdit = () => setEditMode(true);
    const toDisplay = () => setEditMode(false);
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [siteName, setSiteName] = useState<string>("");

    const { createSite } = useRepository();
    const createFormBottom = useRef<HTMLElement>();

    const showCreateForm = () => {
        toEdit();
        createFormBottom.current?.scrollIntoView({ block: 'start' });
    } 

    const cancelEdit = () => {
        toDisplay();
        setSiteName("");
        setErrors([]);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSiteName((event.target as HTMLInputElement).value);
    }

    const handleClickOk = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsProcessing(true);
        try {
            const response = await createSite({
                name: siteName,
            });
            if (!response.result) {
                if (response.messages !== undefined) {
                    setErrors(response.messages);
                }
                return;
            }
            props.onCreated(event, response.entity);

        } finally {
            setIsProcessing(false);
        }
        cancelEdit();
    };

    return (
        <>
            <EditSwitcher edit={editMode}>

                <Display>
                    <CmsIconButton onClick={showCreateForm}>
                        <AddCircleIcon />
                    </CmsIconButton>
                    <Explain>新しいサイトを作成します</Explain>
                </Display>

                <Editor sx={{ width: "80%" }}>
                    <TextField
                        fullWidth
                        label="サイト名"
                        value={siteName}
                        onChange={handleChange}
                    />
                    <ErrorsDisplay errors={errors} />
                    <EditorButtonSet
                        useDestroy={false}
                        onClickOk={handleClickOk}
                        onClickCancel={cancelEdit}
                        isProcessing={isProcessing}
                    />
                </Editor>

            </EditSwitcher>
            <Box ref={createFormBottom}></Box>
        </>
    );
};

