import React, { FC } from 'react';
import Highcharts, { Options, SeriesSplineOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { cloneDeep } from 'lodash';
import { lightGreen, yellow, orange, red, burgundy, purple } from '../../styles';
import { chartCategories } from '../../types';
import { timestampToDate } from '../../utils';

const offset = new Date().getTimezoneOffset() * 60000;

function formatter() {
    // @ts-ignore
    const ts = timestampToDate('%m/%d %I:%M %p', this.x);
    // @ts-ignore
    return `${ts}<br />● ${this.points[0].series.name}: ${this.y}`;
}

type TimeFormatter = {
    interval: number,
    formatter: ({ value }: { value: string }) => string
};

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

interface Props {
    useWhite: boolean;
    timeRange: string;
    series: Record<keyof typeof chartCategories, SeriesSplineOptions>;
    metric: keyof typeof chartCategories;
    xCats: string[];
}

export const Graph: FC<Props> = ({ useWhite, metric, timeRange, series, xCats }) => {

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
        <HighchartsReact
            highcharts={Highcharts}
            options={{
                ...options,
                xAxis: xAxisOptions,
                yAxis: yAxisOptions,
                series: cloneDeep(series?.[metric])
            }}
        />
    );
};
