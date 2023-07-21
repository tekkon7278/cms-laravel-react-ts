import { EntityInterface, Entity } from "./";

export type SiteProps = {
    name: string;
    domain: string;
    logoImage: string;
    colorTheme: string;
    fontSize: number;
    elementSpace: number;
    isPublished: boolean;
}

export class Site extends Entity implements EntityInterface  {

    /**
     * プロパティ
     *
     * @protected
     * @type {SiteProps}
     * @memberof Site
     */
    protected _props: SiteProps = {
        name: '',
        domain: '',
        logoImage: '',
        colorTheme: 'blue_2',
        fontSize: 2,
        elementSpace: 2,
        isPublished: false,
    };

    /**
     * コンストラクタ
     * 
     * @param {number} [id] サイトID
     * @param {SiteProps} [props] プロパティ
     * @memberof Site
     */
    constructor(id?: number, props?: SiteProps) {
        super(id);
        if (id !== undefined) {
            this.id = id;
        }
        if (props !== undefined) {
            this.fillProps(props);
        }
    }

    set name(value: string) { this._props.name = value; }
    get name(): string { return this._props.name; }
    set domain(value: string) { this._props.domain = value; }
    get domain(): string { return this._props.domain; }
    set logoImage(value: string) { this._props.logoImage = value; }
    get logoImage(): string { return this._props.logoImage; }
    set colorTheme(value: string) {  this._props.colorTheme = value; }
    get colorTheme(): string { return this._props.colorTheme; }
    set fontSize(value: number) {  this._props.fontSize = value; }
    get fontSize(): number { return this._props.fontSize; }
    set elementSpace(value: number) {  this._props.elementSpace = value; }
    get elementSpace(): number { return this._props.elementSpace; }
    set isPublished(value: boolean) {  this._props.isPublished = value; }
    get isPublished(): boolean { return this._props.isPublished; }

    /**
     * プロパティ一括設定
     *
     * @param {({
     *         name: string | null;
     *         domain: string | null;
     *         logoImage: string | null;
     *         colorTheme: string | null;
     *         fontSize: number | null;
     *         elementSpace: number | null;
     *         isPublished: boolean | null;
     *         [key: string]: any;
     *     })} data プロパティに設定するデータ
     * @memberof Site
     */
    public fillProps(data: {
        name: string | null;
        domain: string | null;
        logoImage: string | null;
        colorTheme: string | null;
        fontSize: number | null;
        elementSpace: number | null;
        isPublished: boolean | null;
        [key: string]: any;
    }): void {
        if (data.name !== null) this.name = data.name;
        if (data.domain !== null) this.domain = data.domain;
        if (data.logoImage !== null) this.logoImage = data.logoImage;
        if (data.colorTheme !== null) this.colorTheme = data.colorTheme;
        if (data.fontSize !== null) this.fontSize = data.fontSize;
        if (data.elementSpace !== null) this.elementSpace = data.elementSpace;
        if (data.isPublished !== null) this.isPublished = data.isPublished;
    }
    
}

