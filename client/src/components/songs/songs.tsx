import React, { FC, useState } from 'react';
import clsx from 'clsx';
import useMediaQuery from '@mui/material/useMediaQuery';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Button from '@mui/material/Button';
import PauseIcon from '@mui/icons-material/Pause';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import { StyledComponent, Song } from '../../types';

interface SongRowProps extends StyledComponent {
    song: Song,
    play: () => void,
    isPlaying: boolean,
    index: number
}

const SongRow:FC<SongRowProps> = ({ song, play, isPlaying, useWhite, classes }) => {
    const [hovered, setHovered] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const whiteBox = useWhite ? classes.whiteBox : '';
    const matches = useMediaQuery('(max-width:520px)');

    return (
        <>
            <TableRow
                className={`${classes.songRow} ${classes.titleRow}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <TableCell
                    className={classes.songRowCell}
                    onClick={() => play()}
                    component="th"
                    style={{ width: 30 }}
                >
                    <Button
                        className={clsx(`${classes.songRowCellButton} ${classes.songRowCellButtonNum}`, { small: matches })}
                    >
                        <div className={clsx(classes.songRowNum, { play: isPlaying || hovered })}>
                            { isPlaying && <PauseIcon /> }
                            { !hovered && !isPlaying && <span>{song.trackNumber}</span>}
                            { hovered && !isPlaying && <PlayArrowIcon />}
                        </div>
                    </Button>
                </TableCell>
                <TableCell
                    component="th"
                    className={classes.songRowCell}
                >
                    <Typography component="div" className={clsx(classes.songRowCellButton, { small: matches })}>{song.title}</Typography>
                </TableCell>
                <TableCell
                    component="th"
                    className={classes.songRowCell}
                    onClick={() => setOpen(!open)}
                    align="right"
                >
                    <Typography component="div" aria-label="expand row" className={clsx(classes.songRowCellButton, { small: matches })}>
                        Lyrics
                    </Typography>
                </TableCell>
            </TableRow>
            <TableRow className={classes.songRow}>
                <TableCell colSpan={3} className={classes.songLyricsCell}>
                    <Collapse in={open} timeout="auto" unmountOnExit className={classes.songLyricsContainer}>
                        <Paper
                            elevation={2}
                            className={`${classes.songLyrics} ${whiteBox}`}
                        >
                            <div dangerouslySetInnerHTML={{ __html: song.lyrics }} />
                        </Paper>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

interface SongsProps extends StyledComponent {
    songs: Song[],
    isPlaying: boolean,
    currentIndex: number,
    play: (idx: number) => void
    audio: HTMLAudioElement
}

const Songs:FC<SongsProps> = ({ songs, play, isPlaying, audio, currentIndex, useWhite, classes }) => (
    <TableContainer component={Box} className={classes.songsContainer}>
        <Table className={classes.songsTable} aria-label="simple table">
            <TableBody className={classes.songsTableBody}>
                {songs.map((song, idx) => (
                    <SongRow
                        useWhite={useWhite}
                        song={song}
                        classes={classes}
                        key={song.title}
                        index={idx}
                        isPlaying={isPlaying && currentIndex === idx}
                        play={() => (isPlaying && idx === currentIndex ? audio.pause() : play(idx))}
                    />

                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default Songs;
