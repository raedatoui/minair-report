'use client';

import Current from '../../components/current';
import { useMinair } from '../../components/app';

export default function Page() {
    const state = useMinair();
    return <Current {...state} />;
}
