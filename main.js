import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CameraControls from 'camera-controls';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import './style.css'

CameraControls.install ({THREE: Three})

let fire, torchFlame, torchFlame2, torchFlame3, firePlaceMixer, torchMixer, torchMixer2, torchMixer3, noticeBoard;
let sconeFlame, sconeFlame2, sconeFlame3, sconeFlame4, sconeFlameMixer, sconeFlameMixer2, sconeFlameMixer3, sconeFlameMixer4;
let panCamera = true;

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
// const loader = new GLTFLoader().setPath('https://glb-bucket-portfolio.s3.us-east-2.amazonaws.com/');
const loader = new GLTFLoader().setPath('models/');

const raycaster = new Three.Raycaster();
const mouse = new Three.Vector2();

renderer.domElement.addEventListener('click', onDocumentMouseDown);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = Three.PCFSoftShadowMap;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(-250, 200, 250);

renderer.render(scene, camera);


scene.fog = new Three.Fog(0x000000, 100, 1200);

const clock = new Three.Clock();
const cameraControls = new CameraControls(camera, renderer.domElement);
cameraControls.maxDistance = 400;
// cameraControls.maxDistance = 700;
cameraControls.minDistance = 170;
cameraControls.maxPolarAngle = Math.PI / 2;
cameraControls.truckSpeed = 0;


