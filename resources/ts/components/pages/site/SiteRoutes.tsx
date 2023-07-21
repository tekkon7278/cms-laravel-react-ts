import React from "react";
import { Routes, Route, } from "react-router-dom";
import { SitePage } from "./SitePage";

export function SiteRoutes(props: {
    siteId: number,
    pageId: number,
    onSiteLoaded: Function,
}) {
    
    return (
        <Routes>
            <Route
                path="/preview/*"
                element={
                    <SitePage
                        {...props}
                        preview
                    />
                }
            />
            <Route
                path="*"
                element={
                    <SitePage
                        {...props}
                    />
                }
            />
        </Routes>
    );
};

