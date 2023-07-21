import React, { useState } from "react";
import { AppBar, Container, Box, Toolbar, Typography, Button, List, ListItem, ListItemText, Grid } from "@mui/material";

import { useEffectAsync } from "../../../custom/hooks";
import { Site, Page, Content } from '../../../entities';
import { SiteRepository, PageRepository, ContentRepository } from "../../../repositories";

export function SitePage(props: {
    siteId: number,
    pageId: number,
    onSiteLoaded: Function,
    preview?: boolean;
}) {
    const [siteId] = useState<number>(props.siteId);
    const [pageId] = useState<number>(props.pageId);
    const [site, setSite] = useState<Site>(new Site());
    const [pageList, setPageList] = useState<Page[]>([]);
    const [page, setPage] = useState<Page>(new Page());
    const [contentList, setContentList] = useState<Content[]>([]);
    const [isPreview] = useState<boolean>(props.preview === undefined ? false : props.preview);

    useEffectAsync(async () => {
        const siteRepo = new SiteRepository();
        const _site = await siteRepo.fetch(siteId);
        setSite(_site);
        props.onSiteLoaded(_site);
    }, []);

    useEffectAsync(async () => {
        const pageRepo = new PageRepository({ siteId: siteId, });
        const _pageList = await pageRepo.fetchAll();
        setPageList(_pageList);
    }, []);

    useEffectAsync(async () => {
        const pageRepo = new PageRepository({ siteId: siteId, });
        const _oage = await pageRepo.fetch(pageId);
        setPage(_oage);
    }, []);

    useEffectAsync(async () => {
        const contentRepo = new ContentRepository({ siteId: siteId, pageId: pageId, });
        const _contentList = await contentRepo.fetchAll();
        setContentList(_contentList);
    }, []);

    return (
        <>
            <Box>
                <AppBar position="static" color="primary" enableColorOnDark>
                    <Toolbar>
                    {site.logoImage !== "" ? (
                        <Box sx={{ flexGrow: 1 }}>
                            <img src={site.logoImage} />
                        </Box>
                    ) : (
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {site.name}
                        </Typography>
                    )}                    
                        <Box>
                            {pageList.map((page) => (
                                <Button
                                    key={page.id}
                                    sx={{ color: "#fff" }}
                                    href={isPreview ? '' : `/${page.pathname}`}
                                >{page.title}</Button>
                            ))}
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

            <Container sx={{ my: 5 }}>
                <Typography variant="h1">{page.title}</Typography>
                {contentList.map((content) => (
                <Box
                    key={content.id}
                    sx={{ my: 4 }}
                >
                    {content.type === 'title' &&
                        <Typography variant="h2">{content.value as string}</Typography>
                    }
                    {content.type === 'text' &&
                        <Typography>{content.value as string}</Typography>
                    }
                    {content.type === 'code' &&
                        <Typography component="pre">{content.value as string}</Typography>
                    }
                    {content.type === 'list' &&
                        <List>
                        {(content.value as string[]).map((itemValue: string, index: number) => (
                            <ListItem key={index} sx={{ px: 1, py: 0 }}>
                                <ListItemText
                                    primary={itemValue}
                                />
                            </ListItem>
                        ))}
                        </List>
                    }
                    {content.type === 'image' &&
                        <img src={content.value as string} />
                    }
                    {content.type === 'columns' &&
                        <Grid container>
                        {(content.value as Content[]).map((innerContent) => (
                            <Grid
                                key={innerContent.id}
                                sx={{ flexGrow: 1 }}
                            >
                            {innerContent.type === 'title' &&
                                <Typography component="h2">{innerContent.value as string}</Typography>
                            }
                            {innerContent.type === 'text' &&
                                <Typography>{innerContent.value as string}</Typography>
                            }
                            {innerContent.type === 'code' &&
                                <Typography component="pre">{innerContent.value as string}</Typography>
                            }
                            {innerContent.type === 'list' &&
                                <List>
                                {(innerContent.value as string[]).map((itemValue: string, index: number) => (
                                    <ListItem key={index} sx={{ px: 1, py: 0 }}>
                                        <ListItemText
                                            primary={itemValue}
                                        />
                                    </ListItem>
                                ))}
                                </List>
                            }
                            {innerContent.type === 'image' &&
                                <img src={innerContent.value as string} />
                            }
                            </Grid>
                        ))}
                        </Grid>
                    }
                </Box>
                ))}
            </Container>

        </>
    );
};

