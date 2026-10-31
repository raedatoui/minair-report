'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
    const router = useRouter();
    useEffect(() => { router.replace('/current'); }, [router]);
    return <Link href="/current">View current readings</Link>;
}
