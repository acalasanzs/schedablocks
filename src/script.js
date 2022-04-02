import './style.css'
import * as THREE from 'three'
import gsap from "gsap";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BleachBypassShader } from 'three/examples/jsm/shaders/BleachBypassShader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass.js';
import { LUTCubeLoader } from 'three/examples/jsm/loaders/LUTCubeLoader.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

const _VS = `
uniform float pointMultiplier;
attribute float size;
attribute float angle;
attribute vec4 colour;
varying vec4 vColour;
varying vec2 vAngle;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * pointMultiplier / gl_Position.w;
  vAngle = vec2(cos(angle), sin(angle));
  vColour = colour;
}`;

const _FS = `
uniform sampler2D diffuseTexture;
varying vec4 vColour;
varying vec2 vAngle;
void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
}`;


//import * as dat from 'dat.gui'
let children = document.getElementsByClassName("sidebar-icon");
[...children].forEach((reference, i = 0) =>{
reference.i = i;
reference.addEventListener("click",(e)=>{
    e.preventDefault()
    var duration = .1;
    var tl = gsap.timeline({onComplete: _=>{
    reference.style.background = "";
    reference.querySelector("path").style.fill = "";
    }})
    reference.style.background = "var(--color-fantastic-blue)";
    reference.querySelector("path").style.fill = "#fff";
    tl.to(reference, duration/4, {scale: 1.2, ease: "easein"})
    tl.to(reference, duration/2, {scale: 1, ease: "easeout", delay: duration})
});
i++;
});


var patoLoader, afterimagePass;
var scene;
let lutPass, lutMap, mixer, action;
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
const bg = textureLoader.load("/images/textures/equirectangular/enhance2.jpg")
bg.mapping = mode;

const scene1 = new THREE.Scene()
scene = scene1;
scene.background = bg;
scene.environment = bg;

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

const rectLight1 = new THREE.SpotLight( 0xff0000, 2.5);
rectLight1.position.set( - 5, 0, -5 );
scene.add( rectLight1 );

const rectLight2 = new THREE.SpotLight( 0x00ff00, 2.5);
rectLight2.position.set( 0, 0, 5 );
scene.add( rectLight2 );

const rectLight3 = new THREE.SpotLight( 0x0000ff, 2.5);
rectLight3.position.set( 5, 0, -5 );
scene.add( rectLight3 );

const ambient = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambient);

let helper1 = new THREE.SpotLightHelper(rectLight1);


//TITLE
var fontLoader = new THREE.FontLoader();
fontLoader.load("font.json", function (font) {
    let textGeo = new THREE.TextGeometry("Albert\ni\nAleix", {
        font: font,
        size: 1,
        height: 2/10,
        curveSegments: 1,
    });
    let textMat = new THREE.MeshNormalMaterial();
    let textMesh = new THREE.Mesh(textGeo,textMat);
    scene1.add(textMesh)
    textMesh.position.set(-2,-3,-5);

})


// GLTF
var mesh = [];
const loader = new GLTFLoader(manager).setPath( 'models/DamagedHelmet/glTF/' );
loader.load( 'DamagedHelmet.gltf', function ( gltf ) {
    scene.add( gltf.scene );
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
    width: window.innerWidth - 16,
    height: window.innerHeight
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
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.minDistance = 2;
controls.maxDistance = 8;
controls.target.set( 0, 0, - 0.2 );
controls.update();
var helmet = {
    scale: 0
}
var pato = {
    scale: 0
}

// Animation
manager.onLoad = function () {
    gsap.to(helmet, {scale: 7, duration: 2.5, ease: "easeout", onUpdate () {
        mesh[0].scale.set(helmet.scale,helmet.scale,helmet.scale)
    }, onComplete () {
        gsap.to(helmet, {scale: 0, duration: .5, ease: "ease", onUpdate () {
            mesh[0].scale.set(helmet.scale,helmet.scale,helmet.scale)
        }, onComplete () {
            
            scene.remove(scene.getObjectByName("helmet"))
            patoLoader = new GLTFLoader()
            patoLoader.load('models/patoAlbert2.gltf', gltf => {
                gltf.scene.position.set(0, -2.5, 0)
                gltf.scene.rotateY(deg2rad(-90));
                mixer = new THREE.AnimationMixer( gltf.scene);
                action = mixer.clipAction(gltf.animations[0]);
                mesh.push(gltf.scene);
                scene.add( gltf.scene );
                gsap.to(pato, {scale: .75, duration: .5, ease: "easein", onUpdate () {
                    gltf.scene.scale.set(pato.scale,pato.scale,pato.scale);
                }, onComplete() {
                    action.play();
                }})
                
            })
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
lutPass = new LUTPass();
composer.addPass( lutPass );
afterimagePass = new AfterimagePass();
composer.addPass( afterimagePass );
composer.addPass( new ShaderPass(BleachBypassShader));

/*
 * Animate
 */


var delta;
var clock2 = new THREE.Clock();

const animate = () =>
{
    delta = clock.getDelta();
    lutPass.enabled = Boolean(LUT.enabled && lutMap != undefined);
    lutPass.intensity = 1;
    if (lutMap) lutPass.lut = lutMap.texture3D;
    if(afterimagePass.uniforms[ 'damp' ].value > 0) afterimagePass.uniforms[ 'damp' ].value -= 0.001;
    if (mesh[1]) mesh[1].rotation.y = clock2.getElapsedTime();
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