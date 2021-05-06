import React, { FC } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../../styles';
import { StyledComponent } from '../../types';
import init from './init';

const Glitch:FC<StyledComponent> = () => {
    init();
    return (<></>);
};

export default withStyles(styles)(Glitch);
