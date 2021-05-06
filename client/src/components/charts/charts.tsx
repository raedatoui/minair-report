import React, { FC, useEffect, useState } from 'react';
import Highcharts, { Options, SeriesSplineOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import SvgIcon from '@material-ui/core/SvgIcon';
import { cloneDeep } from 'lodash';
import { styles, lightGreen, yellow, orange, red, burgundy, purple } from '../../styles';
import { DataFrame, ComponentProps, chartCategories, ChartData } from '../../types';
import { fetchData, timestampToDate } from '../../utils';

const offset = new Date().getTimezoneOffset() * 60000;

function formatter() {
    // @ts-ignore
    const ts = timestampToDate('%m/%d %I:%M %p', this.x);
    // @ts-ignore
    return `${ts}<br />● ${this.points[0].series.name}: ${this.y}`;
}

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

interface TimeFormatter {
    interval: number,
    formatter: ({ value }: { value: string }) => string
}

const timeFormatters: Record<string, TimeFormatter> = {
    '1 hr': {
        interval: 5,
        formatter: ({ value } : { value: string }): string => Highcharts.dateFormat('%I:%M %p', parseInt(value, 10) * 1000 - offset)
    },
    '2 hrs': {
        interval: 5,
        formatter: ({ value } : { value: string }): string => Highcharts.dateFormat('%I:%M %p', parseInt(value, 10) * 1000 - offset)
    },
    '4 hrs': {
        interval: 10,
        formatter: ({ value } : { value: string }): string => Highcharts.dateFormat('%I:%M %p', parseInt(value, 10) * 1000 - offset)
    },
    '24 hrs': {
        interval: 50,
        formatter: ({ value } : { value: string }): string => Highcharts.dateFormat('%I:%M %p', parseInt(value, 10) * 1000 - offset)
    },
    '3 days': {
        interval: 500,
        formatter: ({ value } : { value: string }): string => Highcharts.dateFormat('%m/%d', parseInt(value, 10) * 1000 - offset)
    },
    '1 week': {
        interval: 750,
        formatter: ({ value } : { value: string }): string => Highcharts.dateFormat('%m/%d', parseInt(value, 10) * 1000 - offset)
    }
};

const options: Options = {
    title: {
        text: ''
    },
    rangeSelector: {
        enabled: false
    },
    navigator: {
        enabled: false
    },
    chart: {
        zoomType: 'x',
        backgroundColor: 'rgba(0,0,0,0)',
        type: 'spline',
        // height: `${(9 / 16) * 100}%`,
        style: {
            fontFamily: 'Roboto',
            fontWeight: '700'
        }
    },
    legend: {
        enabled: false
    },
    xAxis: {
        tickInterval: timeFormatters['1 hr'].interval,
        labels: {
            // @ts-ignore
            formatter: timeFormatters['1 hr'].formatter,
            rotation: -45
        }
    },
    yAxis: {
        minorGridLineWidth: 0,
        gridLineWidth: 0,
        alternateGridColor: 'none',
        title: {
            text: ''
        },
        plotBands: []
    },
    plotOptions: {
        spline: {
            lineWidth: 3,
            color: 'rgba(0,0,0,0.5)'
        }
    },
    tooltip: {
        shared: true,
        formatter
    }
};

const newIcon = () => (
    <SvgIcon focusable="true">
        <path d="M7 10l5 5 5-5z" fill="white" />
    </SvgIcon>
);

const aqiPlotBands = [
    {
        from: 0,
        to: 50,
        color: lightGreen,
        label: {
            text: '<span>Good</span>',
            useHtml: true
        }
    }, {
        from: 51,
        to: 100,
        color: yellow,
        label: {
            text: 'Moderate',
            useHtml: true,
            style: {
                backgroundColor: 'rgba(0,0,0,0.5)'
            }
        }
    }, {
        from: 101,
        to: 150,
        color: orange,
        label: {
            text: 'Unhealthy for Sensitive Groups',
            useHtml: true,
            style: {
                backgroundColor: 'rgba(0,0,0,0.5)'
            }
        }
    }, {
        from: 151,
        to: 200,
        color: red,
        label: {
            text: 'Unhealthy',
            useHtml: true,
            style: {
                backgroundColor: 'rgba(0,0,0,0.5)'
            }
        }
    }, {
        from: 201,
        to: 300,
        color: burgundy,
        label: {
            text: 'Very Unhealthy',
            useHtml: true,
            style: {
                backgroundColor: 'rgba(0,0,0,0.5)'
            }
        }
    }, {
        from: 301,
        to: 400,
        color: purple,
        label: {
            text: 'Hazardous',
            useHtml: true,
            style: {
                backgroundColor: 'rgba(0,0,0,0.5)'
            }
        }
    }, {
        from: 401,
        to: 500,
        color: purple,
        label: {
            text: 'Hazardous++',
            useHtml: true,
            style: {
                backgroundColor: 'rgba(0,0,0,0.5)'
            }
        }
    }
];

interface Props extends ComponentProps {
    currentDataFrame: DataFrame
}

const Charts:FC<Props> = ({ currentDataFrame, useWhite, serverUrl, classes }) => {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('param') || 'aqi25';

    const [series, setSeries] = useState<Record<keyof typeof chartCategories, SeriesSplineOptions>>({});
    const [xCats, setXCats] = useState<string[]>([]);
    const [metric, setMetric] = useState<keyof typeof chartCategories>(param);
    const [timeRange, setTimeRange] = useState<string>('1 hr');

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

    const plotBands = aqiPlotBands.map(p => ({
        ...p,
        label: {
            ...p.label,
            style: {
                ...p.label.style,
                color: useWhite ? '#fff' : '#000'
            }
        }
    }));

    const xAxisOptions = {
        ...options.xAxis,
        categories: xCats,
        tickInterval: timeFormatters[timeRange].interval,
        labels: {
            ...((options.xAxis as XAxisOptions).labels),
            formatter: timeFormatters[timeRange].formatter,
            style: {
                color: useWhite ? 'white' : 'black'
            }
        }
    } as XAxisOptions;

    const yAxisOptions = {
        ...options.yAxis,
        ...((metric === 'aqi25' || metric === 'aqi100') && {
            plotBands
        }),
        labels: {
            ...((options.yAxis as YAxisOptions).labels),
            style: {
                color: useWhite ? 'white' : 'black'
            }
        }
    } as YAxisOptions;

    return (
        <div className={classes.chartsContainer}>
            <FormControl variant="filled" className={classes.formControl}>
                <InputLabel className={classes.chartSelector}>Chart</InputLabel>
                <Select
                    value={metric}
                    className={classes.chartSelector}
                    IconComponent={newIcon}
                    onChange={({ target: { value } }) => setMetric(value as keyof typeof chartCategories)}
                >
                    {Object.entries(chartCategories).map(([k, v]) => (
                        <MenuItem key={k} value={k}>{v}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="filled" className={classes.formControl}>
                <InputLabel className={classes.chartSelector}>Time range</InputLabel>
                <Select
                    value={timeRange}
                    className={classes.chartSelector}
                    IconComponent={newIcon}
                    onChange={({ target: { value } }) => setTimeRange(value as string)}
                >
                    {timeLabels.map(t => (
                        <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    ...options,
                    xAxis: xAxisOptions,
                    yAxis: yAxisOptions,
                    series: cloneDeep(series?.[metric])
                }}
            />
        </div>
    );
};

export default withStyles(styles)(Charts);
