import React, { useState, useEffect }  from "react";
import { ThemeProvider, createTheme, Theme } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline'

import { createUserTheme } from "../../../custom/user-theme";
import { Site } from "../../../entities";
import { SiteRoutes } from "./";

export function SiteLayout(props: {
    siteId: number,
    pageId: number,
}) {
    const [site, setSite] = useState<Site | undefined>();
    const [theme, setTheme] = useState<Theme>(createTheme());

    const handleSiteLoaded = (site: Site) => {
        setSite(site);
    }

    useEffect(() => {
        if (site === undefined) {
            return;
        }
        const _theme = createUserTheme({
            colorThemeName: site.colorTheme,
            fontSizeLevel: Number(site.fontSize),
            elementSpaceLevel: site.elementSpace
        });
        setTheme(_theme);
    }, [site]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SiteRoutes {...props} onSiteLoaded={handleSiteLoaded} />
        </ThemeProvider>
    );
};

