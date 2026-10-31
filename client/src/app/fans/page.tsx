'use client';

import Fans from '../../components/fans';
import { useMinair } from '../../components/app';

export default function Page() {
    const state = useMinair();
    return <Fans {...state} />;
}
