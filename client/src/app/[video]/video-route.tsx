'use client';

import VideoPage from '../../components/video';
import { useMinair } from '../../components/app';
import { Video } from '../../types';

export default function VideoRoute({ video }: { video: Video }) {
    const state = useMinair();
    return <VideoPage {...state} video={video} />;
}
