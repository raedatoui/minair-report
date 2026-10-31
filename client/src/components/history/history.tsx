/* eslint-disable react/no-array-index-key -- Immutable exports preserve duplicate source rows as separate occurrences. */
import React, { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import { alpha } from '@mui/material/styles';
import { historyDataPath } from '../../constants';
import { aqiAlpha, historyAqiColors, solidAqiColors } from '../../styles';
import { StyledComponent } from '../../types';
import { HistoryGraph } from '../trends/graph';
import { ArchivePage, HistoryReport, Month, Reading } from './types';
import SpikeTable from './spikes';
import CannabisIcon from './cannabis-icon';

const format = (value: number | null | undefined, digits = 1) => (
    value == null ? '—' : value.toLocaleString('en-US', { maximumFractionDigits: digits })
);

const monthLabel = (month: string) => new Date(`${month}-15T12:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC', month: 'short', year: 'numeric'
});

const metricValue = (month: Month, metric: string, suffix: string): number | null => {
    const value = month[`${metric}_${suffix}`];
    return typeof value === 'number' ? value : null;
};

const calendarMonths = (months: Month[]): Month[] => {
    if (!months.length)
        return [];
    const byMonth = new Map(months.map(month => [month.month, month]));
    const result: Month[] = [];
    const date = new Date(`${months[0].month}-01T12:00:00Z`);
    const last = months[months.length - 1].month;
    while (date.toISOString().slice(0, 7) <= last) {
        const month = date.toISOString().slice(0, 7);
        result.push(byMonth.get(month) ?? { month, readings: 0, days_observed: 0, spike_readings: 0, matches_420: 0 });
        date.setUTCMonth(date.getUTCMonth() + 1);
    }
    return result;
};

const fetchHistory = async <T,>(file: string, signal: AbortSignal): Promise<T> => {
    const response = await fetch(`${historyDataPath}/${file}`, { signal, cache: 'no-cache' });
    if (!response.ok)
        throw new Error('Historical data is unavailable.');
    return response.json();
};

const History: FC<StyledComponent> = ({ classes }) => {
    const [report, setReport] = useState<HistoryReport | null>(null);
    const [error, setError] = useState(false);
    const [metric, setMetric] = useState('aqi_2_5');
    const [year, setYear] = useState('all');
    const [showArchive, setShowArchive] = useState(false);
    const [archivePage, setArchivePage] = useState(1);
    const [archive, setArchive] = useState<ArchivePage | null>(null);
    const [archiveError, setArchiveError] = useState(false);
    const [celebration, setCelebration] = useState<{ message: string; key: number } | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        fetchHistory<HistoryReport>('summary.json', controller.signal)
            .then(data => {
                if (!controller.signal.aborted)
                    setReport(data);
            })
            .catch(() => {
                if (!controller.signal.aborted)
                    setError(true);
            });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!showArchive)
            return undefined;
        const controller = new AbortController();
        setArchive(null);
        setArchiveError(false);
        fetchHistory<ArchivePage>(`420/page-${archivePage}.json`, controller.signal)
            .then(data => {
                if (!controller.signal.aborted)
                    setArchive(data);
            })
            .catch(() => {
                if (!controller.signal.aborted)
                    setArchiveError(true);
            });
        return () => controller.abort();
    }, [showArchive, archivePage]);

    if (!report)
        return (
            <div className={classes.historyPage}>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    {error ? (
                        <>
                            <Typography>The historical report is not available yet. Try again after it has been refreshed.</Typography>
                            <Button color="inherit" onClick={() => window.location.reload()}>Try again</Button>
                        </>
                    ) : <CircularProgress aria-label="Loading historical report" />}
                </Box>
            </div>
        );

    const { totals, quality } = report;
    const months = calendarMonths(report.monthly);
    const selected = report.metrics.find(item => item.metric === metric) || report.metrics[0];
    const visibleMonths = months.filter(month => year === 'all' || month.month.startsWith(year));
    const years = Array.from(new Set(months.map(month => month.month.slice(0, 4))));
    const colors = solidAqiColors;
    const category = (value: number) => (
        [50, 100, 150, 200, 300, Infinity].findIndex(limit => value <= limit)
    );
    const aqiColor = (value: number | null) => (value == null ? undefined : colors[category(value)]);
    const categoryNames = ['Good', 'Moderate', 'Unhealthy for sensitive groups', 'Unhealthy', 'Very unhealthy', 'Hazardous'];
    const dateFormat = new Intl.DateTimeFormat('en-US', {
        timeZone: report.timezone,
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });
    const readingDate = (reading: Reading) => (reading.recorded_at && reading.timestamp != null
        ? dateFormat.format(new Date(reading.timestamp * 1000)) : 'Invalid / missing timestamp');
    const download = (file: string, label: string) => (
        <Button component="a" href={`${historyDataPath}/${file}`} download color="inherit">{label}</Button>
    );
    const statCards = [
        {
            label: 'Average PM2.5 AQI',
            value: totals.aqi_2_5_mean,
            note: 'All recorded samples',
            color: aqiColor(totals.aqi_2_5_mean)
        },
        {
            label: 'Highest PM2.5 AQI',
            value: totals.aqi_2_5_max,
            note: 'Single reading',
            color: colors[3]
        },
        { label: 'Typical PM2.5 AQI', value: totals.aqi_2_5_median, note: 'Approximate median', color: undefined },
        {
            label: 'Spike readings',
            value: totals.spike_readings,
            note: `PM2.5 AQI > ${format(report.spike_threshold)}`,
            color: undefined
        }
    ];

    return (
        <div className={classes.historyPage}>
            <Box sx={{ px: 3, pt: 3, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    className={`${classes.songRowCellButton} historyTitle`}
                >
                    MINAIR, ALL TIME HIGHS
                </Typography>
                <Typography variant="h6" component="p">
                    {months.length > 0 && `${monthLabel(months[0].month)} – ${monthLabel(months[months.length - 1].month)}`}
                </Typography>
                <Typography>{format(totals.readings, 0)} readings across {format(totals.days_observed, 0)} observed days.</Typography>
            </Box>
            <Grid container spacing={0} className={classes.currentContainer}>
                {statCards.map(stat => (
                    <Grid size={{ xs: 6, md: 3 }} className={classes.card} key={stat.label}>
                        <Card
                            variant="outlined"
                            className={`${classes.cardBubble} ${classes.historyCard}`}
                            style={{ background: stat.color ? alpha(stat.color, aqiAlpha) : undefined, color: stat.color === colors[4] || stat.color === colors[5] ? '#fff' : '#1b1b1b' }}
                        >
                            <CardContent className={classes.historyStatContent}>
                                <Typography variant="h6" component="h2">{stat.label}</Typography>
                                <Typography variant="h2" component="p" className={classes.bold}>{format(stat.value)}</Typography>
                                <Typography variant="body2">{stat.note}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid size={{ xs: 12 }} className={classes.card}>
                    <Card variant="outlined" className={`${classes.cardBubble} ${classes.historyCard}`}>
                        <CardContent className={classes.historyContent}>
                            <Typography variant="h4" component="h2" gutterBottom>Month by month</Typography>
                            <Box className={classes.historyControls}>
                                <FormControl variant="filled" className={`${classes.formControl} ${classes.historySelect}`}>
                                    <InputLabel id="history-metric-label" className={classes.chartSelector}>Measurement</InputLabel>
                                    <Select
                                        labelId="history-metric-label"
                                        value={metric}
                                        className={classes.chartSelector}
                                        onChange={({ target: { value } }) => setMetric(value as string)}
                                    >
                                        {report.metrics.map(item => (
                                            <MenuItem key={item.metric} value={item.metric}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="filled" className={`${classes.formControl} ${classes.historySelect}`}>
                                    <InputLabel id="history-year-label" className={classes.chartSelector}>Year</InputLabel>
                                    <Select
                                        labelId="history-year-label"
                                        value={year}
                                        className={classes.chartSelector}
                                        onChange={({ target: { value } }) => setYear(value as string)}
                                    >
                                        <MenuItem value="all">All years</MenuItem>
                                        {years.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                {download('monthly.csv', 'Download monthly statistics')}
                            </Box>
                            <Box className={classes.historyChart}>
                                <HistoryGraph
                                    useWhite={false}
                                    months={visibleMonths.map(month => monthLabel(month.month))}
                                    averages={visibleMonths.map(month => metricValue(month, metric, 'mean'))}
                                    peaks={visibleMonths.map(month => metricValue(month, metric, 'max'))}
                                    unit={selected.unit}
                                    isAqi={metric.startsWith('aqi_')}
                                />
                            </Box>
                            <Typography variant="body2">
                                Sample-weighted averages. Gaps are missing months; observed days do not imply full-day coverage.
                            </Typography>
                            <Box sx={{ mt: 2 }} component="details">
                                <Typography component="summary">Monthly numbers · {selected.label} ({selected.unit})</Typography>
                                <Typography className={classes.historyTableHint}>Swipe to see all columns.</Typography>
                                <TableContainer className={classes.historyTableContainer} tabIndex={0} role="region" aria-label="Monthly statistics">
                                    <Table size="small" className={`${classes.historyTable} ${classes.historyWideTable}`} aria-label="Monthly statistics">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Month</TableCell>
                                                <TableCell align="right">Samples</TableCell>
                                                <TableCell align="right">Days observed</TableCell>
                                                <TableCell align="right">Average</TableCell>
                                                <TableCell align="right">Minimum</TableCell>
                                                <TableCell align="right">Peak</TableCell>
                                                <TableCell align="right">PM2.5 spikes</TableCell>
                                                <TableCell align="right">420s</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>{visibleMonths.map(month => (
                                            <TableRow key={month.month}>
                                                <TableCell>{monthLabel(month.month)}</TableCell>
                                                <TableCell align="right">{format(metricValue(month, metric, 'count') ?? 0, 0)}</TableCell>
                                                <TableCell align="right">{month.days_observed}</TableCell>
                                                <TableCell align="right">{format(metricValue(month, metric, 'mean'))}</TableCell>
                                                <TableCell align="right">{format(metricValue(month, metric, 'min'))}</TableCell>
                                                <TableCell align="right">{format(metricValue(month, metric, 'max'))}</TableCell>
                                                <TableCell align="right">{format(month.spike_readings, 0)}</TableCell>
                                                <TableCell align="right">{format(month.matches_420, 0)}</TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }} className={classes.card}>
                    <Card variant="outlined" className={`${classes.cardBubble} ${classes.historyCard}`}>
                        <CardContent className={classes.historyContent}>
                            <Typography variant="h5" component="h2" gutterBottom>How the air stacked up</Typography>
                            <Typography variant="body2">Share of valid PM2.5 AQI samples, all years.</Typography>
                            <TableContainer className={classes.historyTableContainer}>
                                <Table size="small" className={`${classes.historyTable} ${classes.historyTwoColumnTable}`} aria-label="AQI category shares">
                                    <TableBody>{categoryNames.map((name, index) => {
                                        const count = report.categories.find(item => item.band === index)?.readings ?? 0;
                                        return (
                                            <TableRow key={name} style={{ backgroundColor: historyAqiColors[index], color: index >= 4 ? '#fff' : '#1b1b1b' }}>
                                                <TableCell>{name}</TableCell>
                                                <TableCell align="right">
                                                    {totals.aqi_2_5_count ? `${format((count / totals.aqi_2_5_count) * 100)}%` : '—'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">Approximate 95th percentile: {format(totals.aqi_2_5_p95)} AQI.</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }} className={classes.card}>
                    <Card variant="outlined" className={`${classes.cardBubble} ${classes.historyCard}`}>
                        <CardContent className={classes.historyContent}>
                            <Typography variant="h5" component="h2" gutterBottom>All-time averages</Typography>
                            <Typography className={classes.historyTableHint}>Swipe to see all columns.</Typography>
                            <TableContainer className={classes.historyTableContainer} tabIndex={0} role="region" aria-label="All-time measurement statistics">
                                <Table size="small" className={`${classes.historyTable} ${classes.historyWideTable}`} aria-label="All-time measurement statistics">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Measurement</TableCell>
                                            <TableCell align="right">Average</TableCell>
                                            <TableCell align="right">Minimum</TableCell>
                                            <TableCell align="right">Maximum</TableCell>
                                            <TableCell align="right">Valid samples</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>{report.metrics.map(item => (
                                        <TableRow key={item.metric}>
                                            <TableCell>{item.label} ({item.unit})</TableCell>
                                            <TableCell align="right">{format(item.mean)}</TableCell>
                                            <TableCell align="right">{format(item.min)}</TableCell>
                                            <TableCell align="right">{format(item.max)}</TableCell>
                                            <TableCell align="right">{format(item.count, 0)}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }} className={classes.card}>
                    <Card variant="outlined" className={`${classes.cardBubble} ${classes.historyCard}`}>
                        <CardContent className={classes.historyContent}>
                            <Typography variant="h3" component="h2" className={classes.bold} sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>The greatest hits</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography>
                                    {format(totals.spike_readings, 0)} readings above {format(report.spike_threshold)} PM2.5 AQI.
                                    {' '}Grouped by AQI band, all years.
                                    {' '}Expand a band, then a value to see its readings.
                                </Typography>
                                {download('spikes.csv', 'Download every spike')}
                                <SpikeTable classes={classes} timezone={report.timezone} readingDate={readingDate} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }} className={classes.card}>
                    <Card variant="outlined" className={`${classes.cardBubble} ${classes.historyCard}`}>
                        <CardContent className={classes.historyContent}>
                            <Typography variant="h3" component="h2" className={classes.bold} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 1, sm: 1.5 }, fontSize: { xs: '2rem', sm: '3rem' } }}>
                                <span>The 420 club</span>
                                <CannabisIcon fontSize="inherit" sx={{ flexShrink: 0 }} />
                            </Typography>
                            <Typography variant="h6" component="p">
                                {format(quality.total_420, 0)} very specific moments in atmospheric history.
                            </Typography>
                            <Typography>Exactly 420 in either AQI column. A reading matching both appears once.</Typography>
                            <Box sx={{ my: 2 }} className={classes.historyActions}>
                                {quality.total_420 > 0 && (
                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: '#2e7d32', color: '#fff', '&:hover': { backgroundColor: '#1b5e20' } }}
                                        startIcon={<CannabisIcon sx={{ filter: 'brightness(0) invert(1)' }} />}
                                        onClick={() => setShowArchive(!showArchive)}
                                        aria-expanded={showArchive}
                                        aria-controls="history-420-archive"
                                    >
                                        {showArchive ? 'Close the club' : 'Enter the club'}
                                    </Button>
                                )}
                                {download('420.csv', 'Download every 420')}
                            </Box>
                            {showArchive && (
                                <div id="history-420-archive">
                                    {archiveError && (
                                        <Typography role="alert">
                                            The archive could not be loaded. Close and reopen the club to try again.
                                        </Typography>
                                    )}
                                    {!archive && !archiveError && <CircularProgress aria-label="Loading 420 archive" />}
                                    {archive && (
                                        <TableContainer className={classes.historyTableContainer}>
                                            <Table size="small" className={`${classes.historyTable} ${classes.historyTwoColumnTable}`} aria-label="Every exact AQI 420 match">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Recorded at ({report.timezone})</TableCell>
                                                        <TableCell align="right">PM2.5 AQI</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>{archive.rows.map((reading, index) => (
                                                    <TableRow key={`${reading.id}-${index}`}>
                                                        <TableCell>{readingDate(reading)}</TableCell>
                                                        <TableCell align="right">
                                                            <Button
                                                                color="inherit"
                                                                variant="outlined"
                                                                endIcon={<CannabisIcon sx={{ color: '#2e7d32' }} />}
                                                                aria-label={`Celebrate reading ${reading.id ?? index + 1}`}
                                                                onClick={() => setCelebration({
                                                                    message: `420. A legendary puffair. ${readingDate(reading)}`,
                                                                    key: Date.now()
                                                                })}
                                                            >
                                                                {format(reading.aqi_2_5)}
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                    {Math.ceil(quality.total_420 / 100) > 1 && (
                                        <Box sx={{ mt: 2 }}>
                                            <Pagination
                                                page={archivePage}
                                                count={Math.ceil(quality.total_420 / 100)}
                                                onChange={(_, page) => setArchivePage(page)}
                                                color="primary"
                                                aria-label="420 archive pages"
                                            />
                                        </Box>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }} className={classes.card}>
                    <Card variant="outlined" className={`${classes.cardBubble} ${classes.historyCard}`}>
                        <CardContent className={classes.historyContent}>
                            <Typography variant="h5" component="h2" gutterBottom>About these numbers</Typography>
                            <Typography>
                                {format(quality.source_rows, 0)} source rows; {format(quality.invalid_timestamps, 0)} invalid timestamps
                                excluded from dated analysis. {format(quality.undated_420, 0)} undated 420 matches kept in the archive.
                            </Typography>
                            <Box sx={{ mt: 2 }} component="details">
                                <Typography component="summary">Method and data completeness</Typography>
                                <Box sx={{ my: 2 }}>
                                    <Typography>
                                        Source: {report.source}. Dates and month boundaries use {report.timezone}, including daylight saving time.
                                        Every row has equal weight; averages are not time-weighted. Duplicates are retained.
                                        Sensor downtime and uneven sampling can affect comparisons.
                                    </Typography>
                                </Box>
                                <Box sx={{ my: 2 }}>
                                    <Typography>
                                        Missing and invalid values are excluded per measurement, including negative AQI.
                                        Other finite values are retained.
                                        AQI is summarized as recorded, not recalculated. Median and p95 are approximate.
                                        Spike readings are individual samples, not separate pollution episodes.
                                    </Typography>
                                </Box>
                                <TableContainer className={classes.historyTableContainer}>
                                    <Table size="small" className={`${classes.historyTable} ${classes.historyTwoColumnTable}`} aria-label="Missing and invalid measurements">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Measurement</TableCell>
                                                <TableCell align="right">Missing / invalid in dated rows</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>{report.metrics.map(item => (
                                            <TableRow key={item.metric}>
                                                <TableCell>{item.label}</TableCell>
                                                <TableCell align="right">{format(totals.readings - item.count, 0)}</TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {download('summary.json', 'Download report data')}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Snackbar
                key={celebration?.key}
                open={celebration !== null}
                autoHideDuration={4200}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={() => setCelebration(null)}
            >
                <SnackbarContent
                    className={classes.historyToast}
                    message={(
                        <><CannabisIcon className={classes.historyLeaf} />{celebration?.message}</>
                    )}
                />
            </Snackbar>
        </div>
    );
};

export default History;
