import React, { useState, Fragment } from "react";
import { Box, Grid } from "@mui/material";

import { Content } from "../../../../entities";
import { ContentInnerBox } from "../../../styled";
import { ContentProps } from "./ContentsItemCommon";
import { EditSwitcher, Display, Editor, EditorButtonSet, ErrorsDisplay } from "../../../parts";
import { useConfirmModal } from "../../../../contexts/modal-context";
import { useRepository } from "../../../../contexts/repository-context";
import { ContentsCreater, ContentsItem } from "./";

export function ContentsItemColumns(props: ContentProps) {
    
    const [content, setContent] = useState<Content>(props.content);
    const [editMode, setEditMode] = useState<boolean>(false);
    const toEdit = () => setEditMode(true);
    const toDisplay = () => setEditMode(false);

    const [innerContents, setInnerContents] = useState<Content[]>(props.content.value as Content[]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const { showConfirm } = useConfirmModal();
    const { deleteSite } = useRepository();

    const destroy = async () => {
        const isOk = await showConfirm('削除しますか？');
        if (!isOk) {
            return;
        }
        const response = await deleteSite(content.id);
        if (!response.result && Array.isArray(response.messages)) {
            setErrors(response.messages);
            return;
        }
        toDisplay();
        props.onDestroyed(content.id);
    }

    const handleInnerContentCreated = async (createdContent: Content, beforeContentId: number) => {
        const beforeIndex = innerContents.findIndex((content) => content.id == beforeContentId);
        let _innerContents = [...innerContents];
        _innerContents.splice(beforeIndex + 1, 0, createdContent);
        setInnerContents(_innerContents);
    };

    const handleInnerContentDestroyed = async (contentId: number) => {
        const destroyIndex = innerContents.findIndex((content) => content.id == contentId);
        let _innerContents = [...innerContents];
        _innerContents.splice(destroyIndex, 1);
        setInnerContents(_innerContents);
    };
    
    return (
        <ContentInnerBox>
            <Box onClick={toEdit}>
                <Grid container>
                    <Grid>
                        <ContentsCreater
                            siteId={content.siteId!}
                            pageId={content.pageId!}
                            parentContentId={content.id}
                            beforeContentId={0}
                            onCreated={handleInnerContentCreated}
                        />
                    </Grid>
                {innerContents.map((innerContent: Content) => (
                    <Fragment key={innerContent.id}>
                        <Grid
                            sx={{ flexGrow: 1 }}
                        >
                            <ContentsItem
                                content={innerContent}
                                onDestroyed={handleInnerContentDestroyed}
                            />
                        </Grid>
                        <Grid>
                            <ContentsCreater
                                siteId={content.siteId!}
                                pageId={content.pageId!}
                                parentContentId={content.id}
                                beforeContentId={innerContent.id}
                                onCreated={handleInnerContentCreated}
                            />
                        </Grid>
                    </Fragment>
                ))}
                </Grid>
            </Box>

            <EditSwitcher edit={editMode}>
                <Display></Display>
                <Editor>
                    <ErrorsDisplay errors={errors} />
                    <EditorButtonSet
                        useOk={false}
                        onClickCancel={toDisplay}
                        onClickDestroy={destroy}
                        isProcessing={isProcessing}
                    />
                </Editor>
            </EditSwitcher>

        </ContentInnerBox>
    );
}
