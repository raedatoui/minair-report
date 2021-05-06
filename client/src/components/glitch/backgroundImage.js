/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
const THREE = require('three');

// const ratio = 2048 / 1152;

export default class BackgroundImage {
    constructor(url, w, h) {
        this.url = url;
        this.uniforms = {
            resolution: {
                type: 'v2',
                value: new THREE.Vector2(document.body.clientWidth, window.innerHeight),
            },
            imageResolution: {
                type: 'v2',
                value: new THREE.Vector2(w, h),
            },
            texture: {
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
                tex.magFilter = THREE.NearestFilter;
                tex.minFilter = THREE.NearestFilter;
                this.uniforms.texture.value = tex;
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
                    this.url = url;
                    tex.magFilter = THREE.NearestFilter;
                    tex.minFilter = THREE.NearestFilter;
                    this.uniforms.texture.value = tex;
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
                uniforms: this.uniforms,
                vertexShader: document.getElementById('background-image-vs').textContent,
                fragmentShader: document.getElementById('background-image-fs').textContent
            })
        );
    }
    resize() {
        this.uniforms.resolution.value.set(document.body.clientWidth, window.innerHeight);
        // this.uniforms.imageResolution.value.set(document.body.clientWidth, parseFloat((document.body.clientWidth * 1152) / 2048));
    }
}
