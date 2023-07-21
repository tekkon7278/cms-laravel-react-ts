import React, { useState } from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";

import { useRepository } from "../../../contexts/repository-context";
import { useEffectAsync } from "../../../custom/hooks";
import { Page } from "../../../entities";

export function SiteHeader() {

    const [pageList, setPageList] = useState<Page[]>([]);
    const { site, fetchAllPages } = useRepository();

    // 表示中サイトのページリストを取得しメインメニュー表示を更新
    useEffectAsync(async () => {
        if (site === undefined) {
            setPageList([]);
            return;
        }
        const pages = await fetchAllPages();
        setPageList(pages);
    }, [site]);

    return (
        <Box>
            <AppBar position="static" color="primary" enableColorOnDark>
                <Toolbar>
                {site !== undefined && (
                    <>
                        {/* ロゴ画像が設定されている場合は表示 */}
                        {site.logoImage !== "" && (
                            <Box sx={{ flexGrow: 1 }}>
                                <img src={site.logoImage} />
                            </Box>
                        )}

                        {/* ロゴ画像未設定の場合はサイト名表示 */}
                        {site.logoImage === "" && (
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                {site.name}
                            </Typography>
                        )}

                        {/* メインメニュー */}
                        <Box>
                            {pageList.map((page) => (
                                <Button
                                    key={page.id}
                                    sx={{
                                        color: "#fff",
                                    }}
                                >
                                    {page.title}
                                </Button>
                            ))}
                        </Box>
                    </>
                )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

