import { dateFormat } from 'highcharts';

export const timestampToDate = (f:string, x:number): string => {
    const offset = new Date().getTimezoneOffset() * 60000;
    return dateFormat(f, x * 1000 - offset);
};
