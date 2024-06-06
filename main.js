import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CameraControls from 'camera-controls';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { TransformControls } from 'three/examples/jsm/Addons.js';
import loadLights from './textures/lights';
import './style.css'

CameraControls.install ({THREE: Three})

// initialize animation variables
let firePlaceMixer, torchMixer;
let tavern, noticeBoard, resumeSign, pileOfBooks, secondPileOfBooks, timeout;
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
camera.position.set(-200, 175, 200);


// instantiate transform controls
const tControls = new TransformControls(camera, renderer.domElement);
tControls.setMode('translate');


// set max anisotropy - improves texture quality ( we'll use this in the loader)
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();


// instantiate GLTFLoader - used to load 3D models - one linked to AWS the other for local files
// const loader = new GLTFLoader().setPath('https://glb-bucket-portfolio.s3-accelerate.amazonaws.com/');
const loader = new GLTFLoader().setPath('models/');

const imageLoader = new Three.ImageLoader().setPath('https://glb-bucket-portfolio.s3-accelerate.amazonaws.com/');
// const imageLoader = new Three.ImageLoader().setPath('https://glb-bucket-portfolio.s3.us-east-2.amazonaws.com/');


// instantiate raycaster and mouse - to detect user clicks and move the camera to hotpoints
const raycaster = new Three.Raycaster();
const mouse = new Three.Vector2();
renderer.domElement.addEventListener('click', onDocumentMouseDown);
renderer.domElement.addEventListener('mousemove', onHover)



// instantiate camera controls - used to move the camera around the scene
// set cameraControls properties
const clock = new Three.Clock();
const cameraControls = new CameraControls(camera, renderer.domElement);
cameraControls.maxDistance = 333;
// cameraControls.maxDistance = 700;
cameraControls.minDistance = 170;
cameraControls.maxPolarAngle = Math.PI / 2;
cameraControls.truckSpeed = 0;
cameraControls.enabled = true;
cameraControls.smoothTime = .5;
cameraControls.addEventListener('control', () => {
    panCamera = false;
    clearTimeout(timeout);

    timeout = setTimeout(toggleCamera, 10000)
    return;
})



imageLoader.load('ainsworth_corbin_resume.png', (image) => {
  const plane = new Three.PlaneGeometry(100, 100);
  const texture = new Three.CanvasTexture(image);
  const material = new Three.MeshStandardMaterial({map: texture});
  const mesh = new Three.Mesh(plane, material);

  mesh.position.set(50.4, 15.75, 140.9);
  mesh.scale.set(.113, .14, .1);
  mesh.rotation.set(.075, -1.575, 0);

  mesh.traverse(child => {
    child.receiveShadow = true;

    if (child.isMesh){
      child.material.map.emissive = 0xffffff;
      child.material.map.anisotropy = maxAnisotropy;
      child.material.map.minFilter = Three.LinearFilter;
    }
  })

  scene.add(mesh);
})

