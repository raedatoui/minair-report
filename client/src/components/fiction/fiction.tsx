import React, { FC, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Avatar from '@material-ui/core/Avatar';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { styles } from '../../styles';
import { Fiction as FictionType, StyledComponent, ComponentProps } from '../../types';
import { fetchData } from '../../utils';
import { CDN, apiRoutes } from '../../constants';

interface Story extends StyledComponent {
    fiction: FictionType
}

const FictionItemInner: FC<Story> = ({ useWhite, fiction, classes }) => {
    const [selected, setSelected] = useState(false);
    const whiteBox = useWhite ? classes.whiteBox : '';

    return (
        <TimelineItem className={`${classes.timelineItem} ${whiteBox}`}>
            <TimelineSeparator>
                <TimelineDot className={classes.timelineDot}>
                    <FavoriteIcon onClick={() => setSelected(!selected)} className={selected ? classes.fanLiked : ''} />
                </TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className={`${classes.fictionCopy} ${classes.fictionChapterContainer} ${whiteBox}`}>
                <div className={classes.timelineChapter}>{fiction.chapter}</div>
                { selected && (
                    <Paper
                        elevation={2}
                        className={classes.timelinePaper}
                        dangerouslySetInnerHTML={{ __html: fiction.story }}
                    />
                )}
            </TimelineContent>
        </TimelineItem>
    );
};

const FictionItem = withStyles(styles)(FictionItemInner);

const getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
};

interface Props extends RouteComponentProps, ComponentProps {
    setShowHeader: (s: boolean) => void,
    play: () => void,
}

const Fiction:FC<Props> = ({ setShowHeader, useWhite, play, classes }) => {
    const [fiction, setFiction] = useState<FictionType[]>([]);
    const [open, setOpen] = React.useState(true);
    const [modalStyle] = React.useState(getModalStyle);

    const handleClose = () => {
        setOpen(false);
    };

    const navigate = () => {
        setShowHeader(false);
        setOpen(false);
        play();
        // history.push(url);
        // @ts-ignore
        gtag('event', 'not18');
    };

    useEffect(() => {
        const getFiction = async () => {
            const data = await fetchData<FictionType[]>(apiRoutes.fiction);
            setFiction(data);
        };
        getFiction();

    }, []);

    return (
        <div className={classes.fictionContainer}>
            <Typography className={classes.fictionHeadline} variant="h4" component="h2" gutterBottom>
                The Minair Affair: <br />An Erotic Fan Fiction Journey of Longing, Lust, and Air Quality
            </Typography>
            <Timeline className={classes.timeline}>
                { fiction.map(f => (<FictionItem key={f.chapter} useWhite={useWhite} fiction={f} />))}
            </Timeline>
            <Modal
                id="fiction-modal"
                open={open}
                onClose={handleClose}
                aria-labelledby="miniar-fiction-age-verification"
                disableBackdropClick
                disableEscapeKeyDown
                disableAutoFocus
                BackdropProps={{
                    classes: {
                        root: classes.backDrop
                    }
                }}
            >
                <div style={modalStyle} className={classes.modal}>
                    <Avatar src={`${CDN}/halt.png`} variant="square" />
                    <h2 id="simple-modal-title">Are you over 18?</h2>
                    <Box>
                        <Button onClick={() => setOpen(false)}>YES</Button>
                        <Button onClick={() => navigate()}>WHATEVER, BORING</Button>
                    </Box>
                </div>
            </Modal>
        </div>
    );
};

export default withRouter(Fiction);
