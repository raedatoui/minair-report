/* eslint-disable no-empty */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable global-require */

const THREE = require('three');
const debounce = require('./debounce.js');

const BackgroundImage = require('./backgroundImage.js').default;
const PostEffect = require('./postEffect.js').default;

const normalizeVector2 = function (vector) {
    vector.x = (vector.x / document.body.clientWidth) * 2 - 1;
    vector.y = -(vector.y / window.innerHeight) * 2 + 1;
};

const images = [
    ['https://minair.me/media/minair.jpg', 2048, 1152],
    ['https://minair.me/media/minair-mb.jpg', 828, 1792],
];
export default function () {
    const canvas = document.getElementById('canvas-webgl');
    const renderer = new THREE.WebGL1Renderer({
        antialias: false,
        canvas,
    });
    const renderBack1 = new THREE.WebGLRenderTarget(document.body.clientWidth, window.innerHeight);
    const scene = new THREE.Scene();
    const sceneBack = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const cameraBack = new THREE.PerspectiveCamera(45, document.body.clientWidth / window.innerHeight, 1, 2);
    const clock = new THREE.Clock();

    const vectorTouchStart = new THREE.Vector2();
    const vectorTouchMove = new THREE.Vector2();
    const vectorTouchEnd = new THREE.Vector2();

    let isDrag = false;

    //
    // process for this sketch.
    //

    const bgImg = new BackgroundImage(images[0][0], images[0][1], images[0][2]);
    const postEffect = new PostEffect(renderBack1.texture);

    //
    // common process
    //
    const resizeWindow = () => {
        canvas.width = document.body.clientWidth;
        canvas.height = window.innerHeight;
        cameraBack.aspect = document.body.clientWidth / window.innerHeigh;
        cameraBack.updateProjectionMatrix();
        bgImg.resize();
        postEffect.resize();
        renderBack1.setSize(document.body.clientWidth, window.innerHeight);
        renderer.setSize(document.body.clientWidth, window.innerHeight);

        if (document.body.clientWidth < window.innerHeight)
            bgImg.updateTex(images[1][0], images[1][1], images[1][2]);
        else
            bgImg.updateTex(images[0][0], images[0][1], images[0][2]);
    };

    const render = () => {
        const time = clock.getDelta();
        renderer.setRenderTarget(renderBack1);
        renderer.render(sceneBack, cameraBack);
        postEffect.render(time);
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
    };

    const renderLoop = () => {
        render();
        requestAnimationFrame(renderLoop);
    };
    const touchStart = (isTouched) => {
        isDrag = true;
    };
    const touchMove = (isTouched) => {
        if (isDrag) {}
    };
    const touchEnd = (isTouched) => {
        isDrag = false;
    };
    const on = () => {
        window.addEventListener('resize', debounce(() => {
            resizeWindow();
        }), 250);
        canvas.addEventListener('mousedown', (event) => {
            event.preventDefault();
            vectorTouchStart.set(event.clientX, event.clientY);
            normalizeVector2(vectorTouchStart);
            touchStart(false);
        });
        document.addEventListener('mousemove', (event) => {
            event.preventDefault();
            vectorTouchMove.set(event.clientX, event.clientY);
            normalizeVector2(vectorTouchMove);
            touchMove(false);
        });
        document.addEventListener('mouseup', (event) => {
            event.preventDefault();
            vectorTouchEnd.set(event.clientX, event.clientY);
            normalizeVector2(vectorTouchEnd);
            touchEnd(false);
        });
        canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            vectorTouchStart.set(event.touches[0].clientX, event.touches[0].clientY);
            normalizeVector2(vectorTouchStart);
            touchStart(event.touches[0].clientX, event.touches[0].clientY, true);
        });
        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            vectorTouchMove.set(event.touches[0].clientX, event.touches[0].clientY);
            normalizeVector2(vectorTouchMove);
            touchMove(true);
        });
        canvas.addEventListener('touchend', (event) => {
            event.preventDefault();
            vectorTouchEnd.set(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
            normalizeVector2(vectorTouchEnd);
            touchEnd(true);
        });
    };

    const init = () => {
        renderer.setSize(document.body.clientWidth, window.innerHeight);
        renderer.setClearColor(0x555555, 1.0);

        bgImg.init(() => {
            sceneBack.add(bgImg.obj);
            scene.add(postEffect.obj);
            on();
            resizeWindow();
            renderLoop();
        });

    };
    init();
}
