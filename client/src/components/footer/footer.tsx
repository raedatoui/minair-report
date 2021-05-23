import React, { FC } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
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
