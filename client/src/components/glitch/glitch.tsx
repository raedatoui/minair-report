import { useEffect } from 'react';
import init from './init';

const Glitch = () => {
    useEffect(() => init(), []);
    return null;
};

export default Glitch;
