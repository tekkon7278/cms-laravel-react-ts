import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";

export const ContentBox = styled(Box)(({ theme }) => ({
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: theme.palette.cms_icon.main,
    margin: 10,
    padding: 0,
    "&:hover": {
        borderStyle: "solid",
    },
}));

export const ContentInnerBox = styled(Box)(({ theme }) => ({
    padding: 10,
}));

export const GridColumnsContainer = (props: any) => {
    return <Grid container alignItems="center" {...props} />;
}

const _GridColumn = (props: any) => {
    return <Grid {...props} />;
}
export const GridColumn = styled(_GridColumn)(({ theme }) => ({
    paddingTop: 30,
    paddingBottom: 30,
}));
export const GridTitleColumn = styled(GridColumn)(({ theme }) => ({
    fontWeight: 'bolder',
}));

export const Explain = styled(Typography)(({ theme }) => ({
    color: theme.palette.cms_text.main,
    fontSize: '0.75rem',
}));

export const Warning = styled(Typography)(({ theme }) => ({
    color: theme.palette.cms_text.main,
    fontSize: '0.75rem',
}));

export const CmsIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.cms_icon.main,
}));
