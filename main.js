import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './style.css'


const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

const loader = new GLTFLoader();

loader.load('models/tavern.glb', function(tavern) {
  tavern.scene.scale.set(50, 50, 50);
  scene.add(tavern.scene);
}, undefined, function(error){
  console.error(error);
})

loader.load('models/medieval_book.glb', function(book) {
  book.scene.scale.set(0.1, 0.1, 0.1);
  scene.add(book.scene);
}, undefined, function(error){
  console.error(error);
})
loader.load('models/old_bookshelf.glb', function(bookshelf) {
  bookshelf.scene.scale.set(3.4, 3, 3.4);
  bookshelf.scene.position.set(2, 2.6, -10.9)
  bookshelf.scene.rotation.set(0, -0.015, 0)
  scene.add(bookshelf.scene);
}, undefined, function(error){
  console.error(error);
})
loader.load('models/alchemists_manual.glb', function(manual) {
  manual.scene.scale.set(100, 100, 100);
  scene.add(manual.scene);
}, undefined, function(error){
  console.error(error);
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setY(10);

renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 10;
// controls.minDistance = 5;
// controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2;

const ambientLight = new Three.AmbientLight(0xffffff);
scene.add(ambientLight);

const pointLight = new Three.PointLight(0xee9911);
pointLight.position.set(0, 5, 0);
pointLight.intensity = 15;

const sphereSize = 1
const pointLightHelper = new Three.PointLightHelper(pointLight, sphereSize);

scene.add(pointLight, pointLightHelper)

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
};

animate();
