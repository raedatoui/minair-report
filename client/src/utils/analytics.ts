declare global {
    interface Window { gtag?: (...args: unknown[]) => void; }
}

export const track = (...args: unknown[]) => {
    if (typeof window !== 'undefined') window.gtag?.(...args);
};
