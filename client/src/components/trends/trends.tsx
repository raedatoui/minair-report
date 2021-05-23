import React, { FC, useEffect, useState } from 'react';
import { SeriesSplineOptions } from 'highcharts';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import { DataFrame, ComponentProps, chartCategories, ChartData } from '../../types';
import { fetchData } from '../../utils';
import { DatePicker } from './date-picker';
import { Graph } from './graph';

const timeLabels = [
    '1 hr',
    '2 hrs',
    '4 hrs',
    '24 hrs',
    '3 days',
    '1 week'
];

const timeValues = [
    30,
    60,
    120,
    720,
    2160,
    5040
];

interface Props extends ComponentProps {
    currentDataFrame: DataFrame
}

const Charts:FC<Props> = ({ currentDataFrame, useWhite, serverUrl, classes }) => {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('param') || 'aqi25';

    const [metric, setMetric] = useState<keyof typeof chartCategories>(param);
    const [timeRange, setTimeRange] = useState<string>('1 hr');
    const [series, setSeries] = useState<Record<keyof typeof chartCategories, SeriesSplineOptions>>({});
    const [xCats, setXCats] = useState<string[]>([]);

    useEffect(() => {
        setXCats(olderXCats => ([
            ...olderXCats,
            currentDataFrame.timestamp.toString()
        ]));

        setSeries(oldSeries => (
            Object.keys(chartCategories).reduce((acc, k) => ({
                ...acc,
                [k]: {
                    ...oldSeries[k],
                    data: [
                        ...oldSeries[k]?.data || [],
                        currentDataFrame?.[k as keyof DataFrame]
                    ]
                }
            }), {})
        ));

    }, [currentDataFrame]);

    useEffect(() => {
        const getSensorData = async () => {
            const tr = timeValues[timeLabels.indexOf(timeRange)];
            const chartData = await fetchData<ChartData>(`${serverUrl}/api/trends?count=${tr}`);
            const df = chartData.items;
            setSeries(Object.keys(chartCategories).reduce((acc, k) => ({
                ...acc,
                [k]: {
                    name: chartCategories[k],
                    // @ts-ignore
                    data: df.map(d => d[k])
                }
            }), {}));
            setXCats(df.map(d => d.timestamp.toString()));
        };
        getSensorData();
    }, [serverUrl, timeRange]);

    return (
        <div className={classes.chartsContainer}>
            <Box>
                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.chartSelector}>Chart</InputLabel>
                    <Select
                        value={metric}
                        className={classes.chartSelector}
                        onChange={({ target: { value } }) => setMetric(value as keyof typeof chartCategories)}
                    >
                        {Object.entries(chartCategories).map(([k, v]) => (
                            <MenuItem key={k} value={k}>{v}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="filled" className={classes.formControl}>
                    <DatePicker classes={classes} useWhite={useWhite} />
                </FormControl>
                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.chartSelector}>Time range</InputLabel>
                    <Select
                        value={timeRange}
                        className={classes.chartSelector}
                        onChange={({ target: { value } }) => setTimeRange(value as string)}
                    >
                        {timeLabels.map(t => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Graph useWhite={useWhite} xCats={xCats} timeRange={timeRange} series={series} metric={metric} />
        </div>
    );
};

export default Charts;
