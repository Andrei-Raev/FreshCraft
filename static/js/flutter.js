console.log('Hello, World!');
import * as THREE from '/static/js/tree_js/three.module.min.js';

import {GLTFLoader} from '/static/js/tree_js/GLTFLoader.js';
import {EffectComposer} from '/static/js/tree_js/EffectComposer.js';
import {RenderPass} from '/static/js/tree_js/RenderPass.js';
import {ShaderPass} from '/static/js/tree_js/ShaderPass.js';
import {FXAAShader} from '/static/js/tree_js/FXAAShader.js';

import {UnrealBloomPass} from '/static/js/tree_js/UnrealBloomPass.js';

THREE.Cache.enabled = true;

// Создание сцены
const flutter_scene = new THREE.Scene();
const flutter_size = [300, 300] //[Number(document.querySelector('.mascot').offsetWidth), Number(document.querySelector('.mascot').offsetHeight)];
const new_canv = document.createElement('canvas'); // new element('canvas').style.width = '300px';
new_canv.width = flutter_size[0];
new_canv.height = flutter_size[1];
const flutter_renderer = new THREE.WebGLRenderer({
    canvas: new_canv,
    alpha: true,
    antialias: true
});

let element = document.querySelector('.mascot');
if (element) {
    element.addEventListener('model_rendered', function () {
        element.firstChild.remove();
        element.appendChild(new_canv);
    });


} else {
    document.body.appendChild(new_canv);
    console.error('no element');
}

// Настройка рендера
flutter_renderer.setSize(flutter_size[0], flutter_size[1]);
flutter_renderer.setPixelRatio(window.devicePixelRatio);
flutter_renderer.shadowMap.enabled = true;
flutter_renderer.shadowMap.type = THREE.PCFSoftShadowMap;

flutter_renderer.sortObjects = true;
flutter_renderer.outputEncoding = THREE.sRGBEncoding;
flutter_renderer.setClearColor(0x111111, 0.085);


const flutter_ambientLight = new THREE.AmbientLight(0xffffff); // Общий свет
flutter_scene.add(flutter_ambientLight);


const directionalLight = new THREE.DirectionalLight(0x9999ff, 5); // Направленный свет
directionalLight.position.set(1, .83, -.38).normalize();
// directionalLight.shadow.mapSize.width = 2048; // Default is 512
// directionalLight.shadow.mapSize.height = 2048;
flutter_scene.add(directionalLight);
//
// const directionalLight2 = new THREE.DirectionalLight(0xFFF2B7, 1); // Направленный свет
// directionalLight2.position.set(-1.31215, .83, -.38).normalize();
// scene.add(directionalLight2);

// const directionalLight3 = new THREE.DirectionalLight(0x9999ff, 20); // Направленный свет
// directionalLight3.position.set(0, .3, 1).normalize();
// scene.add(directionalLight3);


// function setMaterialTransparent(object) {
//     if (object.material) {
//         if (Array.isArray(object.material)) {
//             object.material.forEach((material) => {
//                 if (material.map && material.map.format === THREE.RGBAFormat) {
//                     material.transparent = true;
//                 }
//             });
//         } else {
//             if (object.material.map && object.material.map.format === THREE.RGBAFormat) {
//                 object.material.transparent = true;
//             }
//         }
//     }
//
//     if (object.children) {
//         object.children.forEach((child) => {
//             setMaterialTransparent(child);
//         });
//     }
// }

// const composer = new EffectComposer(flutter_renderer);
// let renderPass;
//
// let fxaaPass;
let mixer;

function traverseScene(object) {
    object.traverse(function (child) {
        if (child.name === 'right_petal') {
            child.renderOrder = 1
        } else if (child.name === 'back_petal' || child.name === 'front_petal') {
            child.renderOrder = 2
        } else if (child.name === 'left_petal') {
            child.renderOrder = 3
        } else {
            child.renderOrder = 0
        }
        // console.log('Object:', child.name, 'Position:', child.layers);
    });
}


const flutter_loader = new GLTFLoader();
flutter_loader.load('/static/models/flutter/flutter.gltf', (gltf) => {
        const gltf_scene = gltf.scene;
        if (!gltf_scene) {
            console.error('GLTF file does not contain a scene.');
            return;
        }
        console.log('flutter_');
        console.log(gltf_scene);
        traverseScene(gltf_scene);

        // setMaterialTransparent(gltf_scene);

        flutter_scene.add(gltf_scene);
        // for (const child of gltf_scene.children) {
        //     if (child.isMesh) {
        //         setMaterialTransparent(child);
        //         flutter_scene.add(child);
        //         // console.log(child);
        //     }
        //
        //     if (child.isLight) {
        //         flutter_scene.add(child);
        //         console.log(child);
        //     }
        // }
        const flutter_camera = gltf.cameras[0];


        // renderPass = new RenderPass(flutter_scene, flutter_camera);
        // composer.addPass(renderPass);
        //
        // fxaaPass = new ShaderPass(FXAAShader);
        // fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        // composer.addPass(fxaaPass)

        // Настройка камеры
        flutter_camera.updateProjectionMatrix();

        const composer = new EffectComposer(flutter_renderer);
        composer.addPass(new RenderPass(flutter_scene, flutter_camera));

        const effectFXAA = new ShaderPass(FXAAShader);
        effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth * 2, 1 / window.innerHeight * 2);
        composer.addPass(effectFXAA);


        const unrealBloomPasss = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            .85 // threshold
        );
        composer.addPass(unrealBloomPasss);


        mixer = new THREE.AnimationMixer(gltf_scene);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });


// Анимация (если необходимо)
        const clock = new THREE.Clock();
        const animate = function () {

            requestAnimationFrame(animate);

            const delta = clock.getDelta();
            if (mixer) mixer.update(delta);

            // flutter_renderer.render(flutter_scene, flutter_camera);
            composer.render();
        };

        animate();
        element.dispatchEvent(new CustomEvent('model_rendered'));
    },
    undefined, (error) => {
        console.error(error);
    }
);
