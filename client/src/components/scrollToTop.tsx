import React, { FC, useEffect, useState } from 'react';
import Fab from '@mui/material/Fab';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { StyledComponent } from '../types';

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
        return () => window.removeEventListener('scroll', toggleVisibility);
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

export default ScrollToTop;
