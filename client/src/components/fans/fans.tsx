import React, { FC, useRef, useEffect, useState } from 'react';
import { uniq, filter, sortBy } from 'lodash';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import { CDN, fans as fansPath } from '../../constants';
import { Media, StyledComponent, ComponentProps } from '../../types';
import { fetchData } from '../../utils';

interface FanImageProps extends StyledComponent {
    image: Media;
}

interface FanVideoProps extends StyledComponent {
    video: Media;
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
                <Typography variant="body2" color="textSecondary" component="span">
                    by {image.submittedBy}
                </Typography>
            </CardActions>
        </Card>
    );
};

const FanVideo: FC<FanVideoProps> = ({ useWhite, video, classes }) => {
    const [liked, setLiked] = React.useState(false);
    const whiteBox = useWhite ? classes.whiteBox : '';

    const ref = useRef(null);
    useEffect(() => {
        if (liked && screenfull.isEnabled)
            // @ts-ignore
            screenfull.request(document.getElementById(video.id));
    }, [liked, video]);

    return (
        <Card className={`${classes.fanCard} ${whiteBox}`}>
            <CardActionArea onClick={() => setLiked(!liked)}>
                <ReactPlayer
                    config={{
                        file: {
                            attributes: {
                                preload: 'none',
                                poster: `${CDN}${fansPath}${video.poster}`
                            }
                        }
                    }}
                    id={video.id}
                    ref={ref}
                    url={`${CDN}${fansPath}${video.file}`}
                    playing={liked}
                    width="100%"
                />

            </CardActionArea>
            <CardActions disableSpacing>
                <IconButton onClick={() => setLiked(!liked)} aria-label="add to favorites" className={liked ? classes.fanLiked : ''}>
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <Typography variant="body2" color="textSecondary" component="span">
                    by {video.submittedBy}
                </Typography>
            </CardActions>
        </Card>
    );
};

const Fans: FC<ComponentProps> = ({ useWhite, serverUrl, classes }) => {
    const [media, setMedia] = useState<Media[]>([]);
    const [authors, setAuthors] = useState<string[]>([]);
    const [currentAuthor, setCurrentAuthor] = useState<string>('All');
    const [order, setOrder] = useState<string>('Not Boring!');

    const [currentMedia, setCurrentMedia] = useState<Media[]>([]);
    const [toggleOrder, setToggleOrder] = useState<boolean>(false);

    const handleOrderChange = (value: string) => {
        setOrder(value);
        setToggleOrder(prevToggleOrder => !prevToggleOrder);
    };

    useEffect(() => {
        const getMedia = async () => {
            const data = await fetchData<Media[]>(`${serverUrl}/data/media.json`);
            const initalMedia = shuffle<Media>(data);
            setMedia(initalMedia);
            setCurrentMedia(initalMedia);
            const allAuthors = ['All'].concat(uniq<string>(data.map(m => m.submittedBy)));
            setAuthors(allAuthors.sort());
        };
        getMedia();

    }, [serverUrl]);

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
                        <FanVideo useWhite={useWhite} video={v} key={v.id} classes={classes} />
                    );
                    if (v.type === 'image') return (
                        <FanImage useWhite={useWhite} image={v} key={v.id} classes={classes} />
                    );
                    return <></>;
                })}
            </div>
        </div>
    );
};

export default Fans;
