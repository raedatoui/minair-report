import { track } from '../../utils/analytics';
import React, { FC, useEffect } from 'react';
import clsx from 'clsx';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { StyledComponent, Video } from '../../types';

interface Props extends StyledComponent {
    video: Video
}

const VideoPage: FC<Props> = ({ video, classes }) => {
    const matches = useMediaQuery('(max-width:960px)');
    useEffect(() => { track('pageview', video.path); }, [video.path]);
    return (
        <Container className={classes.videoContainer}>
            <video preload="auto" controls poster={video.poster} autoPlay>
                <source src={video.video} type="video/mp4" />
                |<track kind="captions" />
            </video>
            <Typography
                className={clsx(classes.videoTitle, { small: matches })}
                variant="h4"
                component="h4"
            >{video.title}
            </Typography>
        </Container>
    );
};

export default VideoPage;
