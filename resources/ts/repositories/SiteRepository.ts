import { RepositoryInterface, Repository } from './';
import { Site } from '../entities';

export class SiteRepository extends Repository implements RepositoryInterface {

    /**
     * Creates an instance of SiteRepository.
     * @memberof SiteRepository
     */
    constructor() {
        super();
        this.basePath = '/sites';
    }

    /**
     * サイトのエンティティ生成
     *
     * @protected
     * @param {number} id サイトID
     * @returns {*}  {Site}
     * @memberof SiteRepository
     */
    protected newEntity(id: number): Site {
        return new Site(id);
    }

    async fetch(id: number, params?: Object): Promise<Site> {
        return await super.fetch(id, params) as Site;
    }

    async fetchAll(params?: Object): Promise<Site[]> {
        return await super.fetchAll(params) as Site[];
    }
}

