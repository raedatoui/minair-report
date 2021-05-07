import React, { FC, useEffect, useState } from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AppConfiguration, CurrentDataFrame, defaultDataFrame, Song } from '../types';
import { styles } from '../styles';
import { audio as audioPath, CDN, logo } from '../constants';
import { useInterval, fetchData, AudioContext } from '../utils';
import ScrollToTop from './scrollToTop';
import Current from './current';
import Fans from './fans';
import Menu from './menu';
import Charts from './charts';
import Fiction from './fiction';
import Songs from './songs';
import Glitch from './glitch';
import Footer from './footer';

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
    'burgundy'
];

const seminairUrl = 'https://storage.googleapis.com/api-project-992432653598.appspot.com/minair-seminair.mp4';
const seminairUrlBts = 'https://storage.googleapis.com/api-project-992432653598.appspot.com/minair-seminair-bts.mp4';
const posterUrl = 'https://storage.googleapis.com/api-project-992432653598.appspot.com/video-poster.jpg';

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

    useEffect(() => {
        audio.addEventListener('play', () => setIsPlaying(true));
        audio.addEventListener('pause', () => setIsPlaying(false));
    }, [audio]);

    useEffect(() => {
        const getSensorData = async () => {
            const df = await fetchData<CurrentDataFrame>(`${config.serverUrl}/api/current`);
            if (!dataFrame || (df.timestamp > dataFrame?.timestamp))
                processDataFrame(df);
        };
        const getSongs = async () => {
            const sg = await fetchData<Song[]>(`${config.serverUrl}/api/songs`);
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
            const df = await fetchData<CurrentDataFrame>(`${config.serverUrl}/api/current`);
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

                        <Menu useWhite={useWhite} play={play} currentIndex={currentIndex} songs={songs} />
                        <Switch>
                            <Route path="/" exact>
                                <Redirect to="/current" />
                            </Route>
                            <Route path="/current" exact>
                                <Current dataFrame={dataFrame} useWhite={useWhite} />
                            </Route>
                            <Route path="/fans" exact>
                                <Fans serverUrl={config.serverUrl} useWhite={useWhite} />
                            </Route>
                            <Route path="/charts" exact />
                            <Route path="/fiction" exact>
                                <Fiction serverUrl={config.serverUrl} useWhite={useWhite} setShowHeader={setShowHeader} />
                            </Route>
                            <Route path="/trends" exact>
                                <Charts currentDataFrame={dataFrame || defaultDataFrame} serverUrl={config.serverUrl} useWhite={useWhite} />
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
                            <Route
                                path="/minair-seminair"
                                exact
                                render={() => {
                                // @ts-ignore
                                    gtag('pageview', 'minair-seminair');
                                    return (
                                        <Container className={classes.videoContainer}>
                                            <video preload="none" src={seminairUrl} controls poster={posterUrl}>
                                                |<track kind="captions" />
                                            </video>
                                        </Container>
                                    );
                                }}
                            />
                            <Route
                                path="/minair-seminair-bts"
                                exact
                                render={() => {
                                // @ts-ignore
                                    gtag('pageview', 'minair-seminair-bts');
                                    return (
                                        <Container className={classes.videoContainer}>
                                            <video preload="none" src={seminairUrlBts} controls poster={posterUrl}>
                                                |<track kind="captions" />
                                            </video>
                                        </Container>
                                    );
                                }}
                            />
                        </Switch>
                        <ScrollToTop useWhite={useWhite} />
                    </div>
                    <Footer useWhite={useWhite} />
                </>
            ) }
            { !showHeader && <Glitch useWhite={useWhite} /> }
        </>
    );
};

export default withStyles(styles)(App);
