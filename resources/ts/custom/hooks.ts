import React, { useState, useEffect } from "react";

export const useEffectAsync = (
    func: Function,
    watchValues: any[],
    execOnRendered: boolean = true
) => {
    const [initial, setInitial] = useState<boolean>(true);
    useEffect(() => {
        if (watchValues.length > 0 && !execOnRendered && initial) {
            setInitial(false);
            return;
        }
        func();
    }, watchValues);
}
