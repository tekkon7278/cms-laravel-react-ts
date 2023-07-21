import { RepositoryInterface, Repository } from './';
import { Content } from '../entities';

export class ContentRepository extends Repository implements RepositoryInterface {

    constructor(urlParams: {siteId: number, pageId: number}) {
        super();
        const siteId = urlParams.siteId.toString();
        const pageId = urlParams.pageId.toString();
        this.basePath = `/sites/${siteId}/pages/${pageId}/contents`;
    }

    protected newEntity(id: number): Content {
        return new Content(id);
    }
    
    async fetch(id: number, params?: Object): Promise<Content> {
        return await super.fetch(id, params) as Content;
    }

    async fetchAll(params?: Object): Promise<Content[]> {
        return await super.fetchAll(params) as Content[];
    }
}
