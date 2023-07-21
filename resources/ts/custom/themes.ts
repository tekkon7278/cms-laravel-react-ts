import { grey, blue, red, green, purple, orange, teal } from "@mui/material/colors";

export const fontSizes: {
    [key: number]: number
} = {
    1: 18,
    2: 16,
    3: 14,
}
declare module '@mui/material/styles' {
    interface Palette {
        cms_primary: {
            main: string;
        };
        cms_text: {
            main: string;
        };
        cms_icon: {
            main: string;
        };
    }
    interface PaletteOptions {
        cms_primary?: {
            main?: string;
        };
        cms_text?: {
            main?: string;
        };
        cms_icon?: {
            main?: string;
        };
    }
}

type CustomColorSubType = {
    main: string;
    lite: string;
}

type CustomColorType = {
    primary: CustomColorSubType;
    secondary: CustomColorSubType;
    error: CustomColorSubType;
    info: CustomColorSubType;
    success: CustomColorSubType;
    warning: CustomColorSubType;
    cms_primary: CustomColorSubType;
    cms_text: CustomColorSubType;
    cms_icon: CustomColorSubType;
}

/** @type {Object} */
const commonColors = {
    error: { main: '#FF5252' },
    info: { main: '#2196F3' },
    success: { main: '#4CAF50' },
    warning: { main: '#FFC107' },
    cms_primary: { main: grey[800] },
    cms_text: { main: teal[700] },
    cms_icon: { main: teal[400], lite: teal[200] },
};

// const colorCodes = {
//     grey_1: [ grey[200], grey[50] ],
//     grey_2: [ grey[600], grey[300] ],
//     grey_3: [ grey[900], grey[600] ],
//     blue_1: [ blue[200], blue[50] ],
//     blue_2: [ blue[700], blue[400] ],
//     blue_3: [ blue[900], blue[600] ],
//     red_1: [ red[200], red[50] ],
//     red_2: [ red[600], red[300] ],
//     red_3: [ red[900], red[600] ],
//     green_1: [ green[200], green[50] ],
//     green_2: [ green[600], green[300] ], 
//     green_3: [ green[900], green[600] ],
//     purple_1: [ purple[200], purple[50] ],
//     purple_2: [ purple[600], purple[300] ],
//     purple_3: [ purple[900], purple[600] ],
//     orange_1: [ orange[200], orange[50] ],
//     orange_2: [ orange[600], orange[300] ],
//     orange_3: [ orange[900], orange[600] ],
// };

export const colors: { [key: string]: CustomColorType } = {
    grey_1: Object.assign({
        primary: { main: grey[200] },
        secondary: { main: grey[50] },
    }, commonColors) as CustomColorType,    
    grey_2: Object.assign({
        primary: { main: grey[600] },
        secondary: { main: grey[300] },
    }, commonColors) as CustomColorType,
    grey_3: Object.assign({
        primary: { main: grey[900] },
        secondary: { main: grey[600] },
    }, commonColors) as CustomColorType,

    blue_1: Object.assign({
        primary: { main: blue[200] },
        secondary: { main: blue[50] },
    }, commonColors) as CustomColorType,
    blue_2: Object.assign({
        primary: { main: blue[700] },
        secondary: { main: blue[400] },
    }, commonColors) as CustomColorType,
    blue_3: Object.assign({
        primary: { main: blue[900] },
        secondary: { main: blue[600] },
    }, commonColors) as CustomColorType,

    red_1: Object.assign({
        primary: { main: red[200] },
        secondary: { main: red[50] },
    }, commonColors) as CustomColorType,
    red_2: Object.assign({
        primary: { main: red[600] },
        secondary: { main: red[300] },
    }, commonColors) as CustomColorType,
    red_3: Object.assign({
        primary: { main: red[900] },
        secondary: { main: red[600] },
    }, commonColors) as CustomColorType,

    green_1: Object.assign({
        primary: { main: green[200] },
        secondary: { main: green[50] },
    }, commonColors) as CustomColorType,
    green_2: Object.assign({
        primary: { main: green[600] },
        secondary: { main: green[300] },
    }, commonColors) as CustomColorType,
    green_3: Object.assign({
        primary: { main: green[900] },
        secondary: { main: green[600] },
    }, commonColors) as CustomColorType,

    purple_1: Object.assign({
        primary: { main: purple[200] },
        secondary: { main: purple[50] },
    }, commonColors) as CustomColorType,
    purple_2: Object.assign({
        primary: { main: purple[600] },
        secondary: { main: purple[300] },
    }, commonColors) as CustomColorType,
    purple_3: Object.assign({
        primary: { main: purple[900] },
        secondary: { main: purple[600] },
    }, commonColors) as CustomColorType,

    orange_1: Object.assign({
        primary: { main: orange[200] },
        secondary: { main: orange[50] },
    }, commonColors) as CustomColorType,
    orange_2: Object.assign({
        primary: { main: orange[600] },
        secondary: { main: orange[300] },
    }, commonColors) as CustomColorType,
    orange_3: Object.assign({
        primary: { main: orange[900] },
        secondary: { main: orange[600] },
    }, commonColors) as CustomColorType,
}
