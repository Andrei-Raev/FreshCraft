import * as THREE from '/static/js/tree_js/three.module.min.js';
import {GLTFLoader} from '/static/js/tree_js/GLTFLoader.js';
import {EffectComposer} from '/static/js/tree_js/EffectComposer.js';
import {RenderPass} from '/static/js/tree_js/RenderPass.js';
import {ShaderPass} from '/static/js/tree_js/ShaderPass.js';
import {FXAAShader} from '/static/js/tree_js/FXAAShader.js';
import {UnrealBloomPass} from '/static/js/tree_js/UnrealBloomPass.js';

THREE.Cache.enabled = true;

// Scene setup
const flutter_scene = new THREE.Scene();
const flutter_size = [300, 300];
const new_canv = document.createElement('canvas');
new_canv.width = flutter_size[0];
new_canv.height = flutter_size[1];

const flutter_renderer = new THREE.WebGLRenderer({
    canvas: new_canv,
    alpha: true,
    antialias: true
});

// Append canvas to the DOM upon model rendering
let element = document.querySelector('.mascot');
if (element) {
    element.addEventListener('model_rendered', () => {
        element.firstChild.remove();
        element.appendChild(new_canv);
    });
} else {
    document.body.appendChild(new_canv);
    console.error('No element found');
}

// Renderer configuration
flutter_renderer.setSize(flutter_size[0], flutter_size[1]);
flutter_renderer.setPixelRatio(window.devicePixelRatio);
flutter_renderer.shadowMap.enabled = true;
flutter_renderer.shadowMap.type = THREE.PCFSoftShadowMap;
flutter_renderer.sortObjects = true;
flutter_renderer.outputEncoding = THREE.sRGBEncoding;
flutter_renderer.setClearColor(0x111111, 0.085);

// Lighting setup
const flutter_ambientLight = new THREE.AmbientLight(0xffffff);
flutter_scene.add(flutter_ambientLight);

const directionalLight = new THREE.DirectionalLight(0x9999ff, 5);
directionalLight.position.set(1, 0.83, -0.38).normalize();
flutter_scene.add(directionalLight);

// Function to set render order
function traverseScene(object) {
    object.traverse(child => {
        switch (child.name) {
            case 'right_petal':
                child.renderOrder = 1;
                break;
            case 'back_petal':
            case 'front_petal':
                child.renderOrder = 2;
                break;
            case 'left_petal':
                child.renderOrder = 3;
                break;
            default:
                child.renderOrder = 0;
        }
    });
}

// Declare mixer variable
let mixer;

// Loading model and setup
const flutter_loader = new GLTFLoader();
flutter_loader.load('/static/models/flutter/flutter.gltf', (gltf) => {
    const gltf_scene = gltf.scene;
    if (!gltf_scene) {
        console.error('GLTF file does not contain a scene.');
        return;
    }

    traverseScene(gltf_scene);
    flutter_scene.add(gltf_scene);

    const flutter_camera = gltf.cameras[0];
    flutter_camera.updateProjectionMatrix();

    // Post-processing setup
    const composer = new EffectComposer(flutter_renderer);
    composer.addPass(new RenderPass(flutter_scene, flutter_camera));

    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth * 2, 1 / window.innerHeight * 2);
    composer.addPass(effectFXAA);

    const unrealBloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
    );
    composer.addPass(unrealBloomPass);

    // Initialize mixer
    mixer = new THREE.AnimationMixer(gltf_scene);
    gltf.animations.forEach(clip => {
        mixer.clipAction(clip).play();
    });

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);

        composer.render();
    };

    animate();
    element.dispatchEvent(new CustomEvent('model_rendered'));
}, undefined, error => {
    console.error(error);
});
