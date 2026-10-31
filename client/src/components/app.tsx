'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { CurrentDataFrame, TrendsFrame, TrendsItem, Song } from '../types';
import { classes, StyleClasses } from '../styles';
import { audio as audioPath, CDN, logo, apiRoutes } from '../constants';
import { fetchData, makeAudio } from '../utils';
import Menu from './menu';
import ScrollToTop from './scrollToTop';
import Footer from './footer';
import Glitch from './glitch';

interface ReportState {
    dataFrame?: CurrentDataFrame;
    trendsFrame?: TrendsFrame;
    songs: Song[];
    useWhite: boolean;
    classes: StyleClasses;
    audio: HTMLAudioElement | null;
    isPlaying: boolean;
    currentIndex: number;
    play: (index: number) => void;
    playUnderage: () => void;
    setShowHeader: (show: boolean) => void;
    videoPass: boolean;
    setVideoPass: (pass: boolean) => void;
}

const ReportContext = createContext<ReportState | null>(null);

export const useMinair = () => {
    const value = useContext(ReportContext);
    if (!value) throw new Error('Minair pages must be rendered inside AppShell.');
    return value;
};

const backgrounds = ['lightGreen', 'yellow', 'orange', 'red', 'burgundy', 'burgundy', 'burgundy', 'burgundy'];

export default function AppShell({ children }: { children: ReactNode }) {
    const [dataFrame, setDataFrame] = useState<CurrentDataFrame>();
    const [trendsFrame, setTrendsFrame] = useState<TrendsFrame>();
    const [songs, setSongs] = useState<Song[]>([]);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [showHeader, setShowHeader] = useState(true);
    const [videoPass, setVideoPass] = useState(true);
    const useWhite = (dataFrame?.aqiIdx25 ?? -1) > 0;

    useEffect(() => {
        const player = makeAudio(() => {});
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        player.addEventListener('play', onPlay);
        player.addEventListener('pause', onPause);
        setAudio(player);
        return () => {
            player.removeEventListener('play', onPlay);
            player.removeEventListener('pause', onPause);
            player.pause();
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const refresh = async () => {
            try {
                const [current, day, week] = await Promise.all([
                    fetchData<CurrentDataFrame>(apiRoutes.current, controller.signal),
                    fetchData<TrendsItem>(apiRoutes.dayTrends, controller.signal),
                    fetchData<TrendsItem>(apiRoutes.weekTrends, controller.signal)
                ]);
                if (!controller.signal.aborted) {
                    setDataFrame(previous => previous?.timestamp === current.timestamp ? previous : current);
                    setTrendsFrame({ day, week });
                }
            } catch (error) {
                if (!controller.signal.aborted) console.error('Could not refresh Minair readings.', error);
            }
        };
        fetchData<Song[]>(apiRoutes.songs, controller.signal).then(items => {
            if (!controller.signal.aborted)
                setSongs(items.map(song => ({ ...song, filename: `${CDN}${audioPath}${song.filename}` })));
        }).catch(error => {
            if (!controller.signal.aborted) console.error('Could not load songs.', error);
        });
        void refresh();
        const interval = window.setInterval(refresh, 30000);
        return () => { controller.abort(); window.clearInterval(interval); };
    }, []);

    useEffect(() => {
        document.body.classList.toggle('glitch', !showHeader);
        return () => document.body.classList.remove('glitch');
    }, [showHeader]);

    const play = (index: number) => {
        if (!audio || !songs[index]) return;
        setCurrentIndex(index);
        audio.src = songs[index].filename;
        audio.loop = false;
        void audio.play().catch(console.error);
    };
    const playUnderage = () => {
        if (!audio) return;
        audio.src = `${CDN}/audio/underage.wav`;
        audio.loop = true;
        void audio.play().catch(console.error);
    };

    return (
        <ReportContext.Provider value={{
            dataFrame, trendsFrame, songs, useWhite, classes, audio, isPlaying, currentIndex,
            play, playUnderage, setShowHeader, videoPass, setVideoPass
        }}>
            <div id="root" className={showHeader ? backgrounds[dataFrame?.aqiIdx25 ?? 0] : 'glitch'}>
                <canvas id="canvas-webgl" className={classes.canvasWebgl} />
                {showHeader ? (
                    <>
                        <div className="app">
                            <AppBar className={classes.appHeader} position="relative">
                                <Toolbar className={classes.toolBar}>
                                    <img src={`${CDN}${logo}logo-text.png`} alt="logo" className={classes.logo} />
                                    <img src={`${CDN}${logo}logo-heart.gif`} alt="logo" className={classes.logo2} />
                                </Toolbar>
                            </AppBar>
                            <Menu useWhite={useWhite} play={play} classes={classes} currentIndex={currentIndex} songs={songs} />
                            {children}
                            <ScrollToTop useWhite={useWhite} classes={classes} />
                        </div>
                        <Footer useWhite={useWhite} classes={classes} />
                    </>
                ) : <Glitch />}
            </div>
        </ReportContext.Provider>
    );
}
