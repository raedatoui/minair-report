import React, { FC, useEffect, useState } from 'react';
import Fab from '@material-ui/core/Fab';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { withStyles } from '@material-ui/core/styles';
import { StyledComponent } from '../types';
import { styles } from '../styles';

const ScrollToTop:FC<StyledComponent> = ({ classes }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled upto given distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300)
            setIsVisible(true);
        else
            setIsVisible(false);

    };

    // Set the top coordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className={classes.scrollToTop}>
            {isVisible
            && (
                <Fab color="primary" aria-label="scrollToTop" onClick={scrollToTop}>
                    <ArrowUpwardIcon />
                </Fab>
            )}
        </div>
    );
};

export default withStyles(styles)(ScrollToTop);
