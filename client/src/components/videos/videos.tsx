import React, { FC } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import clsx from 'clsx';
import { CDN } from '../../constants';
import { StyledComponent, Video } from '../../types';

interface Props extends StyledComponent {
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

const VideosPage:FC<Props> = ({ videoPass, setVideoPass, classes, items }) => {
    const router = useRouter();
    const matches = useMediaQuery('(max-width:960px)');

    const [pass, setPass] = React.useState<string>('');
    const [modalStyle] = React.useState(getModalStyle);

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
                                onClick={() => router.push(`/${items[k].path}`)}
                                dangerouslySetInnerHTML={{ __html: items[k].htmlTitle }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            )}

            <Modal
                id="fiction-modal"
                open={videoPass}

                aria-labelledby="miniar-fiction-age-verification"
                disableAutoFocus
                slotProps={{ backdrop: { className: classes.backDrop } }}
            >
                <div style={modalStyle} className={classes.modal}>
                    <Avatar src={`${CDN}/slate.png`} variant="square" />
                    <Box>
                        <TextField
                            slotProps={{ inputLabel: { color: 'primary' } }}
                            onChange={(e) => handlePass(e.target.value)}
                            onKeyDown={(e) => { if (e.code === 'Enter') checkPass(); }}
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

export default VideosPage;