/// Load Models
function loadModels() {
  loader.load('updated_tavern.glb', function(tavern) {

    tavern.scene.scale.set(25,25,25)
    tavern.scene.position.set(0, 0, 0)
    // set tavern material to frontSide
    tavern.scene.traverse((child) => {
      if (child.isMesh) {
        child.material.side = Three.FrontSide;
        child.material.metalness = 0

        if (!child.material.name.startsWith('lambert1') ){
          child.receiveShadow = true;
          child.castShadow = true;
        }
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
    
    firePlaceMixer.clipAction(gltf.animations[0]).setDuration(1).play();

    fire.scale.set(13, 5, 10);
    fire.position.set(-34, 7, -70);
    scene.add(fire);
  })

  loader.load('animated_torch_flame1.glb', (gltf) => {
    torchFlame = gltf.scene;
    torchFlame2 = gltf.scene.clone();
    torchFlame3 = gltf.scene.clone();

    //sconce flames
    sconeFlame = gltf.scene.clone();
    sconeFlame2 = gltf.scene.clone();
    sconeFlame3 = gltf.scene.clone();
    sconeFlame4 = gltf.scene.clone();

    torchMixer = new Three.AnimationMixer(torchFlame);
    torchMixer2 = new Three.AnimationMixer(torchFlame2);
    torchMixer3 = new Three.AnimationMixer(torchFlame3);

    sconeFlameMixer = new Three.AnimationMixer(sconeFlame);
    sconeFlameMixer2 = new Three.AnimationMixer(sconeFlame2);
    sconeFlameMixer3 = new Three.AnimationMixer(sconeFlame3);
    sconeFlameMixer4 = new Three.AnimationMixer(sconeFlame4);

    torchMixer.clipAction(gltf.animations[0]).setDuration(1).play();
    torchMixer2.clipAction(gltf.animations[0]).setDuration(1).play();
    torchMixer3.clipAction(gltf.animations[0]).setDuration(1).play();

    sconeFlameMixer.clipAction(gltf.animations[0]).setDuration(1).play();
    sconeFlameMixer2.clipAction(gltf.animations[0]).setDuration(1).play();
    sconeFlameMixer3.clipAction(gltf.animations[0]).setDuration(1).play();
    sconeFlameMixer4.clipAction(gltf.animations[0]).setDuration(1).play();


    torchFlame.position.set(49, 53, 79);
    torchFlame2.position.set(49, 53, -30);
    torchFlame3.position.set(-26, 53, -66);
    
    // size if using torchFlame1
    torchFlame.scale.set(4.5, 1.5, 4.5);
    torchFlame2.scale.set(4.5, 1.5, 4.5);
    torchFlame3.scale.set(4.5, 1.5, 4.5);

    //sconce flame size
    sconeFlame.scale.set(4.5, 1.5, 4.5);
    sconeFlame2.scale.set(4.5, 1.5, 4.5);
    sconeFlame3.scale.set(4.5, 1.5, 4.5);
    sconeFlame4.scale.set(4.5, 1.5, 4.5);

    //scone flame positions
    sconeFlame.position.set(65, 63, 120);
    sconeFlame2.position.set(65, 63, -70);
    sconeFlame3.position.set(53, 63, -83);
    sconeFlame4.position.set(-90, 63, -83);

    scene.add(torchFlame, torchFlame2, torchFlame3);
    
    scene.add(sconeFlame, sconeFlame2, sconeFlame3, sconeFlame4);
  })

  loader.load('medieval_notice_board.glb', (gltf) => {
    noticeBoard = gltf.scene;

    noticeBoard.traverse(child => {
        child.receiveShadow = true;
        child.castShadow = true;
    
    })

    noticeBoard.scale.set(10, 10, 10)
    // noticeBoard.position.set(-130, -5, -70)
    noticeBoard.position.set(52, -5, 150)
    noticeBoard.rotation.set(0, -1.575, 0)
    scene.add(noticeBoard);
  })

  loader.load('lightpost.glb', (gltf) => {
    gltf.scene.scale.set(4.5, 4.5, 4.5);
    gltf.scene.position.set(-90, -5, 120)
    gltf.scene.rotation.set(0, 2.5, 0)
    scene.add(gltf.scene)
  })
}

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


/// load Lights
function loadLights() {
  /// interior lights
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

  sconceLight.decay = 1.5;
  sconceLight2.decay = 1.5;
  sconceLight3.decay = 1.5;
  sconceLight4.decay = 1.5;
  
  sconceLight.position.set(65, 63, 120);
  sconceLight2.position.set(65, 63, -70);
  sconceLight3.position.set(53, 63, -83);
  sconceLight4.position.set(-90, 63, -83)
  
  const streetLight1 = new Three.PointLight(0xffd21c, 3000, 0, 1.7)
  streetLight1.castShadow = true;
  
  const streetLight2 = streetLight1.clone();
  
  streetLight1.position.set(-98.5, 80, 114);
  streetLight2.position.set(-82.5, 80, 127);
  
  
  const lightHelper = new Three.PointLightHelper(sconceLight4);
  
  
  // moonLight
  const moonLight = new Three.DirectionalLight(0x7f7f7f, .5);
  moonLight.position.set(90, 300, -120)
  scene.add(moonLight);
  
  
  scene.add(interiorWallLight, interiorWallLight2, interiorWallLight3, firePlaceLight);
  scene.add(sconceLight, sconceLight2, sconceLight3, sconceLight4);
  scene.add(streetLight1, streetLight2)
}


loadModels();
loadLights();
animate();
function animate() {
  const delta = clock.getDelta();
  cameraControls.update(delta);
  requestAnimationFrame(animate);
  
  if (firePlaceMixer) firePlaceMixer.update(1/60);
  if (torchMixer) torchMixer.update(1/60);
  if (torchMixer2) torchMixer2.update(1/60);
  if (torchMixer3) torchMixer3.update(1/60);

  if (sconeFlameMixer) sconeFlameMixer.update(1/60);
  if (sconeFlameMixer2) sconeFlameMixer2.update(1/60);
  if (sconeFlameMixer3) sconeFlameMixer3.update(1/60);
  if (sconeFlameMixer4) sconeFlameMixer4.update(1/60);
  
  // controls.update();

  // if test is true camera will pan around the scene
  if (panCamera) {
    // cameraControls.truck(-0.1);
    cameraControls.rotate(0.002, 0);
  }
  
  renderer.render(scene, camera);
};


// helper function - raycasting
function onDocumentMouseDown(e) {
  e.preventDefault();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // const noticeBoardIntersect = raycaster.intersectObject(noticeBoard, true);
  const intersect = raycaster.intersectObjects(scene.children, true);

  // make sure model clicked on is === test object
  // if (noticeBoardIntersect.length) {
  //   // recurse and get the root parent
  //   let cur = noticeBoardIntersect[0].object;

  //   while(cur.parent.type !== 'Scene')
  //     cur = cur.parent;

  //   console.log(cur)
  // }

  // if (intersect.length) {
  //   console.log(intersect[0].object);
  // }

}