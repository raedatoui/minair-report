import React, { FC, useEffect, useState } from 'react';
import { SeriesSplineOptions } from 'highcharts';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import { DataFrame, ComponentProps, chartCategories } from '../../types';
import { fetchData } from '../../utils';
import { Graph } from './graph';
import { apiRoutes } from '../../constants';

const timeLabels = [
    '1 hr',
    '6 hrs',
    '12 hrs',
    '24 hrs',
    '1 week'
];

const timeFiles = [
    'hour',
    'sixHours',
    'twelveHours',
    'day',
    'week'
];

interface Props extends ComponentProps {
    currentDataFrame: DataFrame
}

const Charts:FC<Props> = ({ currentDataFrame, useWhite, classes }) => {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('param') || 'aqi25';

    const [metric, setMetric] = useState<keyof typeof chartCategories>(param);
    const [series, setSeries] = useState<Record<keyof typeof chartCategories, SeriesSplineOptions>>({});
    const [xCats, setXCats] = useState<number[]>([]);

    const [timeRange, setTimeRange] = useState<string | null>('1 hr');

    useEffect(() => {
        setXCats(olderXCats => ([
            ...olderXCats,
            currentDataFrame.timestamp
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

    const getSensorData = async (path: string) => {
        const chartData = await fetchData<DataFrame[]>(path);
        setSeries(Object.keys(chartCategories).reduce((acc, k) => ({
            ...acc,
            [k]: {
                name: chartCategories[k],
                // @ts-ignore
                data: chartData.map(d => d[k])
            }
        }), {}));
        setXCats(chartData.map(d => d.timestamp));
    };

    useEffect(() => {
        if (timeRange) {
            const tf = timeFiles[timeLabels.indexOf(timeRange)];
            // @ts-ignore
            const path = apiRoutes[tf];
            getSensorData(path);
        }
    }, [timeRange]);

    return (
        <div className={classes.chartsContainer}>
            <Box>
                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.chartSelector}>Parameter</InputLabel>
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
                    <InputLabel className={classes.chartSelector}>Time range from now</InputLabel>
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
            <Graph useWhite={useWhite} xCats={xCats} timeRange={timeRange ?? '1 week'} series={series} metric={metric} />
        </div>
    );
};

export default Charts;
