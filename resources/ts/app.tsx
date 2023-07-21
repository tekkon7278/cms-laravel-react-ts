import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import { CmsLayout } from "./components/pages/cms/Layout/CmsLayout";
import { SiteLayout } from "./components/pages/site/SiteLayout";

const theme = createTheme();
const rootElement = document.getElementById("app");
if (rootElement === null) {
    throw "failed to get root element";
}
const root = ReactDOM.createRoot(rootElement);
if (location.pathname.substring(0, 4) === '/cms') {
    root.render(    
        <BrowserRouter basename="/cms">
            <CmsLayout />
        </BrowserRouter>
    );
} else {
    const siteId = Number(rootElement.dataset.siteId);
    const pageId = Number(rootElement.dataset.pageId);
    root.render(
        <BrowserRouter basename="/">
            <SiteLayout siteId={siteId} pageId={pageId} />
        </BrowserRouter>
    );
}
