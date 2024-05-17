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

// loader.load('models/tavern.glb', function(tavern) {
//   tavern.scene.scale.set(50, 50, 50);
//   scene.add(tavern.scene);
// }, undefined, function(error){
//   console.error(error);
// })

// loader.load('models/medieval_book.glb', function(book) {
//   book.scene.scale.set(0.1, 0.1, 0.1);
//   scene.add(book.scene);
// }, undefined, function(error){
//   console.error(error);
// })
// loader.load('models/old_bookshelf.glb', function(book) {
//   book.scene.scale.set(0.1, 0.1, 0.1);
//   scene.add(book.scene);
// }, undefined, function(error){
//   console.error(error);
// })
loader.load('models/alchemists_manual.glb', function(book) {
  book.scene.scale.set(100, 100, 100);
  scene.add(book.scene);
}, undefined, function(error){
  console.error(error);
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setY(10);

renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new Three.AmbientLight(0xffffff);
scene.add(ambientLight);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
};

animate();