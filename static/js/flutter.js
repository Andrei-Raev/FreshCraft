import * as THREE from '/static/js/tree_js/three.module.min.js';
import {GLTFLoader} from '/static/js/tree_js/GLTFLoader.js';

import {EffectComposer} from '/static/js/tree_js/EffectComposer.js';
import {RenderPass} from '/static/js/tree_js/RenderPass.js';
import {ShaderPass} from '/static/js/tree_js/ShaderPass.js';
import {FXAAShader} from '/static/js/tree_js/FXAAShader.js';
import {CopyShader} from "/static/js/tree_js/CopyShader.js";
import {LuminosityHighPassShader} from "./tree_js/LuminosityHighPassShader.js";
import {UnrealBloomPass} from '/static/js/tree_js/UnrealBloomPass.js';
import {ColorCorrectionShader} from '/static/js/tree_js/ColorCorrectionShader.js';

// Создание сцены
const flutter_scene = new THREE.Scene();
const flutter_size = [Number(document.querySelector('.mascot').offsetWidth), Number(document.querySelector('.mascot').offsetHeight)];
const flutter_renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.mascot'),
    alpha: true,
    antialias: true
});
flutter_renderer.setSize(flutter_size[0], flutter_size[1]);
flutter_renderer.setPixelRatio(window.devicePixelRatio);
flutter_renderer.shadowMap.enabled = true;
flutter_renderer.shadowMap.type = THREE.PCFSoftShadowMap;

flutter_renderer.sortObjects = true;
flutter_renderer.outputEncoding = THREE.sRGBEncoding;
flutter_renderer.setClearColor(0x111111, 0.085);


const flutter_ambientLight = new THREE.AmbientLight(0xffffff); // Общий свет
flutter_scene.add(flutter_ambientLight);

// Создание камеры
// const camera = new THREE.PerspectiveCamera(75, size[0] / size[1], 0.1, 1000);

// camera.position.z = 5;
// Создание рендера
// Добавление света

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


function setMaterialTransparent(object) {
    if (object.material) {
        if (Array.isArray(object.material)) {
            object.material.forEach((material) => {
                if (material.map && material.map.format === THREE.RGBAFormat) {
                    material.transparent = true;
                }
            });
        } else {
            if (object.material.map && object.material.map.format === THREE.RGBAFormat) {
                object.material.transparent = true;
            }
        }
    }

    if (object.children) {
        object.children.forEach((child) => {
            setMaterialTransparent(child);
        });
    }
}

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


        // scene.add(meshGroup);

        // scene.add(meshGroup);
        const flutter_camera = gltf.cameras[0];


        // renderPass = new RenderPass(flutter_scene, flutter_camera);
        // composer.addPass(renderPass);
        //
        // fxaaPass = new ShaderPass(FXAAShader);
        // fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        // composer.addPass(fxaaPass)

        // Настройка камеры
        flutter_camera.updateProjectionMatrix();

        // const lerp = (start, end, factor) => {
        //     return start + (end - start) * factor;
        // };


        const composer = new EffectComposer(flutter_renderer);
        composer.addPass(new RenderPass(flutter_scene, flutter_camera));

        const effectFXAA = new ShaderPass(FXAAShader);
        effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth * 2, 1 / window.innerHeight * 2);
        composer.addPass(effectFXAA);


        // const copyShader = new ShaderPass(CopyShader);
        // copyShader.renderToScreen = true;
        //
        // const highPassFilter = new ShaderPass(LuminosityHighPassShader);
        // highPassFilter.uniforms['luminosityThreshold'].value = 0.5;
        // composer.addPass(highPassFilter);
        //
        // composer.addPass(copyShader);


        const unrealBloomPasss = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            .85 // threshold
        );
        composer.addPass(unrealBloomPasss);

        // const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
        // // colorCorrectionPass.uniforms['powRGB'].value.set(1, 1, 1); // Увеличение контрастности
        // colorCorrectionPass.uniforms['mulRGB'].value.set(1, 1, 1); // Увеличение насыщенности
        // colorCorrectionPass.renderToScreen = true;
        // composer.addPass(colorCorrectionPass);


        mixer = new THREE.AnimationMixer(gltf_scene);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });


// Анимация (если необходимо)
        const clock = new THREE.Clock();
        const animate = function () {
            // requestAnimationFrame(animate);

            // Какая-то анимация, если нужно
            // gltf.scene.rotation.y += 0.01;
            // meshGroup.rotation.y += 0.002;
            // if (meshGroup) {
            //     const targetRotationY = (mouse.x * Math.PI) / 4;
            //     const targetRotationX = (mouse.y * Math.PI) / 8;
            //
            //     // Плавное изменение
            //     meshGroup.rotation.y = lerp(meshGroup.rotation.y, targetRotationY, 0.1);
            //     meshGroup.rotation.x = lerp(meshGroup.rotation.x, targetRotationX, 0.1);
            //
            // }

            requestAnimationFrame(animate);

            const delta = clock.getDelta();
            if (mixer) mixer.update(delta);

            // flutter_renderer.render(flutter_scene, flutter_camera);
            composer.render();
        };

        animate();
    },
    undefined, (error) => {
        console.error(error);
    }
)
;

// function onMouseMove(event) {
//     const self_el = document.querySelector('.test');
//     const rect = self_el.getBoundingClientRect();
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;
//     // console.log(event.clientX - centerX, event.clientY - centerY);
//     // Преобразуем координаты курсора в нормализованные значения
//     mouse.x = ((event.clientX - centerX) / window.innerWidth) * 2;
//     mouse.y = -((event.clientY - centerY) / window.innerHeight) * 2;
// }
//
// // Добавляем слушатель события движения мыши
// window.addEventListener('mousemove', onMouseMove, false);
