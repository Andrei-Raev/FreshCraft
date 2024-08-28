import * as THREE from '/static/js/tree_js/three.module.min.js';
import {GLTFLoader} from '/static/js/tree_js/GLTFLoader.js';

const meshGroup = new THREE.Group();

// Scene setup
const scene = new THREE.Scene();
const size = [Number(document.querySelector('.test').offsetWidth), Number(document.querySelector('.test').offsetHeight)];

// Camera setup
const camera = new THREE.PerspectiveCamera(75, size[0] / size[1], 0.1, 1000);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.test'),
    alpha: true,
    antialias: true
});
renderer.setSize(size[0], size[1]);

// Light setup
const ambientLight = new THREE.AmbientLight(0x9A4DFF);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0x9999ff, 5);
directionalLight1.position.set(1, 0.83, -0.38).normalize();
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xFFF2B7, 1);
directionalLight2.position.set(-1.31215, 0.83, -0.38).normalize();
scene.add(directionalLight2);

// Recursive function to make materials transparent if they include an RGBA map
function setMaterialTransparent(object) {
    if (object.material) {
        if (Array.isArray(object.material)) {
            object.material.forEach(material => {
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
    // Traverse child objects
    if (object.children) {
        object.children.forEach(child => setMaterialTransparent(child));
    }
}

const mouse = new THREE.Vector2();

// Model loading
const loader = new GLTFLoader();
loader.load('/static/models/toolbox/test.gltf', (gltf) => {
    const gltf_scene = gltf.scene;

    if (!gltf_scene) {
        console.error('GLTF file does not contain a scene.');
        return;
    }

    gltf_scene.children.forEach(child => {
        if (child.isMesh) {
            setMaterialTransparent(child);
            meshGroup.add(child);
        }

        if (child.isLight) {
            scene.add(child);
        }
    });

    scene.add(meshGroup);

    const importedCamera = gltf.cameras.length > 0 ? gltf.cameras[0] : camera;
    importedCamera.aspect = size[0] / size[1];
    importedCamera.updateProjectionMatrix();

    // Linear interpolation function
    const lerp = (start, end, factor) => start + (end - start) * factor;

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);

        if (meshGroup) {
            const targetRotationY = (mouse.x * Math.PI) / 4;
            const targetRotationX = (mouse.y * Math.PI) / 8;

            meshGroup.rotation.y = lerp(meshGroup.rotation.y, targetRotationY, 0.1);
            meshGroup.rotation.x = lerp(meshGroup.rotation.x, targetRotationX, 0.1);
        }

        renderer.render(scene, importedCamera);
    };

    animate();
}, undefined, error => {
    console.error(error);
});

// Mouse move event handler
function onMouseMove(event) {
    const self_el = document.querySelector('.test');
    const rect = self_el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Convert cursor coordinates to normalized values
    mouse.x = ((event.clientX - centerX) / window.innerWidth) * 2;
    mouse.y = -((event.clientY - centerY) / window.innerHeight) * 2;
}

window.addEventListener('mousemove', onMouseMove, false);
