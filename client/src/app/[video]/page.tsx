import { notFound } from 'next/navigation';
import { videoList } from '../../content/videos';
import VideoRoute from './video-route';

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(videoList).map(video => ({ video }));

export default async function Page({ params }: { params: Promise<{ video: string }> }) {
    const { video: path } = await params;
    const video = videoList[path];
    if (!video) notFound();
    return <VideoRoute video={video} />;
}
