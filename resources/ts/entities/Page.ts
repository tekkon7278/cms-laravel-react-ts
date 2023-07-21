import { EntityInterface, Entity } from "./";

export type PageProps = {
    siteId: number | null;
    title: string;
    pathname: string;
    isShowTitle: boolean;
    isIndex: boolean;
    isPublished: boolean;
}

export class Page extends Entity implements EntityInterface {

    /**
     * プロパティ
     *
     * @protected
     * @type {PageProps}
     * @memberof Page
     */
    protected _props: PageProps = {
        siteId: null,
        title: '',
        pathname: '',
        isShowTitle: true,
        isIndex: false,
        isPublished: false,
    };

    set siteId(value: number) { this._props.siteId = value; }
    get siteId(): number | null { return this._props.siteId; }
    set title(value: string) { this._props.title = value; }
    get title(): string { return this._props.title; }
    set pathname(value: string) { this._props.pathname = value; }
    get pathname(): string { return this._props.pathname; }
    set isShowTitle(value: boolean) { this._props.isShowTitle = value; }
    get isShowTitle(): boolean { return this._props.isShowTitle; }
    set isIndex(value: boolean) { this._props.isIndex = value; }
    get isIndex(): boolean { return this._props.isIndex; }
    set isPublished(value: boolean) { this._props.isPublished = value; }
    get isPublished(): boolean { return this._props.isPublished; }

    /**
     * プロパティ一括設定
     *
     * @param {({        
     *         siteId: number | null;
     *         title: string | null;
     *         pathname: string | null;
     *         isIndex: boolean | null;
     *         isShowTitle: boolean | null;
     *         isPublished: boolean | null;
     *         [key: string]: any;
     *     })} data プロパティに設定するデータ
     * @memberof Page
     */
    public fillProps(data: {        
        siteId: number | null;
        title: string | null;
        pathname: string | null;
        isIndex: boolean | null;
        isShowTitle: boolean | null;
        isPublished: boolean | null;
        [key: string]: any;
    }): void {
        if (data.siteId !== null) this.siteId = data.siteId;
        if (data.title !== null) this.title = data.title;
        if (data.pathname !== null) this.pathname = data.pathname;
        if (data.isIndex !== null) this.isIndex = data.isIndex;
        if (data.isShowTitle !== null) this.isShowTitle = data.isShowTitle;
        if (data.isPublished !== null) this.isPublished = data.isPublished;
    }

}
