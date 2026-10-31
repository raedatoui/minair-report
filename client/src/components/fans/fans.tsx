import React, { FC, useCallback, useRef, useEffect, useState } from 'react';
import { uniq, filter, sortBy } from 'lodash';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import { CDN, fans as fansPath, apiRoutes } from '../../constants';
import { Media, StyledComponent, ComponentProps } from '../../types';
import { fetchData } from '../../utils';

interface FanImageProps extends StyledComponent {
    image: Media;
}

interface FanVideoProps extends StyledComponent {
    video: Media;
    playing: boolean;
    onPlayingChange: (playing: boolean) => void;
}

function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length; let temporaryValue; let randomIndex;
    const clone = [...array];
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = clone[currentIndex];
        clone[currentIndex] = clone[randomIndex];
        clone[randomIndex] = temporaryValue;
    }
    return clone;
}

const FanImage: FC<FanImageProps> = ({ useWhite, image, classes }) => {
    const [liked, setLiked] = React.useState(false);
    const whiteBox = useWhite ? classes.whiteBox : '';
    return (
        <Card className={`${classes.fanCard} ${whiteBox}`}>
            <CardActionArea>
                <img alt="meme" src={`${CDN}${fansPath}${image.file}`} className={classes.fanMedia} />
            </CardActionArea>
            <CardActions disableSpacing>
                <IconButton onClick={() => setLiked(true)} aria-label="add to favorites" className={liked ? classes.fanLiked : ''}>
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} component="span">
                    by {image.submittedBy}
                </Typography>
            </CardActions>
        </Card>
    );
};

const FanVideo: FC<FanVideoProps> = ({ useWhite, video, classes, playing, onPlayingChange }) => {
    const whiteBox = useWhite ? classes.whiteBox : '';

    const ref = useRef<HTMLVideoElement | null>(null);
    const setPlayerRef = useCallback((player: HTMLVideoElement | null) => {
        ref.current = player;
        // ReactPlayer 3 does not forward poster to its HTML video element.
        if (player)
            player.poster = `${CDN}${fansPath}${video.poster}`;
    }, [video.poster]);

    const togglePlayback = () => {
        const nextPlaying = !playing;
        onPlayingChange(nextPlaying);
        if (nextPlaying && screenfull.isEnabled && ref.current) {
            void screenfull.request(ref.current).catch(() => {
                // Fullscreen may be denied; playback can continue inline.
            });
        }
    };

    return (
        <Card className={`${classes.fanCard} ${whiteBox}`}>
            <CardActionArea onClick={togglePlayback}>
                <ReactPlayer
                    id={String(video.id)}
                    ref={setPlayerRef}
                    preload="none"
                    src={`${CDN}${fansPath}${video.file}`}
                    playing={playing}
                    onPlay={() => onPlayingChange(true)}
                    onPause={() => onPlayingChange(false)}
                    onEnded={() => onPlayingChange(false)}
                    width="100%"
                />

            </CardActionArea>
            <CardActions disableSpacing>
                <IconButton onClick={togglePlayback} aria-label={playing ? 'Pause video' : 'Play video'} className={playing ? classes.fanLiked : ''}>
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} component="span">
                    by {video.submittedBy}
                </Typography>
            </CardActions>
        </Card>
    );
};

const Fans: FC<ComponentProps> = ({ useWhite, classes }) => {
    const [media, setMedia] = useState<Media[]>([]);
    const [authors, setAuthors] = useState<string[]>([]);
    const [currentAuthor, setCurrentAuthor] = useState<string>('All');
    const [order, setOrder] = useState<string>('Not Boring!');
    const [playingVideoId, setPlayingVideoId] = useState<Media['id'] | null>(null);

    const [currentMedia, setCurrentMedia] = useState<Media[]>([]);
    const [toggleOrder, setToggleOrder] = useState<boolean>(false);

    const handleOrderChange = (value: string) => {
        setOrder(value);
        setToggleOrder(prevToggleOrder => !prevToggleOrder);
    };

    useEffect(() => {
        const getMedia = async () => {
            const data = await fetchData<Media[]>(apiRoutes.media);
            const initalMedia = shuffle<Media>(data);
            setMedia(initalMedia);
            setCurrentMedia(initalMedia);
            const allAuthors = ['All'].concat(uniq<string>(data.map(m => m.submittedBy)));
            setAuthors(allAuthors.sort());
        };
        getMedia();

    }, []);

    useEffect(() => {
        let data;
        if (currentAuthor === 'All')
            data = media;
        else
            data = filter(media, (m) => m.submittedBy === currentAuthor);
        if (order === 'Not Boring!')
            data = shuffle<Media>(data);
        else
            data = sortBy(data, 'order').reverse();
        setCurrentMedia(data);
    }, [currentAuthor, media, order]);

    useEffect(() => {
        if (order === 'Not Boring!')
            setCurrentMedia(oldMedia => shuffle<Media>(oldMedia));
    }, [toggleOrder, order, media]);

    return (

        <div className={classes.fanCardContainer}>
            <Box>
                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.chartSelector}>Submitted By</InputLabel>
                    <Select
                        value={currentAuthor}
                        className={classes.chartSelector}
                        onChange={({ target: { value } }) => setCurrentAuthor(value as string)}
                    >
                        {authors.map(v => (
                            <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel className={classes.chartSelector}>Order</InputLabel>
                    <Select
                        value={order}
                        className={classes.chartSelector}
                        onClose={() => setToggleOrder(prevToggleOrder => !prevToggleOrder)}
                        onChange={({ target: { value } }) => handleOrderChange(value as string)}
                    >
                        <MenuItem value="Newest">Newest</MenuItem>
                        <MenuItem value="Not Boring!">Not Boring!</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <div className={classes.fanMediaContainer}>
                { currentMedia.map(v => {
                    if (v.type === 'video') return (
                        <FanVideo
                            useWhite={useWhite}
                            video={v}
                            key={v.id}
                            classes={classes}
                            playing={playingVideoId === v.id}
                            onPlayingChange={playing => setPlayingVideoId(current => (
                                playing ? v.id : current === v.id ? null : current
                            ))}
                        />
                    );
                    if (v.type === 'image') return (
                        <FanImage useWhite={useWhite} image={v} key={v.id} classes={classes} />
                    );
                    return null;
                })}
            </div>
        </div>
    );
};

export default Fans;
