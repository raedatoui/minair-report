import { useEffect, useRef, useState } from 'react';
import { Rect } from '../types';

export const useBbox = () => {
    const ref = useRef<HTMLElement>();
    const [bbox, setBbox] = useState<Rect>({
        x: 0, y: 0
    });

    const set = () => {
        const r = ref?.current?.getBoundingClientRect() ?? { x: 0, y: 0 };
        setBbox({
            x: r.x,
            y: r.y
        });
    };

    useEffect(() => {
        set();
        window.addEventListener('resize', set);
        return () => window.removeEventListener('resize', set);
    }, []);

    return [bbox, ref];
};
