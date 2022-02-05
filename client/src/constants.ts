export const CDN = 'https://storage.googleapis.com/www.minair.me';
export const fans = '/fans/';
export const audio = '/audio/';
export const menu = '/menu/';
export const logo = '/logo/';
export const videos = '/videos/';

const dev = false;

const api = dev ? 'api' : 'data';
const serverUrl = dev ? 'http://localhost:5000' : CDN;
const suffix = dev ? '' : '.json';

export const apiRoutes = {
    songs: `${serverUrl}/${api}/songs${suffix}`,
    media: `${serverUrl}/${api}/media${suffix}`,
    fiction: `${serverUrl}/${api}/fiction${suffix}`,
    videos: `${serverUrl}/${api}/videos${suffix}`,
    current: `${serverUrl}/${api}/current${suffix}`,
    hour: `${serverUrl}/${api}/1hour${suffix}`,
    sixHours: `${serverUrl}/${api}/6hour${suffix}`,
    twelveHours: `${serverUrl}/${api}/12hour${suffix}`,
    day: `${serverUrl}/${api}/24hour${suffix}`,
    week: `${serverUrl}/${api}/1week${suffix}`,
    dayTrends: `${serverUrl}/${api}/24htrends${suffix}`,
    weekTrends: `${serverUrl}/${api}/1weektrends${suffix}`,
};
