
export abstract class Entity {
    
    protected _id: number;
    protected _props = {};

    /**
     * コンストラクタ
     * 
     * @param {number} [id]
     * @memberof Entity
     */
    constructor(id?: number) {
        if (id !== undefined) {
            this.id = id;
        }
    }

    /**
     * IDをセットする
     *
     * @memberof Entity
     */
    set id(id: number) {
        this._id = id;
    }

    /**
     * IDを取得する
     * 
     * @returns {number}
     * @memberof Entity
     */

    /**
     * IDを取得する
     *
     * @type {number}
     * @memberof Entity
     */
    get id(): number {
        return this._id;
    }

}
