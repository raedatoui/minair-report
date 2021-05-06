import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Button from '@material-ui/core/Button';
import PauseIcon from '@material-ui/icons/Pause';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import { StyledComponent, Song } from '../../types';
import { styles } from '../../styles';

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

export default withStyles(styles)(Songs);
