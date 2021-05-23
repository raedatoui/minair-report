import React, { FC } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AverageLabels, CurrentDataFrame, statLabels, StyledComponent } from '../../types';
import { timestampToDate } from '../../utils';

const getAverageLabel = (l: string) => {
    const keys = Object.keys(AverageLabels);
    const values = Object.values(AverageLabels);
    const idx = keys.indexOf(l);
    if (idx >= 0)
        return values[idx];
    return l;
};

interface Props extends RouteComponentProps, StyledComponent {
    dataFrame?: CurrentDataFrame
}

const Current: FC<Props> = ({ history, useWhite, dataFrame, classes }) => {

    const catColorMapping = [
        classes.lightGreen,
        classes.yellow,
        classes.orange,
        classes.red,
        classes.burgundy,
        classes.purple,
        classes.purple
    ];
    const catColorFullMapping = [
        classes.lightGreenFull,
        classes.yellowFull,
        classes.orangeFull,
        classes.redFull,
        classes.burgundyFull,
        classes.purpleFull,
        classes.purpleFull
    ];
    const whiteBox = useWhite ? classes.whiteBox : '';

    return (
        <>
            { dataFrame
                && (
                    <Grid container spacing={3} className={`${classes.currentContainer} ${whiteBox}`}>
                        <Typography variant="h3" component="h3" className={classes.timeStamp}>
                            { timestampToDate('%m/%d/%Y %I:%M:%S %p', dataFrame.timestamp) }
                        </Typography>
                        <Grid item xs={12} sm={12} className={classes.card}>
                            <Card
                                className={`${classes.root} ${classes.cardBubble} ${catColorMapping[dataFrame.aqiIdx25 || 0]} ${whiteBox}`}
                                variant="outlined"
                                onClick={() => history.push('/trends?param=aqi25')}
                            >
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        Average US EPA PM2.5 AQI
                                    </Typography>
                                    <Typography variant="h2" component="h1" className={classes.bold}>
                                        { dataFrame.aqi25 }
                                    </Typography>
                                    <Typography variant="h6" component="h3">
                                        {'Particles >=2.5µm: count/dl:'} { dataFrame.umCount25 }
                                    </Typography>
                                    <Typography variant="h6" component="h3">
                                        Raw PM2.5 in µg/m³: { dataFrame.pm25 }
                                    </Typography>
                                    <List className={classes.averages}>
                                        { statLabels.map((k) => (
                                            <ListItem
                                                key={k}
                                                className={`${classes.average} ${catColorFullMapping[dataFrame.stats[k].catIdx]}`}
                                            >
                                                <Typography>{ getAverageLabel(k) }</Typography>
                                                <Typography className={classes.bold}>{ dataFrame.stats[k].aqi }</Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} className={`${classes.card} ${classes.row2}`}>
                            <Card
                                variant="outlined"
                                className={`
                                ${classes.root} 
                                ${classes.cardBubble} 
                                ${classes.card2} 
                                ${catColorMapping[dataFrame.aqiIdx100 || 0]} ${whiteBox}`}
                                onClick={() => history.push('/trends?param=aqi100')}
                            >
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        Average US EPA PM10.0 AQI
                                    </Typography>
                                    <Typography variant="h2" component="h1" className={classes.bold}>
                                        { dataFrame.aqi100 }
                                    </Typography>
                                    <Typography variant="h6" component="h3">
                                        {'Particles >=10.0µm: count/dl:'} { dataFrame.umCount10 }
                                    </Typography>
                                    <Typography variant="h6" component="h3">
                                        Raw PM10.0 in µg/m³: { dataFrame.pm100 }
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} className={`${classes.card} ${classes.row2}`}>
                            <Card className={`${classes.root} ${classes.cardBubble} ${classes.cardContainer} ${whiteBox}`} variant="outlined">
                                <CardContent className={classes.gray}>
                                    <Typography variant="h5" component="h2">
                                        Other Concentrations
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        onClick={() => history.push('/trends?param=pm10')}
                                    >
                                        {'Particles >=1.0µm: count/dl:'} { dataFrame.pm10 }
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        onClick={() => history.push('/trends?param=umCount03')}
                                    >
                                        Raw PM0.3 in µg/m³: { dataFrame.umCount03 }
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        onClick={() => history.push('/trends?param=umCount05')}
                                    >
                                        Raw PM0.5 in µg/m³: { dataFrame.umCount05 }
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        onClick={() => history.push('/trends?param=umCount10')}
                                    >
                                        Raw PM1.0 in µg/m³: { dataFrame.umCount10 }
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        onClick={() => history.push('/trends?param=umCount50')}
                                    >
                                        Raw PM5.0 in µg/m³: { dataFrame.umCount50 }
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} className={classes.card}>
                            <Card
                                className={`${classes.root} ${classes.cardBubble} ${classes.cardContainer} ${whiteBox}`}
                                variant="outlined"
                                onClick={() => history.push('/trends?param=temperature')}
                            >
                                <CardContent className={classes.gray}>
                                    <Typography variant="h5" component="h2">
                                        Temp
                                    </Typography>
                                    <Typography variant="h2" component="h1" className={classes.bold}>
                                        { dataFrame.temperature }° F
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} className={classes.card}>
                            <Card
                                className={`${classes.root} ${classes.cardBubble} ${classes.cardContainer} ${whiteBox}`}
                                variant="outlined"
                                onClick={() => history.push('/trends?param=humidity')}
                            >
                                <CardContent className={classes.gray}>
                                    <Typography variant="h5" component="h2">
                                        Humidity
                                    </Typography>
                                    <Typography variant="h2" component="h1" className={classes.bold}>
                                        { dataFrame.humidity }%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} className={classes.card}>
                            <Card
                                className={`${classes.root} ${classes.cardBubble} ${classes.cardContainer} ${whiteBox}`}
                                variant="outlined"
                                onClick={() => history.push('/trends?param=pressure')}
                            >
                                <CardContent className={classes.gray}>
                                    <Typography variant="h5" component="h2">
                                        Pressure
                                    </Typography>
                                    <Typography variant="h2" component="h1" className={classes.bold}>
                                        { dataFrame.pressure.toPrecision(4) } hg
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
        </>
    );
};

export default withRouter(Current);
