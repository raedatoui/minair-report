import React, { FC } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx';
import { CDN } from '../../constants';
import { styles } from '../../styles';
import { StyledComponent, Video } from '../../types';

interface Props extends RouteComponentProps, StyledComponent {
    items: Record<string, Video>,
    videoPass: boolean,
    setVideoPass: (b:boolean) => void
}

const getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
};

const VideosPage:FC<Props> = ({ history, videoPass, setVideoPass, classes, items }) => {
    const matches = useMediaQuery('(max-width:960px)');

    const [pass, setPass] = React.useState<string>('');
    const [modalStyle] = React.useState(getModalStyle);

    const handleClose = () => {
        setVideoPass(false);
    };

    const handlePass = (p: string) => {
        setPass(p);
    };

    const checkPass = () => {
        if (pass === 'cocks')
            setVideoPass(false);
    };

    return (
        <>
            {!videoPass && (
                <ImageList rowHeight={350} cols={3} gap={12} className={classes.videoList}>
                    {Object.keys(items).map(k => (
                        <ImageListItem key={items[k].title}>
                            <Typography
                                className={clsx(classes.videoTitle, { small: matches })}
                                variant="h4"
                                component="h4"
                                onClick={() => history.push(`/${items[k].path}`)}
                                dangerouslySetInnerHTML={{ __html: items[k].htmlTitle }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            )}

            <Modal
                id="fiction-modal"
                open={videoPass}
                onClose={handleClose}
                aria-labelledby="miniar-fiction-age-verification"
                disableEscapeKeyDown
                disableBackdropClick
                disableAutoFocus
                BackdropProps={{
                    classes: {
                        root: classes.backDrop
                    }
                }}
            >
                <div style={modalStyle} className={classes.modal}>
                    <Avatar src={`${CDN}/slate.png`} variant="square" />
                    <Box>
                        <TextField
                            InputLabelProps={{ color: 'primary' }}
                            onChange={(e) => handlePass(e.target.value)}
                            onKeyPress={(e) => { if (e.code === 'Enter') checkPass(); }}
                        />
                    </Box>
                    <Box>
                        <Button onClick={() => checkPass()}>Whatever</Button>
                    </Box>
                </div>
            </Modal>
        </>
    );
};

export default withRouter(withStyles(styles)(VideosPage));
