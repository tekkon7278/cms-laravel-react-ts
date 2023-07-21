import React, { useState, useEffect, Fragment, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { Box, LinearProgress, FormControlLabel, Switch } from "@mui/material";

import { RouterParams } from "../../cms/CmsRoutes";
import { useEffectAsync } from "../../../../custom/hooks";
import { useRepository } from "../../../../contexts/repository-context";
import { Content } from "../../../../entities";
import { ContentsCreater, ContentsItem } from "./";

export function Contents() {

    const { siteId: paramSiteId } = useParams<RouterParams>();
    const { pageId: paramPageId } = useParams<RouterParams>();
    const [siteId] = useState<number>(Number(paramSiteId));
    const [pageId] = useState<number>(Number(paramPageId));
    const [isShowTitle, setIsShowTitle] = useState<boolean>(true);
    const [contentList, setContentList] = useState<Content[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isTitleProcessing, setIsTitleProcessing] = useState<boolean>(false);
    const { setSiteId, setPageId, fetchSite, page, fetchPage, updatePage, fetchAllContents } = useRepository();

    useEffect(() => {
        setSiteId(siteId);
        setPageId(pageId);
        fetchSite();
        fetchPage();
    }, []);
    
    useEffectAsync(async () => {
        const _contents = await fetchAllContents();
        setContentList(_contents);
    }, [siteId, pageId]);

    useEffect(() => {
        setIsShowTitle((page === undefined) ? true : page.isShowTitle);
        setIsLoading(page === undefined);
    }, [page]);

    const onContentCreated = async (createdContent: Content, beforeContentId: number) => {
        const beforeIndex = contentList.findIndex((content) => content.id == beforeContentId);
        let _contentList = [...contentList];
        _contentList.splice(beforeIndex + 1, 0, createdContent);
        setContentList(_contentList);
    };

    const onContentDestroyed = async (contentId: number) => {
        const destroyIndex = contentList.findIndex((content) => content.id == contentId);
        let _contentList = [...contentList];
        _contentList.splice(destroyIndex, 1);
        setContentList(_contentList);
    };
    
    const updateShowTitle = async (event: ChangeEvent<HTMLInputElement>) => {
        setIsTitleProcessing(true);
        try {
            const _isShowTitle = event.target.checked;
            await updatePage({
                is_show_title: _isShowTitle,
            });
            setIsShowTitle(_isShowTitle);
        } finally {
            setIsTitleProcessing(false);            
        }
    };

    return (
        <Box>
            {isLoading ? (
                <LinearProgress />
            ) : (
                <>
                    <h1>
                        {page!.title}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isShowTitle}
                                    onChange={updateShowTitle}
                                    disabled={isTitleProcessing}
                                />
                            }
                            label={isShowTitle ? "タイトル表示" : "タイトル非公開"}
                            sx={{ ml: 2 }}
                        />            
                    </h1>
                    <ContentsCreater
                        siteId={siteId}
                        pageId={pageId}
                        beforeContentId={0}
                        onCreated={onContentCreated}
                    />
                    {contentList.map((content: Content) => (
                        <Fragment key={content.id}>
                            <ContentsItem
                                content={content}
                                onDestroyed={onContentDestroyed}
                            />
                            <ContentsCreater
                                siteId={siteId}
                                pageId={pageId}
                                beforeContentId={content.id}
                                onCreated={onContentCreated}
                            />
                        </Fragment>
                    ))}
                </>
            )}
                
        </Box>
    );
};
