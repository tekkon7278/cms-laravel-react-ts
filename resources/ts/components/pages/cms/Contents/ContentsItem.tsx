import React, { useState, } from "react";
import { ContentProps } from "./ContentsItemCommon";
import { ContentBox } from "../../../styled";
import { Content } from "../../../../entities";
import { ContentsItemText, ContentsItemCode, ContentsItemTitle, ContentsItemImage, ContentsItemList, ContentsItemColumns } from "./";

export function ContentsItem(props: ContentProps) {

    const [content, setContent] = useState<Content>(props.content);

    const ContentItemComponent = (_props: any) => {
        if (content.type === 'text') {
            return <ContentsItemText {..._props} />;
        } else if (content.type === 'code') {
            return <ContentsItemCode {..._props} />;
        } else if (content.type === 'title') {
            return <ContentsItemTitle {..._props} />;
        } else if (content.type === 'image') {
            return <ContentsItemImage {..._props} />;
        } else if (content.type === 'list') {
            return <ContentsItemList {..._props} />;
        } else if (content.type === 'columns') {
            return <ContentsItemColumns {..._props} />;
        }
    }

    return (
        <ContentBox>
            <ContentItemComponent
                content={content}
                onDestroyed={props.onDestroyed}
            />
        </ContentBox>
    );
};

