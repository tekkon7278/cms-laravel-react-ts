import React, { useState, } from "react";

import { Box } from "@mui/material";
import { TextField, ToggleButtonGroup, ToggleButton } from "@mui/material";

import { LoupeIcon } from "../../../parts/icon";
import { ContentBox, ContentInnerBox, Explain  } from "../../../styled"
import { EditSwitcher, Display, Editor, FileInput, ListInput, EditorButtonSet, ErrorsDisplay, TooltipIconButton } from '../../../parts';
import { useRepository } from "../../../../contexts/repository-context";

export function ContentsCreater(props: {
    siteId: number;
    pageId: number;
    beforeContentId: number;
    onCreated: Function;
    parentContentId?: number;
}) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const toEdit = () => setEditMode(true);
    const toDisplay = () => setEditMode(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [contentType, setContentType] = useState<string>('text');
    const [value, setValue] = useState<string | string[]>('');
    const [errors, setErrors] = useState<string[]>([]);
    const { createContent } = useRepository();

    const handleSelectContentType = (
        event: React.MouseEvent<HTMLElement>,
        selectedType: string
    ) => {
        setContentType(selectedType);
        setValue('');
    }
    
    const handleClickOk = async () => {
        setErrors([]);
        setIsProcessing(true);
        try {
            const response = await createContent({
                type: contentType,
                value: value,
                before_content_id: props.beforeContentId,
                parent_content_id: (props.parentContentId !== undefined) ? props.parentContentId : null,
            });
            if (!response.result) {
                if (response.messages !== undefined) {
                    setErrors(response.messages);
                }
                return;
            }
            toDisplay();
            props.onCreated(response.entity, props.beforeContentId);
        } finally {
            setIsProcessing(false);
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    }

    const cancelEdit = () => {
        toDisplay();
        setValue('');
        setErrors([]);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                borderBottomStyle: 'solid',
                borderBottomWidth: 1,
                borderColor: 'transparent',
                "&:hover": {
                    borderColor: 'cms_icon.main',
                },
            }}
        >
            <EditSwitcher edit={editMode}>

                <Display>
                    <TooltipIconButton
                        iconComponent={<LoupeIcon />}
                        popupText="コンテンツ追加"
                        onClick={toEdit}
                        sx={{ 
                            position: 'absolute',
                            top: -28,
                            left: -30,
                        }}
                    />
                </Display>

                <Editor>
                    <ContentBox>
                        <ContentInnerBox>
                            <LoupeIcon 
                                sx={{ 
                                    position: 'absolute',
                                    top: -21,
                                    left: -12,
                                    color: 'cms_icon.lite',
                                }}
                            />
                            <ToggleButtonGroup
                                value={contentType}
                                exclusive
                                onChange={handleSelectContentType}
                            >
                                <ToggleButton value="text">テキスト</ToggleButton>
                                <ToggleButton value="title">タイトル</ToggleButton>
                                <ToggleButton value="code">コード</ToggleButton>
                                <ToggleButton value="list">リスト</ToggleButton>
                                <ToggleButton value="image">画像</ToggleButton>
                                {props.parentContentId === undefined &&
                                    <ToggleButton value="columns">段組み</ToggleButton>
                                }
                            </ToggleButtonGroup>

                            {(contentType === "text" || contentType === "code") && (
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows="3"
                                    disabled={isProcessing}
                                    onChange={handleChange}
                                />
                            )}
                            {(contentType === "title") && (                    
                                <TextField
                                    fullWidth
                                    disabled={isProcessing}
                                    onChange={handleChange}
                                />
                            )}
                            {(contentType === "image") && (
                                <FileInput
                                    onSelectFile={(fileData: string, fileInfo: File) => setValue(fileData)}
                                />
                            )}
                            {(contentType === "list") && (
                                <ListInput
                                    values={['']}
                                    disabled={isProcessing}
                                    onChange={setValue}
                                />
                            )}
                            {(contentType === "columns") && (
                                <Box sx={{ m: 3 }}>
                                    <Explain>↓OKアイコンから登録後、段組み内部のコンテンツを追加してください。</Explain>
                                </Box>
                            )}
                            <ErrorsDisplay errors={errors} />
                            <EditorButtonSet
                                useDestroy={false}
                                onClickOk={handleClickOk}
                                onClickCancel={cancelEdit}
                                isProcessing={isProcessing}
                            />
                        </ContentInnerBox>
                    </ContentBox>
                </Editor>

            </EditSwitcher>
        </Box>
    );
};

