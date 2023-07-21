import React, { useState } from "react";

import { EditIcon } from "../../../parts/icon";
import { SiteProps } from "../../../../entities";
import { CmsIconButton } from "../../../styled"
import { EditSwitcher, Display, Editor, EditorButtonSet, ErrorsDisplay, FileInput } from '../../../parts';

/**
 * サイトのファイルアップロード項目のアイテム
 *
 * @export
 * @param {{
 *     siteId: number;
 *     propName: keyof SiteProps;
 *     defaultValue: string;
 *     onUpdate: Function;
 * }} props
 * @returns {*} 
 */
export function BasicItemFile(props: {
    siteId: number;
    propName: keyof SiteProps;
    defaultValue: string;
    onUpdate: Function;
}) {

    const [editMode, setEditMode] = useState<boolean>(false);
    const toEdit = () => setEditMode(true);
    const toDisplay = () => setEditMode(false);

    const [errors, setErrors] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [base64Image, setBase64Image] = useState<string>(props.defaultValue);

    /**
     * 編集をキャンセルして表示モードに戻す
     * 
     * @remarks
     * エラー表示がある場合はそれもクリア
     */
    const cancelEdit = () => {
        toDisplay();
        setErrors([]);
    };

    /**
     * OKアイコン操作時ハンドラ。更新処理の実行
     * 
     * @remarks
     * サイト更新処理はpropsを介して親コンポーネントであるSiteEditBaseで実行。
     * 処理完了したら編集モード状態から表示モードへ切り替える。
     *
     * @returns {void} 
     */
    const handleClickOk = async () => {
        setIsProcessing(true);
        try {            
            const response = await props.onUpdate(props.siteId, props.propName, base64Image);
            if (!response.result) {
                if (response.messages !== undefined) {
                    setErrors(response.messages);
                }
                return;
            }
        } finally {
            setIsProcessing(false);
        }
        cancelEdit();
    };

    return (
        <EditSwitcher edit={editMode}>

            {/* 表示モードブロック */}
            <Display>
                {base64Image !== "" && <img src={base64Image} />}
                <CmsIconButton onClick={toEdit}>
                    <EditIcon />
                </CmsIconButton>
            </Display>

            {/* 編集モードブロック */}
            <Editor>
                <FileInput
                    onSelectFile={setBase64Image}
                />
                <ErrorsDisplay errors={errors} />
                <EditorButtonSet
                    useDestroy={true}
                    onClickOk={handleClickOk}
                    onClickCancel={cancelEdit}
                    onClickDestroy={cancelEdit}
                    isProcessing={isProcessing}
                />
            </Editor>

        </EditSwitcher>
    );
};

