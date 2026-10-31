'use client';

import History from '../../components/history';
import { useMinair } from '../../components/app';

export default function Page() {
    const state = useMinair();
    return <History {...state} />;
}
