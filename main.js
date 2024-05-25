import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CameraControls from 'camera-controls';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import './style.css'

CameraControls.install ({THREE: Three})

let fire, torchFlame, torchFlame2, torchFlame3, firePlaceMixer, torchMixer, torchMixer2, torchMixer3, noticeBoard;

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
const loader = new GLTFLoader().setPath('https://glb-bucket-portfolio.s3.us-east-2.amazonaws.com/');

const raycaster = new Three.Raycaster();
const mouse = new Three.Vector2();

renderer.domElement.addEventListener('click', onDocumentMouseDown);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = Three.PCFSoftShadowMap;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(100);
camera.position.setY(50);
camera.position.setX(-100);


renderer.render(scene, camera);

const clock = new Three.Clock();
const cameraControls = new CameraControls(camera, renderer.domElement);
// cameraControls.dollyInFixed(50, true);

/// Orbit Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.maxDistance = 700;
// controls.minDistance = 150;
// controls.enablePan = false;
// controls.maxPolarAngle = Math.PI / 2.2;
// controls.minPolarAngle = Math.PI / 5;
// controls.maxAzimuthAngle = Math.PI / 10;
// controls.minAzimuthAngle = -Math.PI / 1.65;




/// Load Models
loader.load('updated_tavern.glb', function(tavern) {

  tavern.scene.scale.set(25,25,25)
  tavern.scene.position.set(0, 0, 0)
  // set tavern material to frontSide
  tavern.scene.traverse((child) => {
    if (child.isMesh) {
      child.material.side = Three.FrontSide;
      child.material.metalness = 0
      child.receiveShadow = true;
      child.castShadow = true;
    }
  });
  scene.add(tavern.scene);
})
  
  
// loader.load('floating_island.glb', function(island) {

//   island.scene.position.set(-15, 2, 10)
//   island.scene.scale.set(20, 20, 20);
//   scene.add(island.scene);
// })
  
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


loader.load('animated_torch_flame1.glb', (gltf) => {
  fire = gltf.scene
  firePlaceMixer = new Three.AnimationMixer(fire);
  
  firePlaceMixer.clipAction(gltf.animations[0]).setDuration(3).play();

  fire.scale.set(13, 5, 10);
  fire.position.set(-34, 7, -70);
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

loader.load('lightpost.glb', (gltf) => {
  gltf.scene.scale.set(4.5, 4.5, 4.5);
  gltf.scene.position.set(-90, -5, 120)
  gltf.scene.rotation.set(0, 2.5, 0)
  scene.add(gltf.scene)
})

/// Mirror
const mirrorOptions = {
  clipBasis: .9, // default 0, limits reflection
  textureWidth: window.innerWidth * window.devicePixelRatio, // default 512, scales by pixel ratio of device
  textureHeight: window.innerHeight * window.devicePixelRatio, // default 512, scales by pixel ratio of device
  color: new Three.Color(0x7f7f7f), // default 0x7F7F7F
  multisample: 1, // default 4; type of antialiasing (improve quality)

  shader: Reflector.ReflectorShader, // default Reflector.ReflectorShader
}

const mirrorGeometry = new Three.PlaneGeometry(1000, 1000);
// New instance of reflector class
const mirror = new Reflector(mirrorGeometry, mirrorOptions);

mirror.rotation.x = -Math.PI / 2;
mirror.position.setY(-7);
scene.add(mirror)

/// floor
const floor = new Three.BoxGeometry(1000, 1, 1000);
const floorMaterial = new Three.MeshPhongMaterial({color: 0x474948, transparent: true, opacity: 0.75});
const floorMesh = new Three.Mesh(floor, floorMaterial);
floorMesh.position.setY(-7);
floorMesh.receiveShadow = true;
scene.add(floorMesh)


/// Interior Lights
const interiorWallLight = new Three.PointLight(0xF07F13, 2000);
interiorWallLight.castShadow = true;

interiorWallLight.shadow.mapSize.width = 512;
interiorWallLight.shadow.mapSize.height = 512;
interiorWallLight.shadow.camera.far = 1000;
interiorWallLight.shadow.camera.near = 0.1;

const interiorWallLight2 = interiorWallLight.clone();
const interiorWallLight3 = interiorWallLight.clone();

interiorWallLight.position.set(44, 50, 80);
interiorWallLight2.position.set(44, 50, -30);
interiorWallLight3.position.set(-25, 50, -60);

const firePlaceLight = new Three.PointLight( "orange", 2500, 0, 1.8);
firePlaceLight.position.set(-33.5, 10, -65);
firePlaceLight.rotateX(3.14);

firePlaceLight.castShadow = true;
firePlaceLight.shadow.mapSize.width = 512;
firePlaceLight.shadow.mapSize.height = 512;
firePlaceLight.shadow.camera.far = 1000;
firePlaceLight.shadow.camera.near = 0.1;

/// Exterior Lights
const sconceLight = interiorWallLight.clone();
const sconceLight2 = interiorWallLight.clone();
const sconceLight3 = interiorWallLight.clone();
const sconceLight4 = interiorWallLight.clone();

sconceLight.position.set(75, 63, 120);

const streetLight1 = new Three.PointLight(0xffd21c, 3000, 0, 2)
streetLight1.castShadow = true;

const streetLight2 = streetLight1.clone();

streetLight1.position.set(-98.5, 80, 114);
streetLight2.position.set(-82.5, 80, 127);


const lightHelper = new Three.PointLightHelper(sconceLight);


// moonLight
const moonLight = new Three.DirectionalLight(0x7f7f7f, .33);
moonLight.position.set(90, 300, -120)
scene.add(moonLight);


scene.add(interiorWallLight, interiorWallLight2, interiorWallLight3, firePlaceLight);
scene.add(sconceLight, sconceLight2, sconceLight3, sconceLight4, lightHelper);
scene.add(streetLight1, streetLight2)



function animate() {
  const delta = clock.getDelta();
  cameraControls.update(delta);
  requestAnimationFrame(animate);
  
  if (firePlaceMixer) firePlaceMixer.update(1/60);
  torchMixer && torchMixer.update(1/60);
  if (torchMixer2) torchMixer2.update(1/60);
  if (torchMixer3) torchMixer3.update(1/60);
  
  // controls.update();

  renderer.render(scene, camera);
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