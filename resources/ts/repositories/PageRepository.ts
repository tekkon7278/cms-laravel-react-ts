import { RepositoryInterface, Repository } from './';
import { Page } from '../entities';

export class PageRepository extends Repository implements RepositoryInterface {

    constructor(urlParams: {siteId: number}) {
        super();
        const siteId = urlParams.siteId.toString();
        this.basePath = `/sites/${siteId}/pages`;
    }
    
    protected newEntity(id: number): Page {
        return new Page(id);
    }

    async fetch(id: number, params?: Object): Promise<Page> {
        return await super.fetch(id, params) as Page;
    }

    async fetchAll(params?: Object): Promise<Page[]> {
        return await super.fetchAll(params) as Page[];
    }
}
