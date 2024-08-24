import * as THREE from '/static/js/tree_js/three.module.min.js';
import {GLTFLoader} from '/static/js/tree_js/GLTFLoader.js';

const meshGroup = new THREE.Group();

// Функция для извлечения и добавления объектов типа Mesh в группу


// Создание сцены
const scene = new THREE.Scene();
const size = [Number(document.querySelector('.test').offsetWidth), Number(document.querySelector('.test').offsetHeight)];
// Создание камеры
const camera = new THREE.PerspectiveCamera(75, size[0] / size[1], 0.1, 1000);
// camera.position.z = 5;

// Создание рендера
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('.test'), alpha: true, antialias: true});
renderer.setSize(size[0], size[1]);

// Добавление света
const ambientLight = new THREE.AmbientLight(0x9A4DFF); // Общий свет
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x9999ff, 5); // Направленный свет
directionalLight.position.set(1, .83, -.38).normalize();
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xFFF2B7, 1); // Направленный свет
directionalLight2.position.set(-1.31215, .83, -.38).normalize();
scene.add(directionalLight2);

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
    // Для комплексных объектов, проходим по вложенным дочерним элементам
    if (object.children) {
        object.children.forEach((child) => {
            setMaterialTransparent(child);
        });
    }
}

const mouse = new THREE.Vector2();
// Загрузка модели
const loader = new GLTFLoader();
loader.load('/static/models/toolbox/test.gltf', (gltf) => {
    const gltf_scene = gltf.scene;
    if (!gltf_scene) {
        console.error('GLTF file does not contain a scene.');
        return;
    }

    // console.log(gltf_scene);
    for (const child of gltf_scene.children) {
        if (child.isMesh) {
            setMaterialTransparent(child);
            meshGroup.add(child);
            // console.log(child);
        }

        if (child.isLight) {
            scene.add(child);
            // console.log(child);
        }
    }


    scene.add(meshGroup);

    // scene.add(meshGroup);
    const importedCamera = gltf.cameras.length > 0 ? gltf.cameras[0] : camera;

    // Настройка камеры
    importedCamera.aspect = size[0] / size[1];
    importedCamera.updateProjectionMatrix();

    const lerp = (start, end, factor) => {
        return start + (end - start) * factor;
    };
    // Анимация (если необходимо)
    const animate = function () {
        requestAnimationFrame(animate);

        // Какая-то анимация, если нужно
        // gltf.scene.rotation.y += 0.01;
        // meshGroup.rotation.y += 0.002;
        if (meshGroup) {
            const targetRotationY = (mouse.x * Math.PI) / 4;
            const targetRotationX = (mouse.y * Math.PI) / 8;

            // Плавное изменение
            meshGroup.rotation.y = lerp(meshGroup.rotation.y, targetRotationY, 0.1);
            meshGroup.rotation.x = lerp(meshGroup.rotation.x, targetRotationX, 0.1);

        }

        renderer.render(scene, importedCamera);
    };

    animate();
}, undefined, (error) => {
    console.error(error);
});

function onMouseMove(event) {
    const self_el = document.querySelector('.test');
    const rect = self_el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // console.log(event.clientX - centerX, event.clientY - centerY);
    // Преобразуем координаты курсора в нормализованные значения
    mouse.x = ((event.clientX - centerX) / window.innerWidth) * 2;
    mouse.y = -((event.clientY - centerY) / window.innerHeight) * 2;
}

// Добавляем слушатель события движения мыши
window.addEventListener('mousemove', onMouseMove, false);
