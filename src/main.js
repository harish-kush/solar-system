import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// Create a renderer
const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
camera.position.z = 9;

// Load HDRI environment map
const loader = new RGBELoader();
loader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonlit_golf_1k.hdr', function(texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  // scene.background = texture;
});


const bigSphereGeometry = new THREE.SphereGeometry(50, 64, 64);
const textureLoader = new THREE.TextureLoader();
const bigSphereTexture = textureLoader.load('./stars.jpg');
bigSphereTexture.colorSpace = THREE.SRGBColorSpace;
const bigSphereMaterial = new THREE.MeshStandardMaterial({ map: bigSphereTexture , side: THREE.BackSide, opacity: 0.2});
const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
scene.add(bigSphere);


setInterval(()=>{
  gsap.to(spheres.rotation,{
    y : `+=${Math.PI/2}`, // y axis mein 90 degree rotate hoga
    duration:1,
    ease: 'expo.inOut'
  });
},2000);



const radius = 1.3;
const segments = 64;
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
const textures = [
  './csilla/color.png', 
  './earth/map.jpg',
  './venus/map.jpg',
  './volcanic/color.png'
]
const meshSphere = []

const spheres = new THREE.Group();
for(let i=0;i<4;i++){
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i]); // har planet ka texture nikaalo
  texture.colorSpace = THREE.SRGBColorSpace; // color achee kr dega
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);
  
  meshSphere.push(sphere)
  
  const angle = (i / 4) * Math.PI * 2;
  sphere.position.x = 4.5* Math.cos(angle);
  sphere.position.z = 4.5* Math.sin(angle);
  spheres.add(sphere);
}
spheres.rotation.x = 0.20; // neche ki taraf rotate ho jaayega
spheres.position.y = -0.3

scene.add(spheres);


let count = 0;
setInterval(() => {
  count = (count + 1) % 4;

  const headings = document.querySelectorAll('.heading');
  gsap.to(headings, {
    duration: 1,
    y: `-=${100}%`,
    ease: "power2.inOut"
  });

  if (count == 0) {
    gsap.to(headings, {
      duration: 1,
      y: `0`,
      ease: "power2.inOut"
    });
  }
}, 2000);


// Animation loop
let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  // Required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();
  for(let i=0;i<4;i++){
    meshSphere[i].rotation.y = clock.getElapsedTime() * 0.1;
  }
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});