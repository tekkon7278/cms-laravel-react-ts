import React, { ChangeEvent, useState } from "react";
import { Box, Switch, FormControlLabel } from "@mui/material";

import { useEffectAsync } from "../../../../custom/hooks";
import { SiteProps } from "../../../../entities";
import { ErrorsDisplay } from "../../../parts";

export function BasicItemSwitch(props: {
    siteId: number;
    propName: keyof SiteProps;
    defaultValue: boolean;
    onUpdate: Function;
}) {

    const [value, setValue] = useState<boolean>(props.defaultValue);
    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.checked);
    }

    useEffectAsync(async () => {
        setErrors([]);
        const response = await props.onUpdate(props.siteId, props.propName, value);
        if (!response.result) {
            setErrors(response.messages!);
        }
    }, [value], false);

    return (
        <Box>
            <FormControlLabel
                control={
                    <Switch
                        checked={value}
                        onChange={handleChange}
                    />
                }
                label={value ? "公開中" : "非公開"}
            />
            <ErrorsDisplay errors={errors} />
        </Box>
    );
};

