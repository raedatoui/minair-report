import React, { FC, useState, useRef } from 'react';
import clsx from 'clsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { withStyles } from '@material-ui/core/styles';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { styles } from '../../styles';
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
    const audioRef2 = useRef(makeAudio(() => {}, `${CDN}${audioPath}minair-mission-statement.wav`));

    const songPosition = currentIndex + 1 >= songs.length ? songs.length - 1 : currentIndex + 1;

    const navigate = (url: string) => {
        history.push(url);
        // @ts-ignore
        gtag('pageview', url);
    };

    const handleJingle = () => {
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

    return (

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
                        src={`${CDN}${menuPath}${songs[songPosition]?.icon ?? 'jingle.png'}`}
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
    );
};

export default withRouter(withStyles(styles)(Menu));
