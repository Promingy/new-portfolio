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

loader.load('models/newTav.glb', function(tavern) {
  // tavern.scene.scale.set(100, 100, 100);
  tavern.scene.scale.set(25,25,25)
  tavern.scene.position.set(0, 0, 0)
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
camera.position.setZ(300);
camera.position.setY(100);

renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.maxDistance = 10;
// controls.minDistance = 5;
// controls.enablePan = false;
// controls.maxPolarAngle = Math.PI / 2;
// controls.minPolarAngle = Math.PI / 5;

const ambientLight = new Three.AmbientLight(0xffffff);
scene.add(ambientLight);

const pointLight = new Three.PointLight("orange");
pointLight.intensity = 5000;

const sphereSize = 10
const pointLightHelper = new Three.PointLightHelper(pointLight, sphereSize);
// 
scene.add(pointLight, pointLightHelper)

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
};

animate();
