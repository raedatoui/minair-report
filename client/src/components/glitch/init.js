import * as THREE from 'three';
import { CDN } from '../../constants';
import BackgroundImage from './backgroundImage';
import PostEffect from './postEffect';

const images = [
    [`${CDN}/media/minair.jpg`, 2048, 1152],
    [`${CDN}/media/minair-mb.jpg`, 828, 1792]
];

export default function init() {
    const canvas = document.getElementById('canvas-webgl');
    const renderer = new THREE.WebGLRenderer({ antialias: false, canvas });
    const renderTarget = new THREE.WebGLRenderTarget(document.body.clientWidth, window.innerHeight);
    const scene = new THREE.Scene();
    const background = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const backgroundCamera = new THREE.PerspectiveCamera(45, document.body.clientWidth / window.innerHeight, 1, 2);
    const timer = new THREE.Timer();
    timer.connect(document);
    const image = new BackgroundImage(...images[0]);
    const effect = new PostEffect(renderTarget.texture);
    let disposed = false;
    let frame = 0;

    const resize = () => {
        const width = document.body.clientWidth;
        const height = window.innerHeight;
        backgroundCamera.aspect = width / height;
        backgroundCamera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderTarget.setSize(width, height);
        image.resize();
        effect.resize();
        image.updateTex(...images[width < height ? 1 : 0]);
    };
    const render = () => {
        timer.update();
        renderer.setRenderTarget(renderTarget);
        renderer.render(background, backgroundCamera);
        effect.render(timer.getDelta());
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
    };
    renderer.setClearColor(0x555555, 1);
    image.init(() => {
        if (disposed) return;
        background.add(image.obj);
        scene.add(effect.obj);
        window.addEventListener('resize', resize);
        resize();
        render();
    });
    return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
        timer.dispose();
        image.dispose();
        effect.obj.geometry.dispose();
        effect.obj.material.dispose();
        renderTarget.dispose();
        renderer.dispose();
    };
}
