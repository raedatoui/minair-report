export const makeAudio = (onEnded: ()=>void, src?: string): HTMLAudioElement => {
    const a = new Audio(src);
    a.preload = 'none';
    a.onended = () => onEnded();
    a.id = (Math.random() * 10).toString();
    return a;
};
