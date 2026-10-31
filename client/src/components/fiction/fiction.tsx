import { track } from '../../utils/analytics';
import React, { FC, useEffect, useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
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
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div className={classes.timelineChapter} onClick={() => setSelected(!selected)}>{fiction.chapter}</div>
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

const FictionItem = FictionItemInner;

const getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
};

interface Props extends ComponentProps {
    setShowHeader: (s: boolean) => void,
    play: () => void,
}

const Fiction:FC<Props> = ({ setShowHeader, useWhite, play, classes }) => {
    const [fiction, setFiction] = useState<FictionType[]>([]);
    const [open, setOpen] = React.useState(true);
    const [modalStyle] = React.useState(getModalStyle);

    const navigate = () => {
        setShowHeader(false);
        setOpen(false);
        play();
        // history.push(url);
        track('event', 'not18');
    };

    useEffect(() => {
        const getFiction = async () => {
            const data = await fetchData<FictionType[]>(apiRoutes.fiction);
            setFiction(data);
        };
        // eslint-disable-next-line no-console
        getFiction().catch(console.error);

    }, []);

    return (
        <div className={classes.fictionContainer}>
            {!open && (
                <>
                    <Typography className={classes.fictionHeadline} variant="h4" component="h2" gutterBottom>
                        The Minair Affair: <br />An Erotic Fan Fiction Journey of Longing, Lust, and Air Quality
                    </Typography>
                    <Timeline className={classes.timeline}>
                        { fiction.map(f => (<FictionItem classes={classes} key={f.chapter} useWhite={useWhite} fiction={f} />))}
                    </Timeline>
                </>
            )}
            <Modal
                id="fiction-modal"
                open={open}
                aria-labelledby="miniar-fiction-age-verification"
                disableAutoFocus
                slotProps={{ backdrop: { className: classes.backDrop } }}
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

export default Fiction;
