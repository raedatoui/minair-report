'use client';

import Songs from '../../components/songs';
import { useMinair } from '../../components/app';

export default function Page() {
    const state = useMinair();
    if (!state.audio) return null;
    return <Songs {...state} audio={state.audio} />;
}
