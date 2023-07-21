import React, { useState, useEffect }  from "react";
import { ThemeProvider, Theme } from "@mui/material/styles";
import { CssBaseline, Container, Box } from "@mui/material";

import { createUserTheme } from "../../../../custom/user-theme";
import { ConfirmModalProvider } from "../../../../contexts/modal-context";
import { RepositoryProvider, useRepository } from "../../../../contexts/repository-context";
import { CmsRoutes } from "../CmsRoutes";
import { CmsHeader } from "./CmsHeader";
import { SiteHeader } from "../../site";

export function CmsLayout() {

    const [colorThemeName, setColorThemeName] = useState<string>('blue_2');
    const [fontSizeLevel, setFontSizeLevel] = useState<number>(2);
    const [elementSpaceLevel, setElementSpaceLevel] = useState<number>(2);
    const [theme, setTheme] = useState<Theme>(createUserTheme({
        colorThemeName: 'blue_2',
        fontSizeLevel: 2,
        elementSpaceLevel: 2,
    }));
    const { site } = useRepository();

    // サイト表示・切替時にサイトの設定として登録されたスタイルをstateに保持
    useEffect(() => {
        if (site === undefined) {
            return;
        }
        setColorThemeName(site.colorTheme);
        setFontSizeLevel(Number(site.fontSize));
        setElementSpaceLevel(Number(site.elementSpace));
    }, [site]);
    
    // スタイル関係のstate変化時にテーマとして適用
    useEffect(() => {
        setTheme(createUserTheme({
            colorThemeName: colorThemeName,
            fontSizeLevel: fontSizeLevel,
            elementSpaceLevel: elementSpaceLevel,
            // extraOptions: {
            //     components: {
            //         MuiTableCell: {
            //             styleOverrides: {
            //                 root: {
            //                     fontSize: '1rem',
            //                 },
            //             },
            //         },
            //     }
            // }
        }));
    }, [colorThemeName, fontSizeLevel, elementSpaceLevel]);

    return (
        <ConfirmModalProvider>
            <RepositoryProvider>
                <CssBaseline />
                <CmsHeader />
                <ThemeProvider theme={theme}>
                    <Box sx={{ fontSize: 16 }}>
                        <SiteHeader />
                        <Container sx={{ my: 5 }}>
                            <CmsRoutes />
                        </Container>
                    </Box>
                </ThemeProvider>
            </RepositoryProvider>
        </ConfirmModalProvider>
    );
};

