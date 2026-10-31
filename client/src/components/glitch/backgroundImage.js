/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
import * as THREE from 'three';
import { backgroundVertex, backgroundFragment } from './shaders';

// const ratio = 2048 / 1152;

export default class BackgroundImage {
    constructor(url, w, h) {
        this.url = url;
        this.disposed = false;
        this.uniforms = {
            resolution: {
                type: 'v2',
                value: new THREE.Vector2(document.body.clientWidth, window.innerHeight),
            },
            imageResolution: {
                type: 'v2',
                value: new THREE.Vector2(w, h),
            },
            uTexture: {
                type: 't',
                value: null,
            },
        };
        this.obj = null;
    }
    init(callback) {
        const loader = new THREE.TextureLoader();
        loader.load(
            this.url,
            (tex) => {
                if (this.disposed) { tex.dispose(); return; }
                tex.magFilter = THREE.NearestFilter;
                tex.minFilter = THREE.NearestFilter;
                this.uniforms.uTexture.value = tex;
                this.obj = this.createObj();
                callback();
            }
        );
    }
    updateTex(url, w, h) {
        if (this.url !== url) {
            const loader = new THREE.TextureLoader();
            loader.load(
                url,
                (tex) => {
                    if (this.disposed) { tex.dispose(); return; }
                    this.url = url;
                    tex.magFilter = THREE.NearestFilter;
                    tex.minFilter = THREE.NearestFilter;
                    this.uniforms.uTexture.value?.dispose();
                    this.uniforms.uTexture.value = tex;
                    this.uniforms.imageResolution.value.set(w, h);
                    if (this.obj && this.obj.material)
                        this.obj.material.needsUpdate = true;
                }
            );
        }
    }
    createObj() {
        return new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.RawShaderMaterial({
                glslVersion: THREE.GLSL3,
                uniforms: this.uniforms,
                vertexShader: backgroundVertex,
                fragmentShader: backgroundFragment
            })
        );
    }
    dispose() {
        this.disposed = true;
        this.uniforms.uTexture.value?.dispose();
        this.obj?.geometry.dispose();
        this.obj?.material.dispose();
    }
    resize() {
        this.uniforms.resolution.value.set(document.body.clientWidth, window.innerHeight);
        // this.uniforms.imageResolution.value.set(document.body.clientWidth, parseFloat((document.body.clientWidth * 1152) / 2048));
    }
}
