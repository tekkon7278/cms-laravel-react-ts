import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LinearProgress, ToggleButtonGroup, ToggleButton, Slider, Typography } from "@mui/material";

import { useRepository } from "../../../../contexts/repository-context";
import { RouterParams } from "../../cms/CmsRoutes";
import { GridColumnsContainer, GridColumn, GridTitleColumn } from "../../../styled"

export function Design() {

    const { siteId: paramSiteId } = useParams<RouterParams>();
    const [siteId] = useState<number>(Number(paramSiteId));
    const [isLoading, setIsLoading] = useState(true);
    const [color, setColor] = useState<string>('blue');
    const [density, setDensity] = useState<number>(2);
    const [fontSize, setFontSize] = useState<number>(2);
    const [elementSpace, setElementSpace] = useState<number>(2);
    const { site, setSiteId, fetchSite, updateSite, setPageIdNone } = useRepository();

    // 初期表示時。contextでサイトデータ取得・保持。
    // ページ編集画面から遷移してきた場合を想定してページ情報はクリア。
    useEffect(() => {
        setSiteId(siteId);
        fetchSite();
        setPageIdNone();
    }, []);

    // contextのサイトデータ更新時。
    // データ取得が完了したらサイトのデザイン関係設定表示
    useEffect(() => {
        setIsLoading(site === undefined);
        if (site === undefined) {
            return;
        }
        const [_color, _density] = site.colorTheme.split('_');
        setColor(_color);
        setDensity(Number(_density));
    }, [site]);

    const handleChangeColor = (value: string) => {
        setColor(value);
        const _colorTheme = `${value}_${density}`;
        updateSite({
            'color_theme':  _colorTheme
        });
        fetchSite(true);
    }

    const handleChangeDensity = (value: number | number[]) => {
        setDensity(value as number);
        const _colorTheme = `${color}_${value.toString()}`;
        updateSite('color_theme', _colorTheme);
        fetchSite(true);
    }

    const handleChangeFontSize = (value: number | number[]) => {
        const _fontSize = value as number;
        setFontSize(_fontSize);
        updateSite('font_size', _fontSize);
        fetchSite(true);
    }

    const handleChangeSpacing = (value: number | number[]) => {
        const _elementSpace = value as number;
        setElementSpace(_elementSpace);
        updateSite('element_space', _elementSpace);
        fetchSite(true);
    }

    // 未実装
    const handleChangeFontColor = (value: number | number[]) => {
    }

    return (
        <>
            {isLoading && <LinearProgress />}

            <Typography variant="h5">カラー</Typography>
            <ToggleButtonGroup
                value={color}
                exclusive
                onChange={(event, value: string) => handleChangeColor(value)}
                aria-label="コンテンツ種別選択"
                disabled={isLoading}
            >
                <ToggleButton value="grey">モノトーン</ToggleButton>
                <ToggleButton value="blue">ブルー系</ToggleButton>
                <ToggleButton value="red">レッド系</ToggleButton>
                <ToggleButton value="green">グリーン系</ToggleButton>
                <ToggleButton value="purple">パープル系</ToggleButton>
                <ToggleButton value="orange">オレンジ系</ToggleButton>
            </ToggleButtonGroup>

            <GridColumnsContainer>
                <GridTitleColumn xs={1}>濃度</GridTitleColumn>
                <GridColumn xs={5}>
                    <Slider
                        value={density}
                        min={1}
                        max={3}
                        step={1}
                        marks={[
                            {value: 1, label: '薄'},
                            {value: 2, label: '中'},
                            {value: 3, label: '濃'},
                        ]}
                        onChange={(event, value) => handleChangeDensity(value)}
                        disabled={isLoading}
                    />
                </GridColumn>
            </GridColumnsContainer>

            <Typography variant="h5">スペーシング</Typography>
            <GridColumnsContainer>
                <GridTitleColumn xs={1}>マージン</GridTitleColumn>
                <GridColumn xs={5}>
                    <Slider
                        value={elementSpace}
                        min={1}
                        max={3}
                        step={1}
                        marks={[
                            {value: 1, label: '小'},
                            {value: 2, label: '中'},
                            {value: 3, label: '大'},
                        ]}
                        onChange={(event, value) => handleChangeSpacing(value)}
                        disabled={isLoading}
                    />
                </GridColumn>
            </GridColumnsContainer>

            <Typography variant="h5">フォント</Typography>
            <GridColumnsContainer>
                <GridTitleColumn xs={1}>サイズ</GridTitleColumn>
                <GridColumn xs={5}>
                    <Slider
                        value={fontSize}
                        min={1}
                        max={3}
                        step={1}
                        marks={[
                            {value: 1, label: '小'},
                            {value: 2, label: '中'},
                            {value: 3, label: '大'},
                        ]}
                        onChange={(event, value) => handleChangeFontSize(value)}
                        disabled={isLoading}
                    />
                </GridColumn>
            </GridColumnsContainer>
            <GridColumnsContainer>
                <GridTitleColumn xs={1}>濃度</GridTitleColumn>
                <GridColumn xs={5}>
                    <Slider
                        min={1}
                        max={3}
                        step={1}
                        marks={[
                            {value: 1, label: '薄'},
                            {value: 2, label: '中'},
                            {value: 3, label: '濃'},
                        ]}
                        onChange={(event, value) => handleChangeFontColor(value)}
                        disabled={true}
                    />
                </GridColumn>
            </GridColumnsContainer>
        </>
    );
};
