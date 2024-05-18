import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

import './style.css'


const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

const loader = new GLTFLoader();

loader.load('models/newTav.glb', function(tavern) {
  // tavern.scene.scale.set(100, 100, 100);
  tavern.scene.scale.set(25,25,25)
  tavern.scene.position.set(0, 0, 0)
  // set tavern material to frontSide
  tavern.scene.traverse((child) => {
    if (child.isMesh) {
      child.material.side = Three.FrontSide;
    }
  });
  scene.add(tavern.scene);
})

// loader.load('models/medieval_book.glb', function(book) {
//   book.scene.scale.set(0.1, 0.1, 0.1);
//   book.scene.position.setY(10)
//   scene.add(book.scene);
// })
// loader.load('models/old_bookshelf.glb', function(bookshelf) {
//   bookshelf.scene.scale.set(3.4, 3, 3.4);
//   bookshelf.scene.position.set(2, 2.6, -10.9)
//   bookshelf.scene.rotation.set(0, -0.015, 0)
//   scene.add(bookshelf.scene);
// })
// loader.load('models/alchemists_manual.glb', function(manual) {
//   manual.scene.scale.set(100, 100, 100);
//   scene.add(manual.scene);
// })


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.lookAt(0, 0, 0);
camera.position.setZ(100);
camera.position.setY(50);
camera.position.setX(-100);


renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.maxDistance = 10;
// controls.minDistance = 5;
// controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2.2;
// controls.minPolarAngle = Math.PI / 5;

// const ambientLight = new Three.AmbientLight(0xffffff, .5);
// scene.add(ambientLight);

const pointLight = new Three.PointLight("orange");
const pointLight2 = pointLight.clone();
const pointLight3 = pointLight.clone();

pointLight.position.set(44, 50, 80);
pointLight.intensity = 1000;

pointLight2.position.set(44, 50, -30);
pointLight2.intensity = 1000;

pointLight3.position.set(-25, 50, -60);
pointLight3.intensity = 1000;

const pointLight4 = pointLight.clone();
pointLight4.position.set(80, 50, 70);

const pointLight5 = pointLight4.clone();
pointLight5.position.set(80, 50, -20)

const  rectLight = new Three.RectAreaLight( "orange", 1000, 20, 15);
rectLight.position.set(-33.5, 10, -73);
rectLight.rotateX(3.15);
rectLight.power = 100000;

const pointLightHelper = new Three.PointLightHelper(pointLight5, 1);

scene.add(pointLight, pointLight2, pointLight3, rectLight, pointLight4, pointLight5, pointLightHelper);

// // new directional light
// const directionalLight = new Three.DirectionalLight(0xffffff, 0.25);
// directionalLight.position.set(0, 0, -200);

// //directionalLightHelper
// const directionalLightHelper = new Three.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalLightHelper);

// scene.add(directionalLight);

scene.background = new Three.Color(0xE1C699);


function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
};

animate();
