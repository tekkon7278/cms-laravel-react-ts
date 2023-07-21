import React, { useState, useEffect } from "react";
import { Box, Container, LinearProgress, CircularProgress, Divider, Button, } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { RouterParams } from "../../cms/CmsRoutes";
import { useRepository } from "../../../../contexts/repository-context";
import { useConfirmModal } from "../../../../contexts/modal-context";
import { GridColumnsContainer, GridColumn, GridTitleColumn, Explain, Warning } from "../../../styled"
import { BasicItemText, BasicItemFile, BasicItemSwitch } from "./";
import { ErrorsDisplay } from "../../../parts";

export function Basic() {

    const { siteId: paramSiteId } = useParams<RouterParams>();
    const [siteId] = useState<number>(Number(paramSiteId));
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionErrors, setActionErrors] = useState<string[]>([]);

    const navigate = useNavigate();
    const { showConfirm } = useConfirmModal();
    const { site , setSiteId, fetchSite, updateSite, deleteSite, setPageIdNone } = useRepository();
    
    useEffect(() => {
        setSiteId(siteId);
        fetchSite();
        setPageIdNone();
    }, []);

    useEffect(() => {
        setIsLoading(site === undefined);
    }, [site]);

    const handleUpdate = async (siteId: number, propName: string, value: string) => {
        return await updateSite({
            [propName]: value,
        });
    }

    const handleDelete = async () => {
        const isOk = await showConfirm('削除しますか？');
        if (!isOk) {
            return;
        }
        setIsDeleting(true);
        try {            
            const response = await deleteSite();
            if (!response.result) {
                if (response.messages !== undefined) {
                    setActionErrors(response.messages);
                }
                return;
            }
        } finally {
            setIsDeleting(false);
        }
        navigate("/sites");
    }
    
    return (
        <Box>
            <h2>サイト基本設定</h2>
            <Container sx={{ mb: 10 }}>

                {/* サイト情報読み込み完了まではプログレス表示 */}
                {isLoading && <LinearProgress />}

                {/* サイト名 */}
                <GridColumnsContainer spacing={2}>
                    <GridTitleColumn xs={2}>サイト名</GridTitleColumn>
                    <GridColumn xs={8}>
                        {!isLoading ? (
                            <BasicItemText
                                siteId={site!.id}
                                propName="name"
                                defaultValue={site!.name}
                                onUpdate={handleUpdate}
                            />
                        ) : (
                            ""
                        )}
                        <Explain>
                            サイトロゴを設定しない場合にヘッダに表示されます。
                        </Explain>
                    </GridColumn>
                </GridColumnsContainer>

                <Divider />

                {/* ドメイン */}
                <GridColumnsContainer spacing={2}>
                    <GridTitleColumn xs={2}>ドメイン</GridTitleColumn>
                    <GridColumn xs={8}>
                        {!isLoading ? (
                            <BasicItemText
                                siteId={site!.id}
                                propName="domain"
                                defaultValue={site!.domain}
                                onUpdate={handleUpdate}
                            />
                        ) : (
                            ""
                        )}
                        <Explain>
                            ここで設定したドメインでサイト公開するには、そのドメインがIPアドレス：118.27.109.13に解決されるようにDNSのレコード設定もしくは端末のhosts設定が必要です。
                            <br />
                            "aaa.tkng.site"や"bbb.tkng.site"など、"tkng.site"のサブドメインであれば全てこのIPに解決されます。自由にご利用ください。
                        </Explain>
                    </GridColumn>
                </GridColumnsContainer>

                <Divider />

                {/* サイトロゴ */}
                <GridColumnsContainer spacing={2}>
                    <GridTitleColumn xs={2}>サイトロゴ</GridTitleColumn>
                    <GridColumn xs={8}>
                        {!isLoading ? (
                            <BasicItemFile
                                siteId={site!.id}
                                propName="logoImage"
                                defaultValue={site!.logoImage}
                                onUpdate={handleUpdate}
                            />
                        ) : (
                            ""
                        )}
                    </GridColumn>
                </GridColumnsContainer>

                <Divider />

                {/* 公開状態 */}
                <GridColumnsContainer spacing={2}>
                    <GridTitleColumn xs={2}>公開状態</GridTitleColumn>
                    <GridColumn xs={8}>
                        {!isLoading ? (
                            <BasicItemSwitch
                                siteId={site!.id}
                                propName="isPublished"
                                defaultValue={site!.isPublished}
                                onUpdate={handleUpdate}
                            />
                        ) : (
                            ""
                        )}
                    </GridColumn>
                </GridColumnsContainer>

            </Container>

            <h2>サイト操作</h2>
            <Container>

                {/* サイト削除 */}
                <ErrorsDisplay errors={actionErrors} />
                <GridColumnsContainer spacing={2}>
                    <GridTitleColumn xs={2}>サイト削除</GridTitleColumn>
                    <GridColumn xs={8}>
                        <Button
                            variant="contained"
                            disabled={isDeleting}
                            onClick={handleDelete}
                        >
                            サイト削除
                        </Button>
                        {isDeleting ? <CircularProgress size="2rem" /> : ""}
                    </GridColumn>
                </GridColumnsContainer>

                <Divider />

                {/* コピーサイト作成（未実装） */}
                <GridColumnsContainer spacing={2}>
                    <GridTitleColumn xs={2}>
                        コピーサイト作成
                        <Warning>※未実装</Warning>
                    </GridTitleColumn>
                    <GridColumn xs={8}>
                        <Button variant="contained">コピーサイト作成</Button>
                    </GridColumn>
                </GridColumnsContainer>

            </Container>
        </Box>
    );
};