// create a function loadModels, that goes through and loads all of our 3D models
function loadModels() {


  // load the Tavern
  // loader.load('test.glb', function(gltf) {
  loader.load('updated_tavern.glb', function(gltf) {
    tavern = gltf.scene;

    // set tavern properties
    tavern.scale.set(25,25,25);
    tavern.position.set(0, 0, 0);

    tavern.traverse((child) => {
      if (child.isMesh) {
        child.material.side = Three.FrontSide;
        
        if (child.material.map) {
          child.material.map.anisotropy = maxAnisotropy;
          child.material.map.minFilter = Three.NearestFilter;
          child.material.map.magFilter = Three.NearestFilter;
        }

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

  loader.load('updated_resume_sign.glb', function(gltf) {
    resumeSign = gltf.scene
    resumeSign.position.set(54, 40, 145)
    resumeSign.rotation.set(0, 1.575, 0)
    resumeSign.scale.set(10, 12, 12)

    resumeSign.traverse(child => {
      child.receiveShadow = true;
      child.castShadow = true;
      if (child.mesh) {
        child.material.side = Three.FrontSide;
      }
    })

    // tControls.attach(sign)
    scene.add(resumeSign)
  })

    loader.load('resume_letters.glb', function(gltf){
      const letters = gltf.scene;
      letters.position.set(54, 40, 145)
      letters.rotation.set(0, 1.575, 0)
      letters.scale.set(10, 12, 12)

      letters.traverse(child => {
        // child.receiveShadow = true;
        child.castShadow = true;

        if (child.isMesh){
          child.material.side = Three.FrontSide;
        }
      })

      scene.add(letters);
    
    })
  loader.load('medieval_book_stack.glb', function(gltf) {
    const bookStack = gltf.scene;
    bookStack.scale.set(.33, .33, .33);
    bookStack.position.set(22, 23.6, 70)
    bookStack.rotation.set(0, -2.5, 0)

    bookStack.traverse(child => {
      child.receiveShadow = true;
      child.castShadow = true;

      if (child.isMesh){
        child.material.map.anisotropy = maxAnisotropy;
        child.material.map.minFilter = Three.NearestFilter;
        child.material.map.magFilter = Three.NearestFilter;
      }
    })

    // tControls.attach(bookStack)
    scene.add(bookStack);
  })


  loader.load('animated_torch_flame1.glb', (gltf) => {
    const fire = gltf.scene
    firePlaceMixer = new Three.AnimationMixer(fire);
    
    // set fire animation
    firePlaceMixer.clipAction(gltf.animations[0]).setDuration(1).play();

    // set fire properties
    fire.scale.set(13, 5, 10);
    fire.position.set(-34, 7, -70);

    // fire.traverse(child => {
    //   child.receiveShadow = true;
    //   child.castShadow = true;
    // });

    scene.add(fire);
  })

  loader.load('animated_torch_flame1.glb', (gltf) => {
    
    gltf.scene.scale.set(4.5, 1.5, 4.5);
    
    // torch flames
    const torchFlame = gltf.scene;
    const torchFlame2 = gltf.scene.clone();
    const torchFlame3 = gltf.scene.clone();
    
    //sconce flames
    const sconeFlame = gltf.scene.clone();
    const sconeFlame2 = gltf.scene.clone();
    const sconeFlame3 = gltf.scene.clone();
    const sconeFlame4 = gltf.scene.clone();
    
    
    let flameAnimations = new Three.AnimationObjectGroup;
    flameAnimations.add(torchFlame, torchFlame2, torchFlame3);
    flameAnimations.add(sconeFlame, sconeFlame2, sconeFlame3, sconeFlame4);


    torchMixer = new Three.AnimationMixer(flameAnimations);
    torchMixer.clipAction(gltf.animations[0]).setDuration(1).play();


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

  // loader.load('test_board.glb', (gltf) => {
  loader.load('bounty_board_w_resume.glb', (gltf) => {
    noticeBoard = gltf.scene;

    noticeBoard.traverse(child => {
        child.receiveShadow = true;
        child.castShadow = true;
        
        if (child.isMesh){
          child.material.color.set(0xbcbcbc);
          child.material.map.anisotropy = maxAnisotropy;
          child.material.map.minFilter = Three.NearestFilter;
          child.material.map.magFilter = Three.NearestFilter;
        }
    
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

    gltf.scene.traverse(child => {
      child.receiveShadow = true;
      child.castShadow = true;
    })
    scene.add(gltf.scene)
  })

  loader.load('pile_of_books.glb', (gltf) => {
    pileOfBooks = gltf.scene;

    pileOfBooks.scale.set(.15, .15, .15);
    pileOfBooks.rotation.set(-1.6, -1.5, 0);
    pileOfBooks.position.set(48, 51.75, -14.4)

    pileOfBooks.traverse(child => {
      child.receiveShadow = true;
      child.castShadow = true;

      if (child.isMesh){
        child.material.map.anisotropy = maxAnisotropy;
        child.material.map.minFilter = Three.LinearFilter;
        child.material.map.magFilter = Three.LinearFilter;
        child.material.side = Three.FrontSide;
      }
    })

    scene.add(pileOfBooks);
  })

  loader.load('second_pile_of_books.glb', (gltf) => {
    secondPileOfBooks = gltf.scene;

    secondPileOfBooks.scale.set(.15, .15, .15);
    secondPileOfBooks.rotation.set(-1.6, -1.5, 0);
    secondPileOfBooks.position.set(48, 51.75, -8);

    secondPileOfBooks.traverse(child => {
      child.receiveShadow = true;
      child.castShadow = true;
      
      if (child.isMesh){
        child.material.map.anisotropy = maxAnisotropy;
        child.material.map.minFiler = Three.LinearFilter;
        child.material.map.magFilter = Three.LinearFilter;
        child.material.side = Three.FrontSide;
      }
    })

    scene.add(secondPileOfBooks);
  })
}



// /// Mirror
const mirrorOptions = {
  // clipBasis: 0.75, // default 0, limits reflection
  // textureWidth: window.innerWidth * window.devicePixelRatio, // default 512, scales by pixel ratio of device
  // textureHeight: window.innerHeight * window.devicePixelRatio, // default 512, scales by pixel ratio of 
}

const mirrorGeometry = new Three.PlaneGeometry(750, 750);
const mirror = new Reflector(mirrorGeometry);

mirror.rotation.x = -Math.PI / 2;
mirror.position.setY(-8);
scene.add(mirror)


const floor = new Three.PlaneGeometry(1000, 1000);
const floorMaterial = new Three.MeshStandardMaterial({color:0x474948, roughness: 0.5, opacity: 0.85, transparent: true});
const floorMesh = new Three.Mesh(floor, floorMaterial);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.position.setY(-7);
floorMesh.receiveShadow = true;
scene.add(floorMesh);


/// hotPoint Sphere
const hotPointGeo = new Three.SphereGeometry(5, 5, 5);
const hotPointMaterial = new Three.MeshBasicMaterial({color: 0xffffff});
const hotPoint = new Three.Mesh(hotPointGeo, hotPointMaterial);
hotPoint.position.set(52, 22, 177);

const hotPoint2 = hotPoint.clone();
hotPoint2.position.set(13, 35, -70);
// tControls.attach(hotPoint2)
scene.add(hotPoint2);

const hotPoint3 = hotPoint.clone();
hotPoint3.position.set(48, 53, 10);
scene.add(hotPoint3);


scene.add(loadLights())
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

  if (tControls.dragging){
    panCamera = false;
    clearTimeout(timeout);
    cameraControls.enabled = false
    console.log(tControls.scale)
    console.log(tControls.position)
    console.log(tControls.rotation)
  }
  else {
    cameraControls.enabled = true;
  }
  

  if (panCamera) {
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

  if (!noticeBoard || !resumeSign || !pileOfBooks || !secondPileOfBooks || !tavern) return;
 
  const noticeBoardIntersect = raycaster.intersectObjects([noticeBoard, resumeSign], true);
  const pileOfBooksIntersect = raycaster.intersectObjects([pileOfBooks, secondPileOfBooks, hotPoint3], true);
  const sphereIntersect2 = raycaster.intersectObject(hotPoint2, true);
  // const sphereIntersect3 = raycaster.intersectObject(hotPoint3, true);
  const tavernIntersect = raycaster.intersectObject(tavern, true);

  if (noticeBoardIntersect.length) {
      foo(41, 16, 139, 52, 16, 139)
  }

  if (sphereIntersect2.length) {
    foo(-4, 36.5, -64.5, -4, 36.5, -75.5)
  }

  if (pileOfBooksIntersect.length) {
    foo(44, 47, -15, 48, 47, -15)
  }

  if (tavernIntersect.length) {
    const name = tavernIntersect[0].object.name;
    if (name === "Cartaz_2_cartaz_Espelho_0001"){
      toggleCamera();
    }
  }

}

function onHover(e) {
  e.preventDefault();

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (!noticeBoard || !resumeSign || !pileOfBooks || !secondPileOfBooks || !tavern) return;
  
  const models = [noticeBoard, resumeSign, pileOfBooks, secondPileOfBooks]
  

  let intersects = raycaster.intersectObjects(models, true);
  const intersect = raycaster.intersectObject(tavern, true);
  const intersectName = intersect.length && intersect[0].object.name;

  if (intersects.length || intersectName === "Cartaz_2_cartaz_Espelho_0001")
    document.body.style.cursor = 'pointer';
  else
    document.body.style.cursor = 'default';
  
}

function toggleCamera(reset = true) {
  clearTimeout(timeout);
  cameraControls.enabled = false;
  panCamera = false;

  if (reset){
    cameraControls.enabled = true;
    // cameraControls.setLookAt(-200, 175, 200, 0, 0, 0, true)
    cameraControls.reset(true)
      .then(() => {
        const target = cameraControls.getTarget();
        if (target.x == 0 && target.y == 0 && target.z == 0){
          panCamera = true
        }
      })
  }
}

function foo(x, y, z, tx, ty, tz) {
  const target = cameraControls.getTarget();
  toggleCamera(false)
  if (target.x == tx && target.y == ty && target.z == tz) 
    toggleCamera()
  else
    cameraControls.setLookAt(x, y, z, tx, ty, tz, true);
}

