import React, { FC } from 'react';
import clsx from 'clsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { StyledComponent, Video } from '../../types';

interface Props extends StyledComponent {
    video: Video
}

const VideoPage: FC<Props> = ({ video, classes }) => {
    const matches = useMediaQuery('(max-width:960px)');
    // @ts-ignore
    gtag('pageview', video.path);
    return (
        <Container className={classes.videoContainer}>
            <video preload="none" src={video.video} controls poster={video.poster} autoPlay>
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
