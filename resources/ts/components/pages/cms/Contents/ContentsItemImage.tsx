import React from "react";
import { ContentsItemCommon, ContentProps } from "./";
import { FileInput } from '../../../parts';

function displayComponent(props: {
    value: string;
}) {
    return (
        <img src={props.value} />
    );
};

function editorComponent(props: {
    value: string;
    isProcessing: boolean;
    onChange: Function;
}) {

    const handleSelect = (fileData: string, fileInfo: File) => {
        props.onChange(fileData, fileInfo);
    }

    return (
        <FileInput
            onSelectFile={handleSelect}
        />
    );
}

export function ContentsItemImage(props: ContentProps) {
    return ContentsItemCommon(displayComponent, editorComponent)(props);
}

