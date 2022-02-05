import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => boolean, delay: number) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        // @ts-ignore
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    // eslint-disable-next-line consistent-return
    useEffect(() => {
        const tick = () => {
            // @ts-ignore
            savedCallback.current();
        };
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};
