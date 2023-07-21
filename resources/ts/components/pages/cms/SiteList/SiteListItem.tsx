import React from "react";
import { TableRow, TableCell, Link } from "@mui/material";
import { NavLink } from "react-router-dom";

import { Site } from "../../../../entities";

export function SiteListItem(
    props: { site: Site }
) {

    const site = props.site;

    const openSite = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        event.preventDefault();
        window.open((event.target as HTMLAnchorElement).href, "site_view");
    };

    return (
        <TableRow key={site.id}>

            {/* サイト名 */}
            <TableCell>
                <NavLink
                    to={`/sites/${site.id}/base`}
                    style={({ isActive, isPending }) => {
                        return {
                            textDecoration: 'none',
                            color: 'navy',
                        };
                    }}
                >{site.name}</NavLink>
            </TableCell>

            {/* URL */}
            <TableCell>
                <Link
                    href={`http://${site.domain}`}
                    onClick={openSite}                    
                    sx={{
                        textDecoration: 'none',
                        color: 'navy',
                    }}
                >
                    {site.domain}
                </Link>
            </TableCell>

            {/* 公開状態 */}
            <TableCell>
                {site.isPublished ? "公開" : "非公開"}
            </TableCell>

        </TableRow>
    );
};
