import React, { useState, useEffect } from "react";
import { Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, LinearProgress } from "@mui/material";

import { useEffectAsync } from "../../../../custom/hooks";
import { useRepository } from "../../../../contexts/repository-context";
import { Site } from "../../../../entities";
import { Explain } from "../../../styled";
import { SiteCreater, SiteListItem } from "./";

export function SiteList() {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [siteList, setSiteList] = useState<Site[]>([]);
    const { fetchAllSites, setSiteIdNone, setPageIdNone } = useRepository();

    useEffect(() => {
        setSiteIdNone();
        setPageIdNone();
    }, []);
    
    useEffectAsync(async () => {
        const entities = await fetchAllSites();
        setSiteList(entities);
        setIsLoading(false);
    }, []);

    const handleCreated = (event: Event, createdSite: Site) => {
        siteList.push(createdSite);
        setSiteList([...siteList]);
    };

    return (
        <>
            <Box sx={{ mt: 4 }}>

                {/* リストデータ取得中はローディングを表示 */}
                {isLoading &&
                    <LinearProgress />
                }

                {/* サイトリスト */}
                <TableContainer>
                    <Table sx={{ fontSize: '1rem' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold',  }}>
                                    サイト名
                                    <Explain>クリックでサイトの設定へ移動します</Explain>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    URL
                                    <Explain>クリックでサイトへ移動します</Explain>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>公開状態</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {siteList.map((site: Site) => (
                                <SiteListItem key={site.id} site={site} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* サイト追加フォーム */}
            <Box sx={{ m: 1 }}>
                <SiteCreater onCreated={handleCreated} />
            </Box>
        </>
    );
};
