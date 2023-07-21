import React, { useState } from "react";
import { ContentInnerBox } from "../../../styled";
import { Content } from "../../../../entities";
import { useConfirmModal } from "../../../../contexts/modal-context";
import { useRepository } from "../../../../contexts/repository-context";
import { EditSwitcher, Display, Editor, EditorButtonSet, ErrorsDisplay } from "../../../parts";

export type ContentProps = {
    content: Content;
    onDestroyed: Function;
}

export function ContentsItemCommon(
    DisplayComponent: React.ElementType,
    EditComponent: React.ElementType
) {
    return function(props: ContentProps) {
        const [editMode, setEditMode] = useState<boolean>(false);
        const toEdit = () => setEditMode(true);
        const toDisplay = () => setEditMode(false);

        const [isProcessing, setIsProcessing] = useState(false);
        const [errors, setErrors] = useState<string[]>([]);
        const [content] = useState<Content>(props.content);
        const [originalValue, setOriginalValue] = useState<string | string[]>(props.content.value as string | string[]);
        const [value, setValue] = useState<string | string[]>(props.content.value as string | string[]);
        const { showConfirm } = useConfirmModal();
        const { updateContent, deleteContent } = useRepository();
        

        const updateValue = async () => {
            setErrors([]);
            setIsProcessing(true);
            try {
                const response = await updateContent(content.id, {
                    value: value
                });
                if (!response.result) {
                    if (response.messages !== undefined) {
                        setErrors(response.messages);
                    }
                    return;
                }
                setOriginalValue(value);
                setEditMode(false);
            } finally {
                setIsProcessing(false);
            }
        };

        const destroy = async () => {
            const isOk = await showConfirm('削除しますか？');
            if (!isOk) {
                return;
            }
            setIsProcessing(true);
            try {
                const response = await deleteContent(content.id);
                if (!response.result) {
                    setErrors(response.messages);
                    return;
                }
                toDisplay();
                props.onDestroyed(content.id);
            } finally {
                setIsProcessing(false);
            }
        }
    
        const cancelEdit = () => {
            toDisplay();
            setValue(originalValue);
            setErrors([]);
        };
    
        return (
            <EditSwitcher edit={editMode}>

                <Display>
                    <ContentInnerBox onClick={toEdit}>
                        <DisplayComponent
                            value={originalValue}
                        />
                    </ContentInnerBox>
                </Display>
                
                <Editor>
                    <ContentInnerBox sx={{ position: 'relative' }}>
                        <EditComponent
                            value={value}
                            isProcessing={isProcessing}
                            onChange={setValue}
                        />
                        <ErrorsDisplay errors={errors} />
                        <EditorButtonSet
                            onClickOk={updateValue}
                            onClickCancel={cancelEdit}
                            onClickDestroy={destroy}
                            isProcessing={isProcessing}
                        />
                    </ContentInnerBox>
                </Editor>

            </EditSwitcher>
        );
    }
};
