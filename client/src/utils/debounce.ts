export const debounce = (callback: (e: void) => void, duration: number) => {
    let timer: NodeJS.Timeout;
    return (event: void) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(event);
        }, duration);
    };
};
