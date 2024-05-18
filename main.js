import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './style.css'

let fire, mixer;

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

loader.load('models/animated_fire.glb', (gltf) => {
  gltf.scene.scale.set(25, 25, 25);
  fire = gltf.scene
  mixer = new Three.AnimationMixer(fire);
  mixer.clipAction(Three.AnimationUtils.subclip(gltf.animations[0], 'idle', 0, 221)).setDuration(6).play();
  mixer.clipAction(Three.AnimationUtils.subclip(gltf.animations[0], 'run', 222, 244)).setDuration(0.7).play();
  mixer._actions[0].enabled = true;
  mixer._actions[1].enabled = false;

  fire.position.set(-33.3, 0, -70);
   scene.add(fire);
})


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.lookAt(0, 0, 0);
camera.position.setZ(100);
camera.position.setY(50);
camera.position.setX(-100);


renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 300;
controls.minDistance = 150;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2.2;
controls.minPolarAngle = Math.PI / 5;

controls.maxAzimuthAngle = Math.PI / 10;
controls.minAzimuthAngle = -Math.PI / 1.65;

const pointLight = new Three.PointLight(0xF07F13);
const pointLight2 = pointLight.clone();
const pointLight3 = pointLight.clone();

pointLight.position.set(44, 50, 80);
pointLight.intensity = 500;

pointLight2.position.set(44, 50, -30);
pointLight2.intensity = 500;

pointLight3.position.set(-25, 50, -60);
pointLight3.intensity = 500;

const pointLight4 = pointLight.clone();
pointLight4.position.set(80, 50, 70);

const pointLight5 = pointLight4.clone();
pointLight5.position.set(80, 50, -20)

const  rectLight = new Three.RectAreaLight( "orange", 100, 20, 15);
rectLight.position.set(-33.5, 10, -73);
rectLight.rotateX(3.14);

scene.add(pointLight, pointLight2, pointLight3, rectLight);

// new directional light
const directionalLight = new Three.DirectionalLight("orange", .01);
directionalLight.position.set(0, 0, -200);
// directionalLight.position.set(-1000, 200, 1000);

// directionalLightHelper
const directionalLightHelper = new Three.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalLightHelper);

scene.add(directionalLight);

scene.background = new Three.Color(0xE1C699);


function animate() {
  requestAnimationFrame(animate);

  if (mixer) mixer.update(.05);
  
  controls.update();

  renderer.render(scene, camera);
};

animate();
