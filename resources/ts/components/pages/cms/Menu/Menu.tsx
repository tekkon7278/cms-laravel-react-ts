import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Box, LinearProgress } from "@mui/material";

import { RouterParams } from "../../cms/CmsRoutes";
import { useEffectAsync } from "../../../../custom/hooks";
import { useRepository } from "../../../../contexts/repository-context";
import { Page } from "../../../../entities";
import { MenuItem, MenuCreater } from './';

export function Menu() {

    const { siteId: siteIdParam } = useParams<RouterParams>();
    const [siteId] = useState<number>(Number(siteIdParam));
    const [pageList, setPageList] = useState<Page[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { setSiteId, fetchSite, setPageIdNone, fetchAllPages } = useRepository();
    
    useEffect(() => {
        setSiteId(siteId);
        fetchSite();
        setPageIdNone();
    }, []);

    useEffectAsync(async () => {
        const pages = await fetchAllPages();
        setPageList(pages);
        setIsLoading(false);
    }, []);

    const handleMenuCreated = (createdPage: Page, beforePageId: number) => {
        const beforeIndex = pageList.findIndex((page) => page.id == beforePageId);
        let _pageList = [...pageList];
        _pageList.splice(beforeIndex + 1, 0, createdPage);
        setPageList(_pageList);
    };

    const handleMenuDeleted = (pageId: number) => {
        const destroyIndex = pageList.findIndex((page) => page.id == pageId);
        let _pageList = [...pageList];
        _pageList.splice(destroyIndex, 1);
        setPageList(_pageList);
    };

    return (
        <Box>
            {isLoading && <LinearProgress />}
            {pageList?.map((page: Page) => (
                <Fragment key={page.id}>
                    <MenuItem
                        page={page}
                        onDelete={handleMenuDeleted}
                    />
                    <MenuCreater
                        siteId={siteId}
                        beforePageId={page.id}
                        onCreate={handleMenuCreated}
                    />
                </Fragment>
            ))}
        </Box>
    );
};

