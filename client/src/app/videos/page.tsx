'use client';

import Videos from '../../components/videos';
import { useMinair } from '../../components/app';
import { videoList } from '../../content/videos';

export default function Page() {
    const state = useMinair();
    return <Videos {...state} items={videoList} />;
}
