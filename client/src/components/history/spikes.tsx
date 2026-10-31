/* eslint-disable react/no-array-index-key -- Immutable exports preserve duplicate source rows as separate occurrences. */
import React, { FC, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import Pagination from '@material-ui/lab/Pagination';
import { historyDataPath } from '../../constants';
import { StyledComponent } from '../../types';
import { opaqueAqiPlotBands as aqiPlotBands } from '../trends/graph';
import { Reading, SpikeGroup, SpikePage } from './types';

interface Props extends Pick<StyledComponent, 'classes'> {
    timezone: string;
    readingDate: (reading: Reading) => string;
}

const number = (value: number | null) => (
    value == null ? '—' : value.toLocaleString('en-US', { maximumFractionDigits: 20 })
);

const loadSpikes = async <T,>(path: string, signal: AbortSignal): Promise<T> => {
    const response = await fetch(`${historyDataPath}/${path}`, { signal, cache: 'no-cache' });
    if (!response.ok)
        throw new Error('Spike data is unavailable.');
    return response.json();
};

const SpikeGroupRow: FC<Props & { group: SpikeGroup }> = ({ group, classes, timezone, readingDate }) => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [data, setData] = useState<SpikePage | null>(null);
    const [error, setError] = useState(false);
    const [retry, setRetry] = useState(0);
    const detailsId = `history-spike-${group.aqi}`;

    useEffect(() => {
        if (!open)
            return undefined;
        const controller = new AbortController();
        setData(null);
        setError(false);
        loadSpikes<SpikePage>(`${group.path}/page-${page}.json`, controller.signal)
            .then(result => {
                if (!controller.signal.aborted)
                    setData(result);
            })
            .catch(() => {
                if (!controller.signal.aborted)
                    setError(true);
            });
        return () => controller.abort();
    }, [open, page, group.path, retry]);

    return (
        <>
            <TableRow hover className={classes.historySpikeRow} onClick={() => setOpen(previous => !previous)}>
                <TableCell component="th" scope="row">
                    <Button
                        color="inherit"
                        startIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        aria-expanded={open}
                        aria-controls={detailsId}
                        aria-label={`${open ? 'Hide' : 'Show'} readings for PM2.5 AQI ${number(group.aqi)}`}
                    >
                        {number(group.aqi)}
                    </Button>
                </TableCell>
                <TableCell align="right">{number(group.count)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={2} style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box id={detailsId} my={2}>
                            {error && (
                                <Box role="alert">
                                    <Typography>These readings could not be loaded.</Typography>
                                    <Button color="inherit" onClick={() => setRetry(previous => previous + 1)}>Try again</Button>
                                </Box>
                            )}
                            {!data && !error && <CircularProgress size={24} aria-label={`Loading readings for AQI ${group.aqi}`} />}
                            {data && (
                                <TableContainer>
                                    <Table size="small" className={classes.historyTable} aria-label={`Raw readings for PM2.5 AQI ${group.aqi}`}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Recorded at ({timezone})</TableCell>
                                                <TableCell>ID</TableCell>
                                                <TableCell align="right">PM2.5 AQI</TableCell>
                                                <TableCell align="right">PM10 AQI</TableCell>
                                                <TableCell align="right">PM2.5 µg/m³</TableCell>
                                                <TableCell align="right">PM10 µg/m³</TableCell>
                                                <TableCell align="right">Temperature °F</TableCell>
                                                <TableCell align="right">Humidity %</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.rows.map((reading, index) => (
                                                <TableRow key={`${reading.id}-${index}`}>
                                                    <TableCell>{readingDate(reading)}</TableCell>
                                                    <TableCell>{reading.id ?? '—'}</TableCell>
                                                    <TableCell align="right">{number(reading.aqi_2_5)}</TableCell>
                                                    <TableCell align="right">{number(reading.aqi_10_0)}</TableCell>
                                                    <TableCell align="right">{number(reading.pm_2_5)}</TableCell>
                                                    <TableCell align="right">{number(reading.pm_10_0)}</TableCell>
                                                    <TableCell align="right">{number(reading.temperature)}</TableCell>
                                                    <TableCell align="right">{number(reading.humidity)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                            {group.count > 100 && (
                                <Box mt={2}>
                                    <Pagination
                                        page={page}
                                        count={Math.ceil(group.count / 100)}
                                        onChange={(_, value) => setPage(value)}
                                        color="primary"
                                        aria-label={`Pages of readings for PM2.5 AQI ${group.aqi}`}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

interface BandProps extends Props {
    band: typeof aqiPlotBands[number];
    groups: SpikeGroup[];
}

const SpikeBandRow: FC<BandProps> = ({ band, groups, ...props }) => {
    const [open, setOpen] = useState(false);
    const detailsId = `history-spike-band-${band.from}`;
    const count = groups.reduce((total, group) => total + group.count, 0);
    const range = band === aqiPlotBands[aqiPlotBands.length - 1]
        ? `${number(band.from)}+` : `${number(band.from)}–${number(band.to)}`;

    return (
        <>
            <TableRow
                hover
                className={props.classes.historySpikeRow}
                style={{ backgroundColor: band.color, color: band.label.style.color }}
                onClick={() => setOpen(previous => !previous)}
            >
                <TableCell component="th" scope="row">
                    <Button
                        color="inherit"
                        startIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        aria-expanded={open}
                        aria-controls={detailsId}
                        aria-label={`${open ? 'Hide' : 'Show'} ${band.label.text} AQI values`}
                    >
                        {band.label.text} ({range})
                    </Button>
                </TableCell>
                <TableCell align="right">{number(count)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={2} style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box id={detailsId} my={2}>
                            <Table size="small" className={props.classes.historyTable} aria-label={`${band.label.text} spike values`}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>PM2.5 AQI</TableCell>
                                        <TableCell align="right"># occurrences</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {groups.map(group => <SpikeGroupRow key={group.aqi} group={group} {...props} />)}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const SpikeTable: FC<Props> = props => {
    const [groups, setGroups] = useState<SpikeGroup[] | null>(null);
    const [error, setError] = useState(false);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setError(false);
        loadSpikes<SpikeGroup[]>('spikes/index.json', controller.signal)
            .then(result => {
                if (!controller.signal.aborted)
                    setGroups(result);
            })
            .catch(() => {
                if (!controller.signal.aborted)
                    setError(true);
            });
        return () => controller.abort();
    }, [retry]);

    if (error)
        return (
            <Box role="alert">
                <Typography>Spike counts could not be loaded.</Typography>
                <Button color="inherit" onClick={() => setRetry(previous => previous + 1)}>Try again</Button>
            </Box>
        );
    if (!groups)
        return <CircularProgress size={24} aria-label="Loading spike counts" />;
    if (!groups.length)
        return <Typography>No readings exceeded this threshold.</Typography>;

    const bands = aqiPlotBands.map((band, index) => {
        const lower = index === 0 ? -Infinity : aqiPlotBands[index - 1].to;
        const upper = index === aqiPlotBands.length - 1 ? Infinity : band.to;
        return { band, groups: groups.filter(group => group.aqi > lower && group.aqi <= upper) };
    }).filter(({ groups: bandGroups }) => bandGroups.length > 0).reverse();

    return (
        <TableContainer>
            <Table size="small" className={props.classes.historyTable} aria-label="Spike occurrences by AQI band">
                <TableHead>
                    <TableRow>
                        <TableCell>AQI band</TableCell>
                        <TableCell align="right"># occurrences</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bands.map(({ band, groups: bandGroups }) => (
                        <SpikeBandRow key={band.from} band={band} groups={bandGroups} {...props} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SpikeTable;
