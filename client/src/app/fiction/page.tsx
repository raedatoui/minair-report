'use client';

import Fiction from '../../components/fiction';
import { useMinair } from '../../components/app';

export default function Page() {
    const state = useMinair();
    return <Fiction {...state} play={state.playUnderage} />;
}
