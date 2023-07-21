import { Entity } from '../entities';
import { ApiResponse } from "./";

export interface RepositoryInterface {

    getUrl(id?: number): string;

    fetch(id: number, params?: Object): Promise<Entity>;

    fetchAll(params?: Object): Promise<Entity[]>;

    store(params: Object): Promise<ApiResponse>;

    update(id: number, params: Object): Promise<ApiResponse>;

    destroy(id: number, params?: Object): Promise<ApiResponse>;
    
}
