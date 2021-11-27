import React, { FC, useEffect, useState } from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import { AppConfiguration, CurrentDataFrame, defaultDataFrame, Song, Video } from '../types';
import { styles } from '../styles';
import { audio as audioPath, CDN, logo, videos as videosPath } from '../constants';
import { useInterval, fetchData, AudioContext } from '../utils';
import ScrollToTop from './scrollToTop';
import Current from './current';
import Fans from './fans';
import Menu from './menu';
import Trends from './trends';
import Fiction from './fiction';
import Songs from './songs';
import Glitch from './glitch';
import Footer from './footer';
import Donate from './donate';
import VideoPage from './video';

interface Props extends WithStyles<typeof styles> {
    config: AppConfiguration;
}

const backgrounds = [
    'lightGreen',
    'yellow',
    'orange',
    'red',
    'burgundy',
    'burgundy',
    'burgundy',
    'burgundy'
];

const videoList: Record<string, Video> = [
    {
        title: 'Minair Seminair',
        video: 'minair-seminair.mp4',
        poster: 'light-poster.jpg',
        path: 'minair-seminair'
    },
    {
        title: 'Minair Seminair BTS',
        video: 'minair-seminair-bts.mp4',
        poster: 'light-poster.jpg',
        path: 'minair-seminair-bts'
    },
    {
        title: 'Sal Blows 4 Minair',
        video: 'sal-blows.mp4',
        poster: 'dark-poster.jpg',
        path: 'sal-blows-4-minair'
    },
    {
        title: 'Cock Club Initiation',
        video: 'cock-club-initiation.mp4',
        poster: 'cock-club-initiation.png',
        path: 'cock-club-initiation'
    },
    {
        title: 'Minair Erotica Readings',
        video: 'minair-erotica-readings.mp4',
        poster: 'dark-poster.jpg',
        path: 'erotica-readings'
    }
].reduce((acc, v) => ({
    ...acc,
    [v.path]: {
        ...v,
        video: `${CDN}${videosPath}${v.video}`,
        poster: `${CDN}${videosPath}${v.poster}`
    }
}), {});

const App: FC<Props> = ({ config, classes }) => {
    const audio = React.useContext(AudioContext);

    const [dataFrame, setDataFrame] = useState<CurrentDataFrame>();
    const [songs, setSongs] = useState<Song[]>([]);
    const [useWhite, setUseWhite] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(-1);
    const [showHeader, setShowHeader] = React.useState(true);

    const processDataFrame = (df:CurrentDataFrame) => {
        setDataFrame(df);
        setUseWhite((df?.aqiIdx25 ?? -1) > 0);
    };

    const play = React.useCallback(
        (index) => {
            setCurrentIndex(index);
            audio.src = songs[index].filename;
            audio.play();
        },
        [audio, songs]
    );

    const playUnderage = React.useCallback(
        () => {
            audio.src = `${CDN}/audio/underage.wav`;
            audio.loop = true;
            audio.play();
        },
        [audio]
    );

    useEffect(() => {
        audio.addEventListener('play', () => setIsPlaying(true));
        audio.addEventListener('pause', () => setIsPlaying(false));
    }, [audio]);

    useEffect(() => {
        const getSensorData = async () => {
            const df = await fetchData<CurrentDataFrame>(`${config.serverUrl}/data/current.json`);
            if (!dataFrame || (df.timestamp > dataFrame?.timestamp))
                processDataFrame(df);
        };
        const getSongs = async () => {
            const sg = await fetchData<Song[]>(`${config.serverUrl}/data/songs.json`);
            setSongs(sg.map(s => ({
                ...s,
                filename: `${CDN}${audioPath}${s.filename}`
            })));
        };

        getSensorData();
        getSongs();

    }, [config.serverUrl, dataFrame]);

    useInterval(() => {
        const getSensorData = async () => {
            const df = await fetchData<CurrentDataFrame>(`${config.serverUrl}/data/current.json`);
            if (!dataFrame || (df.timestamp > dataFrame?.timestamp))
                processDataFrame(df);
        };
        getSensorData();
        return true;
    }, 30000, config.serverUrl);

    // @ts-ignore
    document.getElementById('root').className = showHeader ? backgrounds[dataFrame?.aqiIdx25 ?? 0] : 'glitch';
    document.body.className = showHeader ? '' : 'glitch';

    return (
        <>
            <canvas id="canvas-webgl" className={classes.canvasWebgl} />
            { showHeader && (
                <>
                    <div className="app">
                        <AppBar className={classes.appHeader} position="relative">
                            <Toolbar className={classes.toolBar}>
                                <img src={`${CDN}${logo}logo-text.png`} alt="logo" className={classes.logo} />
                                <img src={`${CDN}${logo}logo-heart.gif`} alt="logo" className={classes.logo2} />
                            </Toolbar>
                        </AppBar>

                        <Menu
                            useWhite={useWhite}
                            play={play}
                            classes={classes}
                            currentIndex={currentIndex}
                            songs={songs}
                        />

                        <Switch>
                            <Route path="/" exact>
                                <Redirect to="/current" />
                            </Route>

                            <Route path="/current" exact>
                                <Current
                                    dataFrame={dataFrame}
                                    useWhite={useWhite}
                                    classes={classes}
                                />
                            </Route>

                            <Route path="/fans" exact>
                                <Fans
                                    serverUrl={config.serverUrl}
                                    useWhite={useWhite}
                                    classes={classes}
                                />
                            </Route>

                            <Route path="/fiction" exact>
                                <Fiction
                                    serverUrl={config.serverUrl}
                                    useWhite={useWhite}
                                    setShowHeader={setShowHeader}
                                    play={playUnderage}
                                    classes={classes}
                                />
                            </Route>

                            <Route path="/trends" exact>
                                <Trends
                                    currentDataFrame={dataFrame || defaultDataFrame}
                                    serverUrl={config.serverUrl}
                                    classes={classes}
                                    useWhite={useWhite}
                                />
                            </Route>

                            <Route path="/songs" exact>
                                <Songs
                                    songs={songs}
                                    useWhite={useWhite}
                                    play={play}
                                    isPlaying={isPlaying}
                                    currentIndex={currentIndex}
                                    audio={audio}
                                />
                            </Route>

                            <Route path="/donations" exact>
                                <Donate useWhite={useWhite} classes={classes} />
                            </Route>

                            <Route
                                path="/:id"
                                exact
                                render={(props:RouteComponentProps) => {
                                    // @ts-ignore
                                    const { id } = props.match.params;
                                    const video = videoList[id];
                                    return <VideoPage video={video} useWhite={useWhite} classes={classes} />;
                                }}
                            />
                        </Switch>
                        <ScrollToTop useWhite={useWhite} />
                    </div>
                    <Footer useWhite={useWhite} classes={classes} />
                </>
            ) }
            { !showHeader && <Glitch /> }
        </>
    );
};
export default withStyles(styles)(App);
