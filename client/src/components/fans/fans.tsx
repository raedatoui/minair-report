import React, { FC, useRef, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import { styles } from '../../styles';
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

    useEffect(() => {
        const getMedia = async () => {
            const data = await fetchData<Media[]>(`${serverUrl}/api/media`);
            setMedia(shuffle<Media>(data));
        };
        getMedia();

    }, [serverUrl]);
    return (
        <div className={classes.fanCardContainer}>
            { media.map(v => {
                if (v.type === 'video') return (
                    <FanVideo useWhite={useWhite} video={v} key={v.id} classes={classes} />
                );
                if (v.type === 'image') return (
                    <FanImage useWhite={useWhite} image={v} key={v.id} classes={classes} />
                );
                return <></>;
            })}
        </div>
    );
};

export default withStyles(styles)(Fans);
