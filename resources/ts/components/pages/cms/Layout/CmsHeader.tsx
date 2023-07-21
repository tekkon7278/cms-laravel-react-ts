import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Box, Toolbar, Button, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { SettingsIcon, EditNoteIcon, PaletteIcon, ListIcon, VisibilityIcon } from "../../../parts/icon";
import { Site, Page } from "../../../../entities";
import { colors } from "../../../../custom/themes";
import { useRepository } from "../../../../contexts/repository-context";

export function CmsHeader() {

    const [previewUrl, setPreviewUrl] = useState<string>('');
    const { site, page } = useRepository();

    useEffect(() => {
        // プレビュー表示のURLを設定
        if (site instanceof Site && page instanceof Page) {
            setPreviewUrl(`/preview/sites/${site.id}/pages/${page.id}`);
        }
    }, [site, page]);

    const theme = createTheme({
        palette: colors.blue_2,
    });

    /**
     * 現在編集中のページのプレビューを別ウインドウに表示
     */
    const openPreview = () => {
        window.open(previewUrl, 'preview')
    };

    return (
        <ThemeProvider theme={theme}>
            <Box>
                <AppBar
                    position="static"
                    sx={{
                        bgcolor: "cms_primary.main"
                    }}
                >
                    <Toolbar style={{ minHeight: "40px" }}>
                        <Typography
                            variant="subtitle1"
                            component="a"
                            sx={{ flexGrow: 1 }}
                        >
                            {site === undefined ? "サイトリスト" : site.name}
                        </Typography>
                        <Box>
                        {previewUrl !== '' && (
                            <Button
                                sx={{ color: "white", mr: 3 }}
                                startIcon={<VisibilityIcon />}
                                onClick={openPreview}
                            >
                                プレビュー
                            </Button>
                        )}
                        {site !== undefined && (
                            <>
                                <NavLink to={"/sites/" + site.id + "/base"}>
                                    <Button
                                        sx={{ color: "white", mr: 3 }}
                                        startIcon={<SettingsIcon />}
                                    >
                                        サイト設定
                                    </Button>
                                </NavLink>
                                <NavLink to={"/sites/" + site.id + "/menu"}>
                                    <Button
                                        sx={{ color: "white", mr: 3 }}
                                        startIcon={<EditNoteIcon />}
                                    >
                                        ページ管理
                                    </Button>
                                </NavLink>
                                <NavLink to={"/sites/" + site.id + "/design"}>
                                    <Button
                                        sx={{ color: "white", mr: 3 }}
                                        startIcon={<PaletteIcon />}
                                    >
                                        デザイン設定
                                    </Button>
                                </NavLink>
                            </>
                        )}
                            <NavLink to={"/sites"}>
                                <Button
                                    sx={{ color: "white", mr: 3 }}
                                    startIcon={<ListIcon />}
                                >
                                    サイトリストへ戻る
                                </Button>
                            </NavLink>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        </ThemeProvider>
    );
};
