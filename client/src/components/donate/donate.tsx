import React, { FC } from 'react';
import clsx from 'clsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { StyledComponent } from '../../types';
import { styles } from '../../styles';

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

export default withStyles(styles)(Donate);
