import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, ListItem, ListItemIcon, ListItemText, Divider, TextField, FormControlLabel, Switch } from "@mui/material";

import { HomeIcon, DescriptionIcon, EditIcon, VisibilityIcon, DriveFileRenameOutlineIcon } from "../../../parts/icon";
import { useConfirmModal } from "../../../../contexts/modal-context";
import { useRepository } from "../../../../contexts/repository-context";
import { Page } from "../../../../entities";
import { EditSwitcher, Display, Editor, ErrorsDisplay, EditorButtonSet, SmallTextButton } from "../../../parts";

export function MenuItem(props: {
    page: Page,
    onDelete: Function,
}) {

    const [editMode, setEditMode] = useState<boolean>(false);
    const toEdit = () => setEditMode(true);
    const toDisplay = () => setEditMode(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [page] = useState<Page>(props.page);
    const [pageTitle, setPageTitle] = useState<string | undefined>(props.page.title);
    const [pagePathname, setPagePathname] = useState<string | undefined>(props.page.pathname);
    const [pageIsPublished, setPageIsPublished] = useState<boolean | undefined>(props.page.isPublished);
    const { showConfirm } = useConfirmModal();
    const { updatePage, deletePage } = useRepository();
    const navigate = useNavigate();

    const cancelEdit = () => {
        toDisplay();
        setErrors([]);
    };

    const jumpToContentsEdit = () => {
        navigate(`/sites/${page.siteId}/pages/${page.id}`);
    };

    const openPreview = (siteId: number, pageId: number) => {
        window.open(`/preview/sites/${siteId}/pages/${pageId}`, 'preview')
    };

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageTitle(event.target.value);
    }
    
    const handleChangePathname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPagePathname(event.target.value);
    }

    const handleChangePublished = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageIsPublished(event.target.checked);
    }

    const handleUpdate = async () => {
        setErrors([]);
        setIsProcessing(true);
        try {
            const response = await updatePage({
                title: pageTitle,
                pathname: pagePathname,
                is_published: pageIsPublished,
            }, page.id);
        } finally {
            setIsProcessing(false);
        }

        toDisplay();
    };

    const handleDestroy = async () => {
        const isOk = await showConfirm('削除しますか？');
        if (!isOk) {
            return;
        }
        setErrors([]);
        setIsProcessing(true);
        try {
            const response = await deletePage(page.id);
            if (!response.result) {
                if (response.messages !== undefined) {
                    setErrors(response.messages);
                }
                return;
            }
            props.onDelete(page.id);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <EditSwitcher edit={editMode}>

                {/* 表示モードブロック */}
                <Display>
                    <ListItem
                        secondaryAction={
                            <Box>
                            {!page.isIndex && (
                                <SmallTextButton
                                    text="編集"
                                    iconComponent={<EditIcon />}
                                    onClick={toEdit}
                                />
                            )}
                                <SmallTextButton
                                    text="コンテンツ編集"
                                    iconComponent={<DriveFileRenameOutlineIcon />}
                                    onClick={jumpToContentsEdit}
                                />
                                <SmallTextButton
                                    text="プレビュー"
                                    iconComponent={<VisibilityIcon />}
                                    onClick={() => openPreview(page.siteId!, page.id)}
                                />
                            </Box>
                        }
                    >
                        <ListItemIcon>
                            {page.isIndex ? <HomeIcon /> : <DescriptionIcon />}
                        </ListItemIcon>
                        <ListItemText
                            primary={pageTitle}
                            secondary={`${pagePathname}/`}
                        />
                    </ListItem>
                </Display>

                {/* 編集モードブロック */}
                <Editor>
                    <ListItem>
                        <ListItemIcon>
                            {page.isIndex ? <HomeIcon /> : <DescriptionIcon />}
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
                            <Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            value={pageIsPublished}
                                            onChange={handleChangePublished}
                                        />
                                    }
                                    label={pageIsPublished ? "公開" : "非公開"}
                                />
                            </Box>
                            <ErrorsDisplay errors={errors} />
                            <EditorButtonSet
                                useDestroy={true}
                                onClickOk={handleUpdate}
                                onClickCancel={cancelEdit}
                                onClickDestroy={handleDestroy}
                                isProcessing={isProcessing}
                            />
                        </ListItemText>
                    </ListItem>
                </Editor>

            </EditSwitcher>
            <Divider variant="inset" />
        </>
    );
};
