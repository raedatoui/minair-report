import { Video } from '../types';
import { CDN, videos as videosPath } from '../constants';

export const videoList: Record<string, Video> = [
    {
        title: 'Minair Seminair',
        htmlTitle: 'Minair<br>Seminair',
        video: 'minair-seminair.mp4',
        poster: 'light-poster.jpg',
        path: 'minair-seminair'
    },
    {
        title: 'Minair Seminair BTS',
        htmlTitle: 'Minair<br>Seminair BTS',
        video: 'minair-seminair-bts.mp4',
        poster: 'light-poster.jpg',
        path: 'minair-seminair-bts'
    },
    {
        title: 'Sal Blows 4 Minair',
        htmlTitle: 'Sal Blows<br>4 Minair',
        video: 'sal-blows.mp4',
        poster: 'dark-poster.jpg',
        path: 'sal-blows-4-minair'
    },
    {
        title: 'Cock Club Initiation',
        htmlTitle: 'Cock Club<br>Initiation',
        video: 'cock-club-initiation.mp4',
        poster: 'cock-club-initiation.png',
        path: 'cock-club-initiation'
    },
    {
        title: 'Minair Erotica Readings',
        htmlTitle: 'Minair<br>Erotica Readings',
        video: 'minair-erotica-readings.mp4',
        poster: 'dark-poster.jpg',
        path: 'erotica-readings'
    },
    {
        title: 'Minair Rap n\' Roll',
        htmlTitle: 'Minair<br>Rap n\' Roll',
        video: 'minair-rap-n-roll.mp4',
        poster: 'dark-poster.jpg',
        path: 'rap-n-roll'
    }
].reduce((acc, v) => ({
    ...acc,
    [v.path]: {
        ...v,
        video: `${CDN}${videosPath}${v.video}`,
        poster: `${CDN}${videosPath}${v.poster}`
    }
}), {});

