import { dateFormat } from 'highcharts';
import { fetchData } from './fetch-data';
import { useInterval } from './user-interval';
import { makeAudio, AudioContext } from './audio-context';
import { debounce } from './debounce';

const timestampToDate = (f:string, x:number): string => {
    const offset = new Date().getTimezoneOffset() * 60000;
    return dateFormat(f, x * 1000 - offset);
};

export {
    fetchData,
    useInterval,
    timestampToDate,
    makeAudio,
    AudioContext,
    debounce
};
