import React, { FC, useState, createRef, useRef, useEffect } from 'react';
import clsx from 'clsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { CDN, audio as audioPath, menu as menuPath } from '../../constants';
import { StyledComponent, Song } from '../../types';
import { makeAudio } from '../../utils';

interface Props extends RouteComponentProps, StyledComponent {
    currentIndex: number
    play: (idx: number) => void,
    songs: Song[]
}

const Menu: FC<Props> = ({ currentIndex, play, songs, history, classes }) => {
    const matches = useMediaQuery('(min-width:1024px)');
    const xmatches = useMediaQuery('(min-width:1280px)');
    const [value, setValue] = useState(0);
    const [animate, setAnimate] = useState<boolean>(false);
    const donateRef = createRef<HTMLElement>();
    const donateSrcRef = createRef<HTMLElement>();

    const audioRef2 = useRef(makeAudio(() => {}, `${CDN}${audioPath}minair-mission-statement.wav`));

    const navigate = (url: string) => {
        history.push(url);
        // @ts-ignore
        gtag('pageview', url);
    };

    const handleJingle = () => {
        let songPosition = currentIndex + 1;
        if (songPosition === songs.length)
            songPosition = 0;
        // @ts-ignore
        gtag('event', songs[songPosition].title);
        play(songPosition);
        navigate('songs');
    };

    const handleMission = () => {
        audioRef2?.current?.play();
        // @ts-ignore
        gtag('event', 'mission_statement');
    };

    useEffect(() => {
        if (!animate && donateSrcRef && donateSrcRef.current && donateRef && donateRef.current) {
            setAnimate(true);
            const rect = donateSrcRef?.current?.getBoundingClientRect() ?? { x: 0, y: 0 };
            const x = rect.x + 200;
            const y = rect.y + 200;
            const offset = 6;
            const transforms = [
                { transform: `translate(-${x}px, -${y}px) scale(2)` },
                { transform: `translate(-${x / (5 * offset) + Math.random() * (x / 2)}px, -${y * (5 / 6)}px) scale(2)` },
                { transform: `translate(-${x / (4 * offset) + Math.random() * (x / 2)}px, -${y * (4 / 6)}px) scale(1.75)` },
                { transform: `translate(-${x / (3 * offset) + Math.random() * (x / 2)}px, -${y * (3 / 6)}px) scale(1.5)` },
                { transform: `translate(-${x / (3 * offset) + Math.random() * (x / 2)}px, -${y * (2 / 6)}px) scale(1.25)` },
                { transform: 'translate(0,0px) scale(1)' }
            ];
            donateRef?.current?.animate(transforms, { duration: 7000, iterations: 1 });
        }
    }, [donateRef, donateSrcRef, animate]);

    return (
        <>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className={clsx(classes.menu, { large: matches || xmatches })}
            >
                <BottomNavigationAction
                    onClick={() => navigate('current')}
                    label=""
                    className={classes.menuItem}
                    icon={(
                        <Avatar
                            className={clsx(classes.menuIcon, { large: matches, xlarge: xmatches })}
                            src={`${CDN}${menuPath}now.png`}
                            variant="square"
                        />
                    )}
                />
                <BottomNavigationAction
                    onClick={() => navigate('fans')}
                    label=""
                    className={classes.menuItem}
                    icon={(
                        <Avatar
                            className={clsx(classes.menuIcon, { large: matches, xlarge: xmatches })}
                            src={`${CDN}${menuPath}fans.png`}
                            variant="square"
                        />
                    )}
                />
                <BottomNavigationAction
                    onClick={() => handleJingle()}
                    label=""
                    className={classes.menuItem}
                    icon={(
                        <Avatar
                            className={clsx(classes.menuIcon, { large: matches, xlarge: xmatches })}
                            src={`${CDN}${menuPath}${songs[currentIndex]?.icon ?? 'jingle.png'}`}
                            variant="square"
                        />
                    )}
                />
                <BottomNavigationAction
                    onClick={() => handleMission()}
                    label=""
                    className={classes.menuItem}
                    icon={(
                        <Avatar
                            className={clsx(classes.menuIcon, { large: matches, xlarge: xmatches })}
                            src={`${CDN}${menuPath}mission.png`}
                            variant="square"
                        />
                    )}
                />
                <BottomNavigationAction
                    onClick={() => navigate('fiction')}
                    label=""
                    className={classes.menuItem}
                    icon={(
                        <Avatar
                            className={clsx(classes.menuIcon, { large: matches, xlarge: xmatches })}
                            src={`${CDN}${menuPath}xxx.png`}
                            variant="square"
                        />
                    )}
                />
                <BottomNavigationAction
                    onClick={() => navigate('trends')}
                    label=""
                    className={classes.menuItem}
                    icon={(
                        <Avatar
                            className={clsx(classes.menuIcon, { large: matches, xlarge: xmatches })}
                            src={`${CDN}${menuPath}trends.png`}
                            variant="square"
                        />
                    )}
                />
            </BottomNavigation>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className={clsx(classes.menu2, { large: matches || xmatches })}
            >
                <BottomNavigationAction
                    label=""
                    icon={(
                        <>
                            <Avatar
                                ref={donateSrcRef as React.RefObject<HTMLDivElement>}
                                className={clsx(`${classes.menuIcon} ${classes.donateIconPlace}`,
                                    { large: matches, xlarge: xmatches })}
                                variant="square"
                            />
                            <Avatar
                                onClick={() => navigate('donations')}
                                ref={donateRef as React.RefObject<HTMLDivElement>}
                                className={clsx(`${classes.menuIcon} ${classes.donateIcon}`,
                                    { large: matches, xlarge: xmatches })}
                                src={`${CDN}${menuPath}donations.gif`}
                                variant="square"
                            />
                        </>
                    )}
                />
            </BottomNavigation>
        </>
    );
};

export default withRouter(Menu);
