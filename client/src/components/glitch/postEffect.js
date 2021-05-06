/* eslint-disable global-require */
const THREE = require('three');

export default class PostEffect {
    constructor(texture, imgW, imgH) {
        this.imageW = imgW;
        this.imageH = imgH;
        this.uniforms = {
            time: {
                type: 'f',
                value: 0
            },
            resolution: {
                type: 'v2',
                value: new THREE.Vector2(document.body.clientWidth, window.innerHeight)
            },
            texture: {
                type: 't',
                value: texture,
            },
        };
        this.obj = this.createObj();
    }
    getRatio() {
        let w; let h;
        if (document.body.clientWidth > window.innerHeight) {
            h = window.innerHeight;
            w = (h * this.imageW) / this.imageH;
        } else {
            w = document.body.clientWidth;
            h = (w * this.imageH) / this.imageW;
        }
        return [w, h];
    }
    createObj() {
        return new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.RawShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: document.getElementById('post-effect-vs').textContent,
                fragmentShader: document.getElementById('post-effect-fs').textContent
            })
        );
    }
    render(time) {
        this.uniforms.time.value += time;
    }
    resize() {
        this.uniforms.resolution.value.set(document.body.clientWidth, window.innerHeight);
    }
}
