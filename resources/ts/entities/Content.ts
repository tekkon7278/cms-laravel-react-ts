import { EntityInterface, Entity } from "./";

export type ContentProps = {
    siteId: number | null;
    pageId: number | null;
    type: string;
    value: string;
    values: string[];
    innerContents: Content[];
}

type ContentApiResponseData = {
    siteId: number | null;
    pageId: number | null;
    type: string | null;
    value: string | string[] | Content[] | null;
    [key: string]: any
}

export class Content extends Entity implements EntityInterface {

    /**
     * プロパティ
     *
     * @protected
     * @type {ContentProps}
     * @memberof Content
     */
    protected _props: ContentProps = {
        siteId: null,
        pageId: null,
        type: 'text',
        value: '',
        values: [],
        innerContents: [],
    };

    set siteId(value: number) { this._props.siteId = value; }
    get siteId(): number | null { return this._props.siteId; }
    set pageId(value: number) { this._props.pageId = value; }
    get pageId(): number | null { return this._props.pageId; }
    set type(value: string) { this._props.type = value; }
    get type(): string { return this._props.type; }
    set value(value: string | string[]) {
        if (this.type === 'list' && Array.isArray(value)) {
            this._props.values = value;
        } else if (typeof value === 'string') {
            this._props.value = value
        }
    }
    get value(): string | string[] | Content[] {
        if (this.type === 'list') {
            return this._props.values;
        } else if (this.type === 'columns') {
            return this._props.innerContents;
        } else {
            return this._props.value;
        }
    }

    /**
     * プロパティ一括設定
     *
     * @param {ContentApiResponseData} data プロパティに設定するデータ
     * @memberof Content
     */
    public fillProps(data: ContentApiResponseData): void {
        if (data.siteId !== null) this.siteId = data.siteId;
        if (data.pageId !== null) this.pageId = data.pageId;
        if (data.type !== null) {
            this.type = data.type;
            if (data.type === 'columns' && Array.isArray(data.value)) {
                for (const innerData of (data.value as ContentApiResponseData[])) {
                    const innerContent = new Content(innerData.id);
                    innerContent.fillProps(innerData);
                    this._props.innerContents.push(innerContent);
                } 
            } else if (data.type === 'list' && Array.isArray(data.value)) {
                for (const innerValue of data.value as string[]) {
                    this._props.values.push(innerValue);
                } 
            } else if (typeof data.value === 'string') {
                this.value = data.value;
            }
        }
    }
}

