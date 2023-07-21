import axios, { AxiosStatic } from "axios";
import { Entity } from "../entities";

export type ApiResponse = {
    result: boolean;
    id?: number;
    messages?: string[];
    entity?: Entity;
};

export abstract class Repository {

    protected axios: AxiosStatic;
    protected basePath: string = "";

    /**
     * Creates an instance of Repository.
     * @memberof Repository
     */
    constructor() {
        this.initAxios();
    }

    /**
     * axiosの初期化
     *
     * @memberof Repository
     */
    initAxios() {
        axios.defaults.baseURL = "/api";
        axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                console.log(error);
            }
        );
        this.axios = axios;
    }

    /**
     * リクエストURLを取得
     *
     * @param {number} [id] リソースのID
     * @returns {string} リクエストURL
     * @memberof Repository
     */
    getUrl(id?: number): string {
        let url = this.basePath;
        if (id !== undefined) {
            url += "/" + id.toString();
        }
        return url;
    }

    protected abstract newEntity(id: number): any;

    /**
     * ID指定でGET
     *
     * @param {number} id リソースID
     * @param {Object} [params] パラメータ
     * @returns {Promise<any>}
     * @memberof Repository
     */
    async fetch(id: number, params?: Object): Promise<any> {
        const axiosResponse = await axios.get(this.getUrl(id), params);  
        const entity = this.newEntity(id);
        entity.fillProps(axiosResponse.data);
        return entity;
    }

    /**
     * リソースリストGET
     *
     * @param {Object} [params] パラメータ
     * @returns {Promise<any>}
     * @memberof Repository
     */
    async fetchAll(params?: Object): Promise<any[]> {
        const axiosResponse = await axios.get(this.getUrl(), { params: params });
        let entities = [];
        for (const item of axiosResponse.data) {
            const entity = this.newEntity(item.id);
            entity.fillProps(item);
            entities.push(entity);
        }
        return entities;
    }

    /**
     * リソース登録（POST）
     *
     * @param {Object} params パラメータ
     * @returns {Promise<ApiResponse>}
     * @memberof Repository
     */
    async store(params: Object): Promise<ApiResponse> {
        const axiosResponse = await axios.post(this.getUrl(), params);
        const { result, id, messages } = axiosResponse.data;
        const entity = await this.fetch(id);
        return {
            result: result,
            id: id,
            messages: messages,
            entity: entity,
        };
    }

    /**
     * リソース更新（UPDATE）
     *
     * @param {number} id リソースID
     * @param {Object} params パラメータ
     * @returns {Promise<ApiResponse>}
     * @memberof Repository
     */
    async update(id: number, params: Object): Promise<ApiResponse> {
        const axiosResponse = await axios.put(this.getUrl(id), params);
        const { result, messages } = axiosResponse.data;
        const entity = await this.fetch(id);
        return {
            result: result,
            messages: messages,
            entity: entity,
        };
    }

    /**
     * リソース削除（DELETE）
     *
     * @param {number} id リソースID
     * @param {Object} params パラメータ
     * @returns {Promise<ApiResponse>}
     * @memberof Repository
     */
    async destroy(id: number, params?: Object): Promise<ApiResponse> {
        const axiosResponse = await axios.delete(this.getUrl(id), params);
        const { result, messages } = axiosResponse.data;
        return {
            result: result,
            messages: messages,
        };
    }
}
