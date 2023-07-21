import React, { useState } from "react";
import { Box, ListItem, ListItemIcon, ListItemText, Divider, TextField } from "@mui/material";

import { LoupeIcon, DescriptionIcon } from "../../../parts/icon";
import { useRepository } from "../../../../contexts/repository-context";
import { EditSwitcher, Display, Editor, ErrorsDisplay, EditorButtonSet, TooltipIconButton } from "../../../parts";

export function MenuCreater(props: {
    siteId: number;
    beforePageId: number,
    onCreate: Function,
}) {

    const [editMode, setEditMode] = useState<boolean>(false);
    const toEdit = () => setEditMode(true);
    const toDisplay = () => setEditMode(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [pageTitle, setPageTitle] = useState<string>('');
    const [pagePathname, setPagePathname] = useState<string>('');
    const { createPage } = useRepository();

    const cancelEdit = () => {
        toDisplay();
        setErrors([]);
    };

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageTitle(event.target.value);
    }

    const handleChangePathname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPagePathname(event.target.value);
    }

    const handleUpdate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setErrors([]);
        setIsProcessing(true);
        try {
            const response = await createPage({
                title: pageTitle,
                pathname: pagePathname,
                before_page_id: props.beforePageId,
            });
            if (!response.result) {
                if (response.messages !== undefined) {
                    setErrors(response.messages);
                }
                return;
            }
            toDisplay();
            props.onCreate(response.entity, props.beforePageId);
        } finally {
            setIsProcessing(false);
        }

    };

    return (
        <>
            <EditSwitcher edit={editMode}>

                <Display sx={{ position: 'relative' }}>
                    <TooltipIconButton
                        iconComponent={<LoupeIcon />}
                        popupText="メニュー追加"
                        onClick={toEdit}
                        sx={{ 
                            position: 'absolute',
                            top: -28,
                            left: -30,
                        }}
                    />
                </Display>

                <Editor>
                    <ListItem>
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText
                            sx={{
                                p: 2,
                                borderWidth: 1,
                                borderColor: 'cms_icon.main',
                                borderStyle: 'solid'
                            }}
                        >
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="ページタイトル"
                                    value={pageTitle}
                                    disabled={isProcessing}
                                    onChange={handleChangeTitle}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="URLパスキー"
                                    value={pagePathname}
                                    disabled={isProcessing}
                                    onChange={handleChangePathname}
                                />
                            </Box>
                            <ErrorsDisplay errors={errors} />
                            <EditorButtonSet
                                useDestroy={false}
                                onClickOk={handleUpdate}
                                onClickCancel={cancelEdit}
                                isProcessing={isProcessing}
                            />
                        </ListItemText>
                    </ListItem>
                </Editor>

            </EditSwitcher>
            <Divider variant="inset" />
        </>
    );
}

