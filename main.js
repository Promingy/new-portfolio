import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CameraControls from 'camera-controls';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { TransformControls } from 'three/examples/jsm/Addons.js';
import './style.css'

CameraControls.install ({THREE: Three})

// initialize animation variables
let firePlaceMixer, torchMixer, torchMixer2, torchMixer3, noticeBoard;
let sconeFlameMixer, sconeFlameMixer2, sconeFlameMixer3, sconeFlameMixer4;
let panCamera = true;


// instantiate scene, camera, and renderer
const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});


// set renderer properties
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = Three.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
scene.fog = new Three.Fog(0x000000, 100, 1200);


// set camera position
camera.position.set(-250, 200, 250);
// camera.position.set(0, 17, 200);


// instantiate transform controls
const tControls = new TransformControls(camera, renderer.domElement);
tControls.setMode('translate');


// set max anisotropy - improves texture quality ( we'll use this in the loader)
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();


// instantiate GLTFLoader - used to load 3D models - one linked to AWS the other for local files
// const loader = new GLTFLoader().setPath('https://glb-bucket-portfolio.s3.us-east-2.amazonaws.com/');
const loader = new GLTFLoader().setPath('models/');


// instantiate raycaster and mouse - to detect user clicks and move the camera to hotpoints
const raycaster = new Three.Raycaster();
const mouse = new Three.Vector2();
renderer.domElement.addEventListener('click', onDocumentMouseDown);



// instantiate camera controls - used to move the camera around the scene
// set cameraControls properties
const clock = new Three.Clock();
const cameraControls = new CameraControls(camera, renderer.domElement);
cameraControls.maxDistance = 400;
// cameraControls.maxDistance = 700;
cameraControls.minDistance = 170;
cameraControls.maxPolarAngle = Math.PI / 2;
cameraControls.truckSpeed = 0;
cameraControls.enabled = true;




