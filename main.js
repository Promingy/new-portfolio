import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CameraControls from 'camera-controls';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { TransformControls } from 'three/examples/jsm/Addons.js';
import loadLights from './textures/lights';
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


// instantiate transform controls
const tControls = new TransformControls(camera, renderer.domElement);
tControls.setMode('translate');


// set max anisotropy - improves texture quality ( we'll use this in the loader)
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();


// instantiate GLTFLoader - used to load 3D models - one linked to AWS the other for local files
const loader = new GLTFLoader().setPath('https://glb-bucket-portfolio.s3-accelerate.amazonaws.com/');
// const loader = new GLTFLoader().setPath('models/');


// instantiate raycaster and mouse - to detect user clicks and move the camera to hotpoints
const raycaster = new Three.Raycaster();
const mouse = new Three.Vector2();
renderer.domElement.addEventListener('click', onDocumentMouseDown);
renderer.domElement.addEventListener('mousemove', onHover)



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
  loader.load('test.glb', function(gltf) {
    const tavern = gltf.scene;

    // set tavern properties
    tavern.scale.set(25,25,25);
    tavern.position.set(0, 0, 0);

    tavern.traverse((child) => {
      if (child.isMesh) {
        child.material.side = Three.FrontSide;
        // child.material.metalness = 0;
        
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
    
    
  // loader.load('medieval_book.glb', function(book) {
  //   book.scene.scale.set(1, 1, 1);
  //   book.scene.position.setY(10)
  //   scene.add(book.scene);
  // })
  // loader.load('medieval_book_stack.glb', function(gltf) {
  //   const bookStack = gltf.scene;
  //   bookStack.scale.set(.33, .33, .33);
  //   bookStack.position.set(22, 23.6, 70)
  //   bookStack.rotation.set(0, -2.5, 0)

  //   bookStack.traverse(child => {
  //     child.receiveShadow = true;
  //     child.castShadow = true;

  //     if (child.isMesh){
  //       child.material.map.anisotropy = maxAnisotropy;
  //       child.material.map.minFilter = Three.NearestFilter;
  //       child.material.map.magFilter = Three.NearestFilter;
  //     }
  //   })

  //   // tControls.attach(bookStack)
  //   scene.add(bookStack);
  // })


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

    // tControls.attach(noticeBoard)
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
    const books = gltf.scene;

    books.scale.set(.15, .15, .15);
    books.rotation.set(-1.6, -1.5, 0);
    books.position.set(48, 51.75, -14.4)

    const books2 = books.clone();
    books2.position.setZ(-8)

    // tControls.attach(books);
    scene.add(books, books2);
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
scene.add(hotPoint);

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
  if (torchMixer2) torchMixer2.update(1/60);
  if (torchMixer3) torchMixer3.update(1/60);

  if (sconeFlameMixer) sconeFlameMixer.update(1/60);
  if (sconeFlameMixer2) sconeFlameMixer2.update(1/60);
  if (sconeFlameMixer3) sconeFlameMixer3.update(1/60);
  if (sconeFlameMixer4) sconeFlameMixer4.update(1/60);
  
  if (tControls.dragging) {
    cameraControls.enabled = false;
    console.log('position', tControls.object.position);
    console.log('rotation', tControls.object.rotation);
    console.log('scale', tControls.object.scale);
  } else {
    cameraControls.enabled = true;
  }

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
  const sphereIntersect2 = raycaster.intersectObject(hotPoint2, true);
  const sphereIntersect3 = raycaster.intersectObject(hotPoint3, true);
  const intersect = raycaster.intersectObjects(scene.children, true);

  if (sphereIntersect.length || noticeBoardIntersect.length) {

    if (!panCamera) {
      cameraControls.enabled = true;
      panCamera = true;
      cameraControls.setLookAt(-250, 200, 250, 0, 0, 0, true);
    }else {
    cameraControls.enabled = false;
    panCamera = false;
    const x = 52;
    const y = 16;
    const z = 139;
    cameraControls.setLookAt(x - 11, y, z, x, y, z, true);
    }
  }

  if (sphereIntersect2.length) {
    if (!panCamera) {
      toggleCamera(true)
    }else {
      toggleCamera()
    const x = -4;
    const y = 36.5;
    const z = -75.5;
    cameraControls.setLookAt(x, y, z + 11, x, y, z, true);
    }
  }

  if (sphereIntersect3.length) {
    if (!panCamera) {
      toggleCamera(true)
    }else {
      toggleCamera()
    const x = 48;
    const y = 47;
    const z = -17;
    cameraControls.setLookAt(x - 4, y, z, x, y, z, true);
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

  if (intersect.length) {
    console.log(intersect[0].object);
    const id = intersect[0].object.id;
    if (id === 930 || id === 899 || id === 876 || id === 588){
      toggleCamera(true);
    }
  }

}

function onHover(e) {
  e.preventDefault();

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  
  let noticeBoardIntersect;
  if (noticeBoard) {
    noticeBoardIntersect = raycaster.intersectObject(noticeBoard, true);
  }
  const sphereIntersect = raycaster.intersectObject(hotPoint, true);

  if (noticeBoard) {
    if (noticeBoardIntersect.length) {
      noticeBoardIntersect[0].object.material.color.set(0xffffff);
      document.body.style.cursor = 'pointer';
      } else {
      noticeBoard.traverse(child => {
        if (child.isMesh) {
          child.material.color.set(0xbcbcbc);
        }
      })
      document.body.style.cursor = 'default';
    }
  }

  if (sphereIntersect.length) {
    hotPoint.material.color.set(0xfffb00);
    document.body.style.cursor = 'pointer';
  } else {
    hotPoint.material.color.set(0xffffff);
    document.body.style.cursor = 'default';
  }
}

function toggleCamera(reset=false) {
  cameraControls.enabled = !cameraControls.enabled;
  panCamera = !panCamera;

  if (reset)
    cameraControls.setLookAt(-250, 200, 250, 0, 0, 0, true);
}
