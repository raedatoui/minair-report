import React, { FC } from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { StyledComponent } from '../../types';

const Footer:FC<StyledComponent> = ({ classes }) => (
    <Paper elevation={3} className={classes.footer}>
        <ButtonGroup className={classes.footerBar}>
            <Button className={classes.footerButton}>
                <Link href="mailto:support@minair.me" target="_blank" rel="noreferrer" underline="none">Support</Link>
            </Button>
            <Button className={classes.footerButton}>
                <Link href="mailto:submissions@minair.me" target="_blank" rel="noreferrer" underline="none">Submissions</Link>
            </Button>
            <Button className={classes.footerButton}>
                <Link href="https://github.com/minair-affair/minair-report" target="_blank" rel="noreferrer" underline="none">Github</Link>
            </Button>
        </ButtonGroup>
    </Paper>

);

export default Footer;
