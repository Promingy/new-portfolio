import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CameraControls from 'camera-controls';
import './style.css'

CameraControls.install ({THREE: Three})

let fire, torchFlame, torchFlame2, torchFlame3, firePlaceMixer, torchMixer, torchMixer2, torchMixer3, noticeBoard;

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
const textureLoader = new Three.TextureLoader();
const loader = new GLTFLoader().setPath('https://glb-bucket-portfolio.s3.us-east-2.amazonaws.com/');

const raycaster = new Three.Raycaster();
const mouse = new Three.Vector2();
renderer.domElement.addEventListener('click', onDocumentMouseDown)

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(100);
camera.position.setY(50);
camera.position.setX(-100);


renderer.render(scene, camera);

const clock = new Three.Clock();
const cameraControls = new CameraControls(camera, renderer.domElement);
cameraControls.dollyInFixed(50, true);

/// Orbit Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.maxDistance = 700;
// controls.minDistance = 150;
// controls.enablePan = false;
// controls.maxPolarAngle = Math.PI / 2.2;
// controls.minPolarAngle = Math.PI / 5;
// controls.maxAzimuthAngle = Math.PI / 10;
// controls.minAzimuthAngle = -Math.PI / 1.65;




/// Load Textures
const skybox = textureLoader.load('textures/testSkyBox.jpg');
scene.background = skybox


/// Load Models
loader.load('tavern.glb', function(tavern) {
  // tavern.scene.scale.set(100, 100, 100);'
  tavern.scene.scale.set(25,25,25)
  tavern.scene.position.set(0, 0, 0)
  // set tavern material to frontSide
  tavern.scene.traverse((child) => {
    if (child.isMesh) {
      child.material.side = Three.FrontSide;
      child.material.metalness = 0
    }
  });
  tavern.scene.receiveShadow = true;
  tavern.scene.castShadow = true;
  scene.add(tavern.scene);
})
  
  
loader.load('floating_island.glb', function(island) {

  island.scene.position.set(-15, 2, 10)
  island.scene.scale.set(20, 20, 20);
  scene.add(island.scene);
})
  
// loader.load('medieval_book.glb', function(book) {
//   book.scene.scale.set(1, 1, 1);
//   book.scene.position.setY(10)
//   scene.add(book.scene);
// })
// loader.load('old_bookshelf.glb', function(bookshelf) {
//   bookshelf.scene.scale.set(3.4, 3, 3.4);
//   bookshelf.scene.position.set(2, 2.6, -10.9)
//   bookshelf.scene.rotation.set(0, -0.015, 0)
//   scene.add(bookshelf.scene);
// })
// loader.load('alchemists_manual.glb', function(manual) {
//   manual.scene.scale.set(1000, 1000, 1000);
//   scene.add(manual.scene);
// })
// loader.load('medieval_notice_board.glb', (noticeBoard) => {
//   noticeBoard.scene.scale.set(10, 10, 10)
//   scene.add(noticeBoard.scene);
// })

loader.load('animated_torch_flame1.glb', (gltf) => {
  fire = gltf.scene
  firePlaceMixer = new Three.AnimationMixer(fire);
  
  firePlaceMixer.clipAction(gltf.animations[0]).setDuration(3).play();

  fire.scale.set(13, 5, 10);
  fire.position.set(-34, 7, -70);
  gltf.scene.castShadow = true
  scene.add(fire);
})

loader.load('animated_torch_flame1.glb', (gltf) => {
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

loader.load('medieval_notice_board.glb', (gltf) => {
  noticeBoard = gltf.scene;
  noticeBoard.scale.set(10, 10, 10)
  noticeBoard.position.set(-100, 0, 0)
  scene.add(noticeBoard);
})


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

// scene.background = new Three.Color(0xE1C699);




function animate() {
  const delta = clock.getDelta();
  const hasControlsUpdated = cameraControls.update(delta);
  requestAnimationFrame(animate);
  
  if (firePlaceMixer) firePlaceMixer.update(1/60);
  torchMixer && torchMixer.update(1/60);
  if (torchMixer2) torchMixer2.update(1/60);
  if (torchMixer3) torchMixer3.update(1/60);
  
  // controls.update();

  if (hasControlsUpdated) {
    renderer.render(scene, camera);
  }  
};

animate();



// helper function - raycasting
function onDocumentMouseDown(e) {
  e.preventDefault();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const noticeBoardIntersect = raycaster.intersectObject(noticeBoard, true);

  // make sure model clicked on is === test object
  if (noticeBoardIntersect.length) {
    // recurse and get the root parent
    let cur = noticeBoardIntersect[0].object;

    while(cur.parent.type !== 'Scene')
      cur = cur.parent;

    console.log(cur)
  }
}