import { TransformControls, TextGeometry, FontLoader } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import CameraControls from 'camera-controls';
import loadLights from './textures/lights';
import * as Three from 'three';
import './style.css';

CameraControls.install ({THREE: Three})

// initialize animation variables
let firePlaceMixer, torchMixer;
let tavern, noticeBoard, resumeSign, skillsSign, pileOfBooks, secondPileOfBooks, timeout;
let panCamera = true;
let skillsText, testMesh, resumeText, aboutText;


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
const loader = new GLTFLoader().setPath('https://glb-bucket-portfolio.s3-accelerate.amazonaws.com/');
// const loader = new GLTFLoader().setPath('models/');

const imageLoader = new Three.ImageLoader().setPath('https://glb-bucket-portfolio.s3-accelerate.amazonaws.com/');
// const imageLoader = new Three.ImageLoader().setPath('https://glb-bucket-portfolio.s3.us-east-2.amazonaws.com/');


// instantiate raycaster and mouse - to detect user clicks and move the camera to hotpoints
const raycaster = new Three.Raycaster();
const mouse = new Three.Vector2();
renderer.domElement.addEventListener('click', onDocumentMouseDown);
renderer.domElement.addEventListener('mousemove', onHover);



// instantiate camera controls - used to move the camera around the scene
// set cameraControls properties
const clock = new Three.Clock();
const cameraControls = new CameraControls(camera, renderer.domElement);
cameraControls.maxDistance = 333;
cameraControls.minDistance = 170;
cameraControls.maxPolarAngle = Math.PI / 2;
cameraControls.truckSpeed = 0;
cameraControls.enabled = true;
cameraControls.smoothTime = .5;
cameraControls.addEventListener('control', () => {
    panCamera = false;
    clearTimeout(timeout);

    timeout = setTimeout(toggleCamera, 10000);
    return;
});



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
    };
  });

  scene.add(mesh);
});

imageLoader.load('about_me.png', (image) => {
  const plane = new Three.PlaneGeometry(50, 50);
  const texture = new Three.CanvasTexture(image);
  const material = new Three.MeshStandardMaterial({map: texture});
  skillsText = new Three.Mesh(plane, material);

  skillsText.traverse(child => {
    child.receiveShadow = true;

    if (child.isMesh){
      child.material.map.emissive = 0xffffff
      child.material.map.anisotropy = maxAnisotropy;
      child.material.map.minFilter = Three.LinearFilter;
    }
  })

  skillsText.scale.set(.095, .17)
  skillsText.position.set(-3.91, 36.5, -69.95)

  scene.add(skillsText);

})

// ! test

const fontLoader = new FontLoader();

// Back
fontLoader.load('models/Playball_Regular.json', function ( font ) {

	const geometry = new TextGeometry( 'Back', {
		font: font,
		size: .25,
		depth: 0
	} );

  const material = new Three.MeshBasicMaterial( { color: 0xffffff } );

  testMesh = new Three.Mesh( geometry, material );
  testMesh.position.set(-2.5, 32.5, -69.94)
  scene.add(testMesh)
} );

// Resume
fontLoader.load('models/Playball_Regular.json', function ( font ) {
  const geometry = new TextGeometry( 'Resume', {
    font: font,
    size: 15,
    depth: 2,
  });

  const material = new Three.MeshStandardMaterial({color: 0xffffff});
  resumeText = new Three.Mesh(geometry, material);
  
  // on Floor position and Scale
  resumeText.position.set(-175, -7, -50);
  resumeText.rotation.set(-1.575,0,0)

  // on Sign position and scale)


  resumeText.traverse(child => {
    // child.receiveShadow = true;
    child.castShadow = true;
  });

  scene.add(resumeText);
})

// Skills
fontLoader.load('models/Playball_Regular.json', function ( font ) {
  const geometry = new TextGeometry( 'Skills', {
    font: font,
    size: 15,
    depth: 2,
  });

  const material = new Three.MeshStandardMaterial({color: 0xffffff});
  skillsText = new Three.Mesh(geometry, material);

  //on Sign position and scale
  skillsText.position.set(-180, -7, -25);
  skillsText.rotation.set(-1.575,0,0)

  // on Floor position and scale
  // skillsText.position.set(53.75, 64.25, 0);
  // skillsText.rotation.set(0, -1.575, 0);
  // skillsText.scale.set(1.1, .5, 1);


  skillsText.traverse(child => {
    // child.receiveShadow = true;
    child.castShadow = true;
  });

  scene.add(skillsText);
})

