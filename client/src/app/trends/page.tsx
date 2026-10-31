'use client';

import { Suspense } from 'react';
import Trends from '../../components/trends';
import { useMinair } from '../../components/app';
import { defaultDataFrame } from '../../types';

export default function Page() {
    const state = useMinair();
    return <Suspense fallback={<p>Loading recent readings…</p>}><Trends {...state} currentDataFrame={state.dataFrame ?? defaultDataFrame} /></Suspense>;
}
