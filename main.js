import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './style.css'

let fire, torchFlame, torchFlame2, torchFlame3, firePlaceMixer, torchMixer, torchMixer2, torchMixer3;

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

const loader = new GLTFLoader();

loader.load('models/tavern.glb', function(tavern) {
  // tavern.scene.scale.set(100, 100, 100);
  tavern.scene.scale.set(25,25,25)
  tavern.scene.position.set(0, 0, 0)
  // set tavern material to frontSide
  tavern.scene.traverse((child) => {
    if (child.isMesh) {
      child.material.side = Three.FrontSide;
      child.material.metalness = 0
    }
  });
  scene.add(tavern.scene);
})

loader.load('models/floating_island.glb', function(island) {

  island.scene.position.set(-15, 2, 10)
  island.scene.scale.set(20, 20, 20);
  scene.add(island.scene);
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

loader.load('models/animated_torch_flame1.glb', (gltf) => {
  fire = gltf.scene
  firePlaceMixer = new Three.AnimationMixer(fire);
  
  firePlaceMixer.clipAction(gltf.animations[0]).setDuration(3).play();

  fire.scale.set(13, 5, 10);
  fire.position.set(-34, 7, -70);
  scene.add(fire);
})

loader.load('models/animated_torch_flame1.glb', (gltf) => {
  torchFlame = gltf.scene;
  torchFlame2 = gltf.scene.clone();
  torchFlame3 = gltf.scene.clone();

  torchMixer = new Three.AnimationMixer(torchFlame);
  torchMixer2 = new Three.AnimationMixer(torchFlame2);
  torchMixer3 = new Three.AnimationMixer(torchFlame3);

  torchMixer.clipAction(gltf.animations[0]).setDuration(1).play();
  torchMixer2.clipAction(gltf.animations[0]).setDuration(1).play();
  torchMixer3.clipAction(gltf.animations[0]).setDuration(1).play();


  torchFlame.position.set(49, 53, 79);
  torchFlame2.position.set(49, 53, -30);
  torchFlame3.position.set(-26, 53, -66);
  
  // size if using torchFlame1
  torchFlame.scale.set(4.5, 1.5, 4.5);
  torchFlame2.scale.set(4.5, 1.5, 4.5);
  torchFlame3.scale.set(4.5, 1.5, 4.5);
  scene.add(torchFlame, torchFlame2, torchFlame3);
})


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.lookAt(0, 0, 0);
camera.position.setZ(100);
camera.position.setY(50);
camera.position.setX(-100);


renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 700;
controls.minDistance = 150;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2.2;
controls.minPolarAngle = Math.PI / 5;
// controls.maxAzimuthAngle = Math.PI / 10;
// controls.minAzimuthAngle = -Math.PI / 1.65;

const pointLight = new Three.PointLight(0xF07F13);
const pointLight2 = pointLight.clone();
const pointLight3 = pointLight.clone();

pointLight.position.set(44, 50, 80);
pointLight.intensity = 1000;

pointLight2.position.set(44, 50, -30);
pointLight2.intensity = 1000;

pointLight3.position.set(-25, 50, -60);
pointLight3.intensity = 1000;


const  rectLight = new Three.RectAreaLight( "orange", 100, 20, 15);
rectLight.position.set(-33.5, 10, -73);
rectLight.rotateX(3.14);

var hemiLight = new Three.HemisphereLight( 0xffffff, 0x444444, .25);
hemiLight.position.set( 0, 300, 0 );


const directionalLight = new Three.DirectionalLight("orange", .5);
const directionLight2 = directionalLight.clone();
// directionalLight.position.set(0, 0, -200);
directionalLight.position.set(-1000, 500, 1000);
// directionLight2.position.set(1000, 250, -1000);


scene.add(directionalLight, directionLight2);
scene.add(pointLight, pointLight2, pointLight3, rectLight, hemiLight);

scene.background = new Three.Color(0xE1C699);


function animate() {
  requestAnimationFrame(animate);

  if (firePlaceMixer) firePlaceMixer.update(1/60);
  torchMixer && torchMixer.update(1/60);
  if (torchMixer2) torchMixer2.update(1/60);
  if (torchMixer3) torchMixer3.update(1/60);
  
  controls.update();

  renderer.render(scene, camera);
};

animate();
