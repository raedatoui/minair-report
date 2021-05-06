module.exports = function (callback, duration) {
    let timer;
    return function (event) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(event);
        }, duration);
    };
};
