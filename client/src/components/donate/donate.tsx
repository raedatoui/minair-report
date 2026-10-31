import React, { FC } from 'react';
import clsx from 'clsx';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';
import { StyledComponent } from '../../types';

const Donate: FC<StyledComponent> = ({ classes }) => {
    const matches = useMediaQuery('(max-width:960px)');
    return (
        <Typography className={clsx(classes.donateText, { small: matches })}>
            The Minair Report would not be possible without your support.<br />
            If this site entertains and brings you so much joy, <br />
            then please consider making a donation to keep Minair afloat.<br />
            Venmo @Minair-Report<br />
            Thank you.
        </Typography>
    );
};

export default Donate;