// About Me
fontLoader.load('models/Playball_Regular.json', (font) => {
  const geometry = new TextGeometry( 'About Me', {
    font: font,
    size: 15,
    depth: 2,
  });

  const material = new Three.MeshStandardMaterial({color: 0xffffff});
  aboutText = new Three.Mesh(geometry, material);
  aboutText.position.set(-183, -7, 0);
  aboutText.rotation.set(-1.575,0,0)

  aboutText.traverse(child => {
    // child.receiveShadow = true;
    child.castShadow = true;
  });

  scene.add(aboutText);
})

// ! end test

// create a function loadModels, that goes through and loads all of our 3D models
function loadModels() {


  // load the Tavern
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
        };

        // filter out all of the lambert1 materials (sconces on the back of tavern)
        // and set them to receive and cast shadows
        if (!child.material.name.startsWith('lambert1') ){
          child.receiveShadow = true;
          child.castShadow = true;
        };
      };
    });

    scene.add(tavern);
  });

  // loader.load('updated_resume_sign.glb', function(gltf) {
  //   resumeSign = gltf.scene;
  //   resumeSign.position.set(54, 37, 151.75);
  //   resumeSign.rotation.set(0, 1.575, 0);
  //   resumeSign.scale.set(13, 13, 15);

  //   resumeSign.traverse(child => {
  //     child.receiveShadow = true;
  //     child.castShadow = true;
  //     if (child.mesh) {
  //       child.material.side = Three.FrontSide;
  //     };
  //   });

  //   scene.add(resumeSign);
  // });

  // loader.load('skills_sign.glb', function(gltf) {
  //   skillsSign = gltf.scene;
  //   skillsSign.position.set(53.75, 60.75, 15);
  //   skillsSign.rotation.set(0, 1.575, 0);
  //   skillsSign.scale.set(15, 10, 12);

  //   skillsSign.traverse(child => {
  //     child.castShadow = true;

  //     if (child.isMesh && child.material.map){
  //       child.material.side = Three.FrontSide;
  //       child.material.map.minFilter = Three.NearestFilter;
  //       child.material.map.magFilter = Three.NearestFilter;
  //     };
  //   });

  //   scene.add(skillsSign);
  // });

  // loader.load('skills_letters.glb', function(gltf) {
  //   skillsText = gltf.scene;
    
  //   skillsText.position.set(53.75, 60, 15);
  //   skillsText.rotation.set(0, 1.575, 0);
  //   skillsText.scale.set(15, 10, 12);

  //   skillsText.traverse(child => {
  //     child.castShadow = true;

  //     if (child.isMesh){
  //       child.material.side = Three.FrontSide;
  //     };
  //   });

  //   scene.add(skillsText);
  // });

  // loader.load('resume_letters.glb', function(gltf){
  //   resumeText = gltf.scene;
  //   resumeText.position.set(54, 37, 151.75);
  //   resumeText.rotation.set(0, 1.575, 0);
  //   resumeText.scale.set(13, 13, 15);

  //   resumeText.traverse(child => {
  //     child.castShadow = true;

  //     if (child.isMesh){
  //       child.material.side = Three.FrontSide;
  //     };
  //   });

  //   scene.add(resumeText);
  // });
  loader.load('medieval_book_stack.glb', function(gltf) {
    const bookStack = gltf.scene;
    bookStack.scale.set(.33, .33, .33);
    bookStack.position.set(22, 23.6, 70);
    bookStack.rotation.set(0, -2.5, 0);

    bookStack.traverse(child => {
      child.receiveShadow = true;
      child.castShadow = true;

      if (child.isMesh){
        child.material.map.anisotropy = maxAnisotropy;
        child.material.map.minFilter = Three.NearestFilter;
        child.material.map.magFilter = Three.NearestFilter;
      };
    });

    scene.add(bookStack);
  });

  loader.load('animated_torch_flame1.glb', (gltf) => {
    const fire = gltf.scene;
    firePlaceMixer = new Three.AnimationMixer(fire);
    
    // set fire animation
    firePlaceMixer.clipAction(gltf.animations[0]).setDuration(1).play();

    // set fire properties
    fire.scale.set(13, 5, 10);
    fire.position.set(-34, 7, -70);

    scene.add(fire);
  });

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
  });

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
        };
    
    });


    noticeBoard.scale.set(10, 10, 10);
    noticeBoard.position.set(52, -5, 150);
    noticeBoard.rotation.set(0, -1.575, 0);

    scene.add(noticeBoard);
  });

  loader.load('lightpost.glb', (gltf) => {
    gltf.scene.scale.set(4.5, 4.5, 4.5);
    gltf.scene.position.set(-90, -5, 120);
    gltf.scene.rotation.set(0, 2.5, 0);

    gltf.scene.traverse(child => {
      child.receiveShadow = true;
      child.castShadow = true;
    })
    scene.add(gltf.scene);
  });

  loader.load('pile_of_books.glb', (gltf) => {
    pileOfBooks = gltf.scene;

    pileOfBooks.scale.set(.15, .15, .15);
    pileOfBooks.rotation.set(-1.6, -1.5, 0);
    pileOfBooks.position.set(48, 51.75, -14.4);

    pileOfBooks.traverse(child => {
      child.receiveShadow = true;
      child.castShadow = true;

      if (child.isMesh){
        child.material.map.anisotropy = maxAnisotropy;
        child.material.map.minFilter = Three.LinearFilter;
        child.material.map.magFilter = Three.LinearFilter;
        child.material.side = Three.FrontSide;
      };
    });

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
      };
    });

    scene.add(secondPileOfBooks);
  });
};



