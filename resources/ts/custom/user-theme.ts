import { createTheme, ThemeOptions, PaletteOptions } from "@mui/material/styles";
import * as themes from "./themes";

export const createUserTheme = (options: {
    colorThemeName: string,
    fontSizeLevel: number,
    elementSpaceLevel: number,
}, extraOptions: ThemeOptions = {}) => {

    const fontEms: number[] = [0.625, 0.75, 0.875, 1, 1.25, 1.5, 1.75, 2, 2.5, 2.75, 3];
    const marginEms: number[] = [0.25, 0.5, 0.75, 1, 1.25]

    const fontMinIndex = options.fontSizeLevel - 1;
    const spaceMinIndex = options.elementSpaceLevel - 1;

    return createTheme({
        ...extraOptions,
        palette: themes.colors[options.colorThemeName],
        typography: {
            h1: {
                fontSize: fontEms[fontMinIndex + 8].toString() + 'em',
                marginTop: marginEms[spaceMinIndex + 2].toString() + 'em',
                marginBottom: marginEms[spaceMinIndex + 0].toString() + 'em',
            },
            h2: {
                fontSize: fontEms[fontMinIndex + 7].toString() + 'em',
                marginTop: marginEms[spaceMinIndex + 2].toString() + 'em',
                marginBottom: marginEms[spaceMinIndex + 0].toString() + 'em',
            },
            h3: {
                fontSize: fontEms[fontMinIndex + 6].toString() + 'em',
                marginTop: marginEms[spaceMinIndex + 2].toString() + 'em',
                marginBottom: marginEms[spaceMinIndex + 0].toString() + 'em',
            },
            h4: {
                fontSize: fontEms[fontMinIndex + 5].toString() + 'em',
                marginTop: marginEms[spaceMinIndex + 2].toString() + 'em',
                marginBottom: marginEms[spaceMinIndex + 0].toString() + 'em',
            },
            h5: {
                fontSize: fontEms[fontMinIndex + 4].toString() + 'em',
                marginTop: marginEms[spaceMinIndex + 2].toString() + 'em',
                marginBottom: marginEms[spaceMinIndex + 0].toString() + 'em',
            },
            h6: {
                fontSize: fontEms[fontMinIndex + 3].toString() + 'em',
                marginTop: marginEms[spaceMinIndex + 2].toString() + 'em',
                marginBottom: marginEms[spaceMinIndex + 0].toString() + 'em',
            },
            subtitle1: {
                fontSize: fontEms[fontMinIndex + 2].toString() + 'em',
            },
            subtitle2: {
                fontSize: fontEms[fontMinIndex + 1].toString() + 'em',
            },
            body1: {
                fontSize: fontEms[fontMinIndex + 2].toString() + 'em',
            },
            body2: {
                fontSize: fontEms[fontMinIndex + 1].toString() + 'em',
            },
            button: {
                fontSize: fontEms[fontMinIndex + 1].toString() + 'em',
            },
            caption: {
                fontSize: fontEms[fontMinIndex + 0].toString() + 'em',
            },
            overline: {
                fontSize: fontEms[fontMinIndex + 0].toString() + 'em',
            }
        }
    });
}