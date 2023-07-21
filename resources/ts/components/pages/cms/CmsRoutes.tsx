import React from "react";
import { Routes, Route } from "react-router-dom";

import { NotFound } from "../NotFound";
import { SiteList } from "./SiteList";
import { Basic } from "./Basic";
import { Menu } from "./Menu";
import { Design } from "./Design";
import { Contents } from "./Contents";

export type RouterParams = {
    siteId: string;
    pageId: string;
};

export function CmsRoutes() {

    return (
        <Routes>
            <Route
                path="/sites"
                element={<SiteList />}
            />
            <Route
                path="/sites/:siteId/base"
                element={<Basic />}
            />
            <Route
                path="/sites/:siteId/menu"
                element={<Menu />}
            />
            <Route
                path="/sites/:siteId/design"
                element={<Design />}
            />
            <Route
                path="/sites/:siteId/pages/:pageId"
                element={<Contents />}
            />
            <Route
                path="*"
                element={<NotFound />}
            />
        </Routes>
    );
};

