import React, { createContext, useContext, useState } from 'react';
import { Site, Page } from "../entities";
import { SiteRepository, PageRepository, ContentRepository} from "../repositories";

type RepositoryContextType = {
    site: Site | undefined;
    setSiteId: Function;
    setSiteIdNone: Function;
    fetchSite: Function;
    fetchAllSites: Function;
    updateSite: Function;
    createSite: Function;
    deleteSite: Function;
    page: Page | undefined;
    setPageId: Function;
    setPageIdNone: Function;
    fetchPage: Function;
    fetchAllPages: Function;
    updatePage: Function;
    createPage: Function;
    deletePage: Function;
    fetchContent: Function;
    fetchAllContents: Function;
    updateContent: Function;
    createContent: Function;
    deleteContent: Function;
}

type IdsType = {
    siteId: number | undefined;
    pageId: number | undefined;
}

type RepositoriesType = {
    site: SiteRepository;
    page: PageRepository | undefined;
    content: ContentRepository | undefined;
}

export const RepositoryContext = createContext({} as RepositoryContextType);

export const RepositoryProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

    const [ids] = useState<IdsType>({ siteId: undefined, pageId: undefined });
    const [repositories] = useState<RepositoriesType>({ site: new SiteRepository(), page: undefined, content: undefined });
    const [site, setSite] = useState<Site | undefined>();
    const [page, setPage] = useState<Page | undefined>();

    const setSiteIdNone = () => {
        setSiteId(undefined);
        setSite(undefined);
        repositories.page = undefined;
    }

    const setSiteId = (siteId: number | undefined) => {
        ids.siteId = siteId;
        let repo = undefined;
        if (siteId !== undefined) {
            repo = new PageRepository({ siteId: siteId });
        }
        repositories.page = repo;
        setPageIdNone();
    }

    const setPageIdNone = () => {
        setPageId(undefined);
        setPage(undefined);
    }

    const setPageId = (pageId: number | undefined) => {
        ids.pageId = pageId;
        let repo = undefined;
        if (ids.siteId !== undefined && pageId !== undefined) {
            repo = new ContentRepository({ siteId: ids.siteId, pageId: pageId });
        }
        repositories.content = repo;
    }

    const fetchSite = async (
        forceFetch: boolean = false
    ) => {
        if (!forceFetch && site !== undefined) {
            return site;
        }
        const siteId = ids.siteId;
        if (siteId === undefined)  {
            throw Error('site id is not specified.');
        }
        const _site = await repositories.site.fetch(siteId);
        setSite(_site);
        return _site;
    }

    const fetchAllSites = async () => {
        return await repositories.site.fetchAll();
    }

    const createSite = async (
        params: { [key: string]: any }
    ) => {
        return await repositories.site.store(params);
    }

    const updateSite = async (
        params: { [key: string]: any }
    ) => {
        const siteId = ids.siteId;
        if (siteId === undefined) {
            throw Error('site id is not specified.');
        }
        return await repositories.site.update(siteId, params);
    }

    const deleteSite = async () => {
        const siteId = ids.siteId;
        if (siteId === undefined) {
            throw Error('site id is not specified.');
        }
        return await repositories.site.destroy(siteId);
    };

    const fetchPage = async (
        forceFetch: boolean = false
    ) => {
        if (!forceFetch && page !== undefined) {
            return page;
        }
        const pageId = ids.pageId;
        if (pageId === undefined) throw Error('page id is not specified.');
        if (repositories.page === undefined) throw Error('pageRepository is not created.');
        const _page = await repositories.page.fetch(pageId);
        setPage(_page);
        return _page;
    }

    const fetchAllPages = async () => {
        if (repositories.page === undefined) throw Error('pageRepository is not created.');
        return await repositories.page.fetchAll();
    }

    const createPage = async (
        params: { [key: string]: any }
    ) => {
        if (repositories.page === undefined) throw Error('pageRepository is not created.');
        return await repositories.page.store(params);
    }

    const updatePage = async (
        params: { [key: string]: any },
        pageId?: number
    ) => {
        const _pageId = (pageId === undefined) ? ids.pageId : pageId;
        if (_pageId === undefined) throw Error('page id is not specified.');
        if (repositories.page === undefined) throw Error('pageRepository is not created.');
        return await repositories.page.update(_pageId, params);
    }

    const deletePage = async (
        pageId?: number
    ) => {
        const _pageId = (pageId === undefined) ? ids.pageId : pageId;
        if (pageId === undefined) throw Error('page id is not specified.');
        if (repositories.page === undefined) throw Error('pageRepository is not created.');
        return await repositories.page.destroy(pageId);
    };

    const fetchContent = async (
        contentId: number,
    ) => {
        if (repositories.content === undefined) throw Error('contentRepository is not created.');
        const _content = await repositories.content.fetch(contentId);
        return _content;
    }

    const fetchAllContents = async () => {
        if (repositories.content === undefined) throw Error('contentRepository is not created.');
        return await repositories.content.fetchAll();
    }

    const createContent = async (
        params: { [key: string]: any }
    ) => {
        if (repositories.content === undefined) throw Error('contentRepository is not created.');
        return await repositories.content.store(params);
    }

    const updateContent = async (
        contentId: number,
        params: { [key: string]: any }
    ) => {
        if (repositories.content === undefined) throw Error('contentRepository is not created.');
        return await repositories.content.update(contentId, params);
    }

    const deleteContent = async (
        contentId: number
    ) => {
        if (repositories.content === undefined) throw Error('contentRepository is not created.');
        return await repositories.content.destroy(contentId);
    };

    return (
        <RepositoryContext.Provider
            value={{
                site,
                setSiteId,
                setSiteIdNone,
                fetchSite,
                fetchAllSites,
                createSite,
                updateSite,
                deleteSite,
                page,
                setPageId,
                setPageIdNone,
                fetchPage,
                fetchAllPages,
                updatePage,
                createPage,
                deletePage,
                fetchContent,
                fetchAllContents,
                updateContent,
                createContent,
                deleteContent,
            }}
        >
            {children}
        </RepositoryContext.Provider>
    );
}

export function useRepository() {
    return useContext(RepositoryContext);
}
