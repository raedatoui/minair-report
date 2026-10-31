'use client';

import Donate from '../../components/donate';
import { useMinair } from '../../components/app';

export default function Page() {
    const state = useMinair();
    return <Donate {...state} />;
}