const mirrorGeometry = new Three.PlaneGeometry(750, 750);
const mirror = new Reflector(mirrorGeometry);

mirror.rotation.x = -Math.PI / 2;
mirror.position.setY(-8);
scene.add(mirror);


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
scene.add(hotPoint2);


scene.add(loadLights());
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

  // if (tControls.dragging){
  //   panCamera = false;
  //   clearTimeout(timeout);
  //   cameraControls.enabled = false;
  //   console.log(mesh.position);
  // }
  // else {
  //   cameraControls.enabled = true;
  // }
  
  if (panCamera) {
    cameraControls.rotate(0.001, 0);
  }
  
  renderer.render(scene, camera);
};


// helper function - raycasting
function onDocumentMouseDown(e) {
  e.preventDefault();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // if (!noticeBoard || !resumeSign || !pileOfBooks || !secondPileOfBooks || !tavern || !skillsSign) return;
 
  const noticeBoardIntersect = raycaster.intersectObjects([noticeBoard, resumeText], true);
  const pileOfBooksIntersect = raycaster.intersectObjects([pileOfBooks, secondPileOfBooks, skillsText], true);
  const sphereIntersect2 = raycaster.intersectObjects([hotPoint2, aboutText], true);

  // const noticeBoardIntersect = raycaster.intersectObjects([noticeBoard, resumeSign, resumeText], true);
  // const pileOfBooksIntersect = raycaster.intersectObjects([pileOfBooks, secondPileOfBooks, skillsSign, skillsText], true);
  // const sphereIntersect2 = raycaster.intersectObjects([hotPoint2], true);

  const backIntersect = raycaster.intersectObject(testMesh, true);

  if (noticeBoardIntersect.length) {
      foo(41, 16, 139, 52, 16, 139);
  };

  if (sphereIntersect2.length) {
    foo(-4, 36.5, -64.5, -4, 36.5, -75.5);
  };

  if (pileOfBooksIntersect.length) {
    foo(44, 47, -15, 48, 47, -15);
  };

  if (backIntersect.length){
    toggleCamera();
  };
};

function onHover(e) {
  e.preventDefault();

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // if (!noticeBoard || !resumeSign || !pileOfBooks || !secondPileOfBooks || !skillsSign || !testMesh) return;
  // const models = [noticeBoard, resumeSign, skillsSign, pileOfBooks, secondPileOfBooks, skillsText, testMesh, resumeText];

  // if (!noticeBoard || !pileOfBooks || !secondPileOfBooks || !testMesh) return;
  const models = [noticeBoard, pileOfBooks, secondPileOfBooks, testMesh, resumeText, skillsText, aboutText];

  let intersects = raycaster.intersectObjects(models, true);

  if (intersects.length){
    let object = intersects[0].object;
    document.body.style.cursor = 'pointer'
    if (object == testMesh) testMesh.material.color.set('red');
    else if (object == skillsText) skillsText.material.color.set('red');
    else if (object == resumeText) resumeText.material.color.set('red');
    else if (intersects[0].object == aboutText) aboutText.material.color.set('red');
  }else {
    document.body.style.cursor = 'default';
    if (testMesh.color != 0xffffff) testMesh.material.color.set(0xffffff);
    if (skillsText.color != 0xffffff) skillsText.material.color.set(0xffffff);
    if (resumeText.color != 0xffffff) resumeText.material.color.set(0xffffff);
    if (aboutText.color != 0xffffff) aboutText.material.color.set(0xffffff);
  }
}

function toggleCamera(reset = true) {
  clearTimeout(timeout);
  document.body.style.cursor = 'default';
  cameraControls.enabled = false;
  panCamera = false;

  if (reset){
    cameraControls.enabled = true;
    cameraControls.reset(true)
      .then(() => {
        const target = cameraControls.getTarget();
        if (target.x == 0 && target.y == 0 && target.z == 0){
          panCamera = true;
        };
      });
  };
};

function foo(x, y, z, tx, ty, tz) {
  const target = cameraControls.getTarget();
  toggleCamera(false);
  if (target.x == tx && target.y == ty && target.z == tz) 
    toggleCamera();
  else
    cameraControls.setLookAt(x, y, z, tx, ty, tz, true);
};