// create a function loadModels, that goes through and loads all of our 3D models
function loadModels() {

  // load the Tavern
  loader.load('updated_tavern.glb', function(gltf) {
    const tavern = gltf.scene;

    // set tavern properties
    tavern.scale.set(25,25,25);
    tavern.position.set(0, 0, 0);

    tavern.traverse((child) => {
      if (child.isMesh) {
        child.material.side = Three.FrontSide;
        // child.material.metalness = 0;

        // filter out all of the lambert1 materials (sconces on the back of tavern)
        // and set them to receive and cast shadows
        if (!child.material.name.startsWith('lambert1') ){
          child.receiveShadow = true;
          child.castShadow = true;
        };
      };
    });

    scene.add(tavern);
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
    const fire = gltf.scene
    firePlaceMixer = new Three.AnimationMixer(fire);
    
    // set fire animation
    firePlaceMixer.clipAction(gltf.animations[0]).setDuration(1).play();

    // set fire properties
    fire.scale.set(13, 5, 10);
    fire.position.set(-34, 7, -70);

    scene.add(fire);
  })

  loader.load('animated_torch_flame1.glb', (gltf) => {
    // torch flames
    const torchFlame = gltf.scene;
    torchFlame.scale.set(4.5, 1.5, 4.5);


    const torchFlame2 = gltf.scene.clone();
    const torchFlame3 = gltf.scene.clone();

    //sconce flames
    const sconeFlame = gltf.scene.clone();
    sconeFlame.scale.set(4.5, 1.5, 4.5);

  
    const sconeFlame2 = gltf.scene.clone();
    const sconeFlame3 = gltf.scene.clone();
    const sconeFlame4 = gltf.scene.clone();


    // instantiate animation mixers for each flame
    torchMixer = new Three.AnimationMixer(torchFlame);
    torchMixer2 = new Three.AnimationMixer(torchFlame2);
    torchMixer3 = new Three.AnimationMixer(torchFlame3);

    // instantiate animation mixers for each flame
    sconeFlameMixer = new Three.AnimationMixer(sconeFlame);
    sconeFlameMixer2 = new Three.AnimationMixer(sconeFlame2);
    sconeFlameMixer3 = new Three.AnimationMixer(sconeFlame3);
    sconeFlameMixer4 = new Three.AnimationMixer(sconeFlame4);

    // set flame animations
    torchMixer.clipAction(gltf.animations[0]).setDuration(1).play();
    torchMixer2.clipAction(gltf.animations[0]).setDuration(1).play();
    torchMixer3.clipAction(gltf.animations[0]).setDuration(1).play();

    // set flame animations
    sconeFlameMixer.clipAction(gltf.animations[0]).setDuration(1).play();
    sconeFlameMixer2.clipAction(gltf.animations[0]).setDuration(1).play();
    sconeFlameMixer3.clipAction(gltf.animations[0]).setDuration(1).play();
    sconeFlameMixer4.clipAction(gltf.animations[0]).setDuration(1).play();


    // torch flame positions
    torchFlame.position.set(49, 53, 79);
    torchFlame2.position.set(49, 53, -30);
    torchFlame3.position.set(-26, 53, -66);
    
    //scone flame positions
    sconeFlame.position.set(65, 63, 120);
    sconeFlame2.position.set(65, 63, -70);
    sconeFlame3.position.set(53, 63, -83);
    sconeFlame4.position.set(-90, 63, -83);


    scene.add(torchFlame, torchFlame2, torchFlame3);
    scene.add(sconeFlame, sconeFlame2, sconeFlame3, sconeFlame4);
  })

  loader.load('bounty_board_w_resume.glb', (gltf) => {
    noticeBoard = gltf.scene;

    noticeBoard.traverse(child => {
        child.receiveShadow = true;
        child.castShadow = true;

        if (child.isMesh)
          child.material.map.anisotropy = maxAnisotropy;
    
    })


    noticeBoard.scale.set(10, 10, 10)
    // noticeBoard.position.set(-130, -5, -70)
    noticeBoard.position.set(52, -5, 150)
    noticeBoard.rotation.set(0, -1.575, 0)

    // tControls.attach(noticeBoard)
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

/// hotPoint Sphere
const hotPointGeo = new Three.SphereGeometry(5, 5, 5);
const hotPointMaterial = new Three.MeshBasicMaterial({color: 0xffffff});
const hotPoint = new Three.Mesh(hotPointGeo, hotPointMaterial);
hotPoint.position.set(52, 22, 177);
// tControls.attach(hotPoint);
scene.add(hotPoint);


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

scene.add(tControls);


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
  
  // if (tControls.dragging) {
  //   cameraControls.enabled = false;
  //   console.log('position', tControls.object.position);
  //   console.log('rotation', tControls.object.rotation);
  //   console.log('scale', tControls.object.scale);
  // } else {
  //   cameraControls.enabled = true;
  // }
  
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

  const noticeBoardIntersect = raycaster.intersectObject(noticeBoard, true);
  const sphereIntersect = raycaster.intersectObject(hotPoint, true);
  const intersect = raycaster.intersectObjects(scene.children, true);

  if (sphereIntersect.length || noticeBoardIntersect.length) {

    if (!panCamera) {
      cameraControls.enabled = true;
      panCamera = true;
      cameraControls.setLookAt(-250, 200, 250, 0, 0, 0, true);
    }else {
    cameraControls.enabled = false;
    panCamera = false;
    // const position = sphereIntersect[0].object.position;
    // const x = position.x; //52
    // const y = position.y - 6; //16
    // const z = position.z - 38; //139
    // cameraControls.setLookAt(x - 12, y, z, x, y, z, true);
    cameraControls.setLookAt(52 - 12, 16, 139, 52, 16, 139, true);
    // console.log(x, y, z)
    }
  }

  // make sure model clicked on is === test object
  // if (noticeBoardIntersect.length) {
  //   if (!panCamera) {
  //     panCamera = true;
  //     cameraControls.enabled = true;
  //     cameraControls.setLookAt(-250, 200, 250, 0, 0, 0, true);
  //   }

    // recurse and get the root parent
    // let cur = noticeBoardIntersect[0].object;

    // while(cur.parent.type !== 'Scene')
    //   cur = cur.parent;

    // console.log(cur)
  // }

  // if (intersect.length) {
  //   console.log(intersect[0].object);
  // }

}