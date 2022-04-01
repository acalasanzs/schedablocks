import './style.css'
import * as THREE from 'three'
import gsap from "gsap";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass.js';
import { LUTCubeLoader } from 'three/examples/jsm/loaders/LUTCubeLoader.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
//import * as dat from 'dat.gui'
const game = document.getElementById("game");
var scene;
let lutPass, lutMap, mixer;
const manager = new THREE.LoadingManager();
const lut = new LUTCubeLoader().load( 'Bourbon 64.CUBE', function ( result ) {
    lutMap = result;
} );
let LUT = {
    enabled: true
}

const deg2rad = function (degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
// Loading
const textureLoader = new THREE.TextureLoader();
let mode = THREE.EquirectangularReflectionMapping;

// Canvas
const canvas = document.querySelector('canvas.webgl')
let composer;

// Scene
const bg = textureLoader.load("/images/textures/equirectangular/menu.png")
bg.mapping = mode;

const scene1 = new THREE.Scene()
scene = scene1;
scene1.background = bg;
scene1.environment = bg;

// Clock
const clock = new THREE.Clock()





// TEXTURES
const abstract = {
    aoMap: textureLoader.load('/images/materials/glass/Glass_Window_003_ambientOcclusion.jpg'),
    displacementMap: textureLoader.load('/images/materials/glass/Glass_Window_003_height.png'),
    baseColor: textureLoader.load('/images/materials/glass/Glass_Window_003_basecolor.jpg'),
    metallic: textureLoader.load('/images/materials/glass/Glass_Window_003_metallic.jpg'),
    normalMap: textureLoader.load('/images/materials/glass/Glass_Window_003_normal.jpg'),
    roughness: textureLoader.load('/images/materials/glass/Glass_Window_003_roughness.jpg')
}

// MATERIALS
const material = new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 1,
    map: abstract.baseColor,
    normalMap: abstract.normalMap,
    roughnessMap: abstract.roughness,
    aoMap: abstract.aoMap,
    displacementMap: abstract.displacementMap,
    displacementScale: .15,
    metalnessMap: abstract.metallic
})








// Debug
//const gui = new dat.GUI()









// Lights

const rectLight1 = new THREE.SpotLight( 0xff0000, 5);
rectLight1.position.set( - 5, 0, 5 );
scene1.add( rectLight1 );

const rectLight2 = new THREE.SpotLight( 0x00ff00, 5);
rectLight2.position.set( 0, 0, 5 );
scene1.add( rectLight2 );

const rectLight3 = new THREE.SpotLight( 0x0000ff, 5);
rectLight3.position.set( 5, 0, 5 );
scene1.add( rectLight3 );



// GLTF
var mesh = [];
const loader = new GLTFLoader(manager).setPath( 'models/DamagedHelmet/glTF/' );
loader.load( 'DamagedHelmet.gltf', function ( gltf ) {
    scene1.add( gltf.scene );
    gltf.scene.traverse( (node) => {
        if (node.isMesh) 
            mesh.push(node)
            node.name = "helmet"
    });

} );

// Mesh
//const sphere = new THREE.Mesh(geometry,material)
//scene.add(sphere);


let scale = {
    set: 1.5
}

//gui.add(sphere.material, "displacementScale").min(-3).max(3).step(0.01);


const sizes = {
    width: game.clientWidth,
    height: game.clientHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    composer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
camera.position.set(0, 0, 6);
scene1.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.minDistance = 2;
controls.maxDistance = 8;
controls.target.set( 0, 0, - 0.2 );
controls.update();
const drag = new DragControls(mesh,camera, canvas)

drag.addEventListener( 'dragstart', function ( event ) {
    controls.enabled = false;
    let scale = {
        set: 1.2
    }

    gsap.to(scale, {set: 1, duration: 0.2, ease: 'easein', onUpdate () {
    event.object.scale.set(scale.set,scale.set,scale.set) } });

} );
drag.addEventListener( 'dragend', function ( event ) {
    controls.enabled = true;
    let scale = {
        set: 1
    }
    gsap.to(scale, {set: 1.2, duration: 0.2, ease: 'easeout', onUpdate () {
    event.object.scale.set(scale.set,scale.set,scale.set) } });
} );

// Animation
manager.onLoad = function () {
    var helmet = {
        scale: 1
    }
    gsap.to(helmet, {scale: 7, duration: 2.5, ease: "easeout", onUpdate () {
        mesh[0].scale.set(helmet.scale,helmet.scale,helmet.scale)
    }, onComplete () {
        gsap.to(helmet, {scale: 0, duration: .5, ease: "ease", onUpdate () {
            mesh[0].scale.set(helmet.scale,helmet.scale,helmet.scale)
        }, onComplete () {
            scene.remove(scene.getObjectByName("helmet"))
        }})
    }})
}


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
const target = new THREE.WebGLRenderTarget( {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    encoding: THREE.sRGBEncoding
} );
composer = new EffectComposer( renderer, target );
composer.setPixelRatio( window.devicePixelRatio );
composer.setSize( window.innerWidth, window.innerHeight );
composer.addPass( new RenderPass( scene, camera ) );
composer.addPass( new ShaderPass( GammaCorrectionShader ) );
lutPass = new LUTPass();
composer.addPass( lutPass );

/**
 * Animate
 */
var elapsedTime, delta;

const animate = () =>
{
    elapsedTime = clock.getElapsedTime();
    delta = clock.getDelta();
    lutPass.enabled = Boolean(LUT.enabled && lutMap != undefined);
    lutPass.intensity = 1;
    if (lutMap) lutPass.lut = lutMap.texture3D;
    
    if ( mixer !== undefined ) {

        mixer.update( delta );

    }

    // Update objects

    // Update Orbital Controls
    controls.update()

    // Render
    composer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(animate)
}

animate()