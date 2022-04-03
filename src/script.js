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
import SimplexNoise from 'simplex-noise';
import * as Stats from 'stats-js';
const loadingScreen = document.getElementById("loading-screen");
const songs = ["music/head.mp3","music/through.mp3","music/weekend.mp3","music/nandemonaiya.mp3","music/faking.mp3","music/older.mp3","music/notsobad.mp3","music/monogatari.mp3","music/bakamitai.mp3","music/levels.mp3","music/toby.mp3","music/crush.mp3","music/flutter.mp3","music/funny.mp3","music/Luke Chiang - May I Ask (feat. Alexis Kim).mp3","music/Modern Talking - Brother Louie.mp3","music/Ruel - Painkiller.mp3"];

//import * as dat from 'dat.gui'
let children = document.getElementsByClassName("sidebar-icon");
var analyser, target;
[...children].forEach((reference) =>{
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
});

const deg2rad = function (degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
function onTransitionEnd( event ) {

	event.target.remove();
	
}
class Schedablocks {
    constructor(game, w, h) {

        // Posar el canvas webgl
        this.canvas = game;
        //Posar les mides en un objecte
        this.sizes = {
            width: w ? w : this.canvas.parentNode.clientWidth,
            height: h ? h : this.canvas.parentNode.clientHeight
        }
        //Prevenir la carrega
        this.LoadingManager = new THREE.LoadingManager();
        this.loaded = false;
        this.LoadingManager.onProgress = ( url, itemsLoaded, itemsTotal ) => {
            if(itemsLoaded == itemsTotal && !this.loaded) {
                this.loaded = true;
                console.log("Loaded");
                loadingScreen.classList.add( 'fade-out' );
                // optional: remove loader from DOM via event listener
                loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
            }
        };
        this.textureLoader = new THREE.TextureLoader(this.LoadingManager);
        // TEXTURES
        this.textures = { 
            abstract : {
                aoMap: this.textureLoader.load('/images/materials/glass/Glass_Window_003_ambientOcclusion.jpg'),
                displacementMap: this.textureLoader.load('/images/materials/glass/Glass_Window_003_height.png'),
                baseColor: this.textureLoader.load('/images/materials/glass/Glass_Window_003_basecolor.jpg'),
                metallic: this.textureLoader.load('/images/materials/glass/Glass_Window_003_metallic.jpg'),
                normalMap: this.textureLoader.load('/images/materials/glass/Glass_Window_003_normal.jpg'),
                roughness: this.textureLoader.load('/images/materials/glass/Glass_Window_003_roughness.jpg')
            }
        };
        // MATERIALS
        this.preMaterials = {
            abstract : new THREE.MeshStandardMaterial({
                metalness: 1,
                roughness: 1,
                map: this.textures.abstract.baseColor,
                normalMap: this.textures.abstract.normalMap,
                roughnessMap: this.textures.abstract.roughness,
                aoMap: this.textures.abstract.aoMap,
                displacementMap: this.textures.abstract.displacementMap,
                displacementScale: .15,
                metalnessMap: this.textures.abstract.metallic
            })
        }

        this.shaders = {
            fireParticleShader1: {
                vertex : `
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
                }`,
                
                fragment : `
                uniform sampler2D diffuseTexture;
                varying vec4 vColour;
                varying vec2 vAngle;
                void main() {
                  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
                  gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
                }`
            }
        }
        
        this.Scene0 = class {
            constructor(main){
                this.name = "Scene0";
                this.sizes = main.sizes;
                this.main = main;
                this.canvas = main.canvas;
                this.textureLoader = main.textureLoader;
                this.LoadingManager = main.LoadingManager;

                this.mesh = [];
                //Efectes especials
                let efectes = ["lutPass", "lutMap", "afterimagePass"];

                let playback = ["mixer", "action"];

                this.LUT = {
                    enabled: true
                }
                this.mode = THREE.EquirectangularReflectionMapping;
                this.composer = undefined;
                [...efectes,...playback].forEach(property => {
                    this[property] = undefined;
                });

                this.helmet = {
                    scale: 0
                }
                this.pato = {
                    scale: 0
                }


                this.init();
            }
            init() {
                let lut = new LUTCubeLoader().load( 'Bourbon 64.CUBE', (result, lutMap) => {
                    this.lutMap = result;
                });


                // Scene
                const bg = this.textureLoader.load("/images/textures/equirectangular/enhance2.jpg")
                bg.mapping = this.mode;

                this.scene = new THREE.Scene()
                this.scene.background = bg;
                this.scene.environment = bg;

                //Clock
                this.clock = new THREE.Clock();

                //Fonts
                let fontLoader = new THREE.FontLoader();
                fontLoader.load("font.json", font => {
                    let textGeo = new THREE.TextGeometry("Albert\ni\nAleix", {
                        font: font,
                        size: 1,
                        height: 2/10,
                        curveSegments: 1,
                    });
                    let textMat = new THREE.MeshNormalMaterial();
                    let textMesh = new THREE.Mesh(textGeo,textMat);
                    this.scene.add(textMesh)
                    textMesh.position.set(-2,-3,-5);
                
                })
                // Lights

                const rectLight1 = new THREE.SpotLight( 0xff0000, 2.5);
                rectLight1.position.set( - 5, 0, -5 );
                this.scene.add( rectLight1 );

                const rectLight2 = new THREE.SpotLight( 0x00ff00, 2.5);
                rectLight2.position.set( 0, 0, 5 );
                this.scene.add( rectLight2 );

                const rectLight3 = new THREE.SpotLight( 0x0000ff, 2.5);
                rectLight3.position.set( 5, 0, -5 );
                this.scene.add( rectLight3 );

                const ambient = new THREE.AmbientLight(0xFFFFFF);
                this.scene.add(ambient);

                // GLTF
                var mesh = [];
                this.GLTFloader = new GLTFLoader(this.LoadingManager);
                this.GLTFloader.setPath( 'models/DamagedHelmet/glTF/' ).load( 'DamagedHelmet.gltf', gltf => {
                    this.scene.add( gltf.scene );
                    gltf.scene.traverse( (node) => {
                        if (node.isMesh) 
                            this.mesh.push(node)
                            node.name = "helmet"
                    });

                } );

                /*
                 * Camera
                 */
                // Base camera
                this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
                this.camera.position.x = 0
                this.camera.position.y = 0
                this.camera.position.z = 2
                this.camera.position.set(0, 0, 6);
                this.scene.add(this.camera)

                // Controls
                this.controls = new OrbitControls(this.camera, this.canvas)
                this.controls.minDistance = 2;
                this.controls.maxDistance = 8;
                this.controls.target.set( 0, 0, - 0.2 );

                window.addEventListener("resize",_=>{
                    this.sizes.width = this.canvas.parentNode.clientWidth
                    this.sizes.height = this.canvas.parentNode.clientHeight
    
                    // Update camera
                    this.camera.aspect = this.sizes.width / this.sizes.height
                    this.camera.updateProjectionMatrix()
    
                    // Update renderer
                    this.renderer.setSize(this.sizes.width, this.sizes.height)
                    this.composer.setSize( this.sizes.width, this.sizes.height );
                    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
                });

                let whoami = this;
                // Animation
                this.LoadingManager.onLoad = function () {
                    gsap.to(whoami.helmet, {scale: 7, duration: 2.5, ease: "easeout", onUpdate () {
                        whoami.mesh[0].scale.set(whoami.helmet.scale,whoami.helmet.scale,whoami.helmet.scale)
                    }, onComplete () {
                        gsap.to(whoami.helmet, {scale: 0, duration: .5, ease: "ease", onUpdate () {
                            whoami.mesh[0].scale.set(whoami.helmet.scale,whoami.helmet.scale,whoami.helmet.scale)
                        }, onComplete () {
                            
                            whoami.scene.remove(whoami.scene.getObjectByName("helmet"))
                            whoami.patoLoader = new GLTFLoader()
                            whoami.patoLoader.load('models/patoAlbert2.gltf', gltf => {
                                gltf.scene.position.set(0, -2.5, 0)
                                gltf.scene.rotateY(deg2rad(-90));
                                whoami.mixer = new THREE.AnimationMixer( gltf.scene);
                                whoami.action = whoami.mixer.clipAction(gltf.animations[0]);
                                whoami.mesh.push(gltf.scene);
                                whoami.scene.add( gltf.scene );
                                gsap.to(whoami.pato, {scale: .75, duration: .5, ease: "easein", onUpdate () {
                                    gltf.scene.scale.set(whoami.pato.scale,whoami.pato.scale,whoami.pato.scale);
                                }, onComplete() {
                                    whoami.action.play();
                                }})
                                
                            })
                        }})
                    }})
                }
                this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
                this.renderer.setSize(this.sizes.width, this.sizes.height)
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
                this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.renderer.toneMappingExposure = 1;

                this.target = new THREE.WebGLRenderTarget( {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBAFormat,
                    encoding: THREE.sRGBEncoding
                } );

                this.composer = new EffectComposer( this.renderer, this.target );
                this.composer.setPixelRatio( window.devicePixelRatio );
                this.composer.setSize( this.sizes.width, this.sizes.height );
                this.composer.addPass( new RenderPass( this.scene, this.camera ) );
                this.lutPass = new LUTPass();
                this.composer.addPass( this.lutPass );
                this.afterimagePass = new AfterimagePass();
                this.composer.addPass( this.afterimagePass );
                this.composer.addPass( new ShaderPass(BleachBypassShader));

                this.delta = undefined;
                this.clock2 = new THREE.Clock();

                
                
            }
            animate() {
                window.requestAnimationFrame((t) => {
                    this.delta = this.clock.getDelta();
                    this.lutPass.enabled = Boolean(this.LUT.enabled && this.lutMap != undefined);
                    this.lutPass.intensity = 1;
                    if (this.lutMap) this.lutPass.lut = this.lutMap.texture3D;
                    if(this.afterimagePass.uniforms[ 'damp' ].value > 0) this.afterimagePass.uniforms[ 'damp' ].value -= 0.001;
                    if (this.mesh[1]) this.mesh[1].rotation.y = this.clock2.getElapsedTime();
                    if ( this.mixer !== undefined ) {
                        this.mixer.update( this.delta );
                
                    }
                    // Update objects
                
                    // Render
                    this.composer.render()
                
                    // Call tick again on the next frame
                    window.requestAnimationFrame(_=>{
                        this.animate(this)
                    })
                })
            }
            clear () {
                return new Promise((resolve, reject) => {
                    var id;
                    let parent = this.main.canvas.parentNode;
                    this.main.canvas.remove();
                    let recreate = new Promise ((resolve, reject) => {
                        let canvas = document.createElement("canvas");
                        parent.appendChild(canvas);
                        id = this.main.id();
                        canvas.id = id;
                        this.main.canvas = canvas;
                        if (document.getElementById(id)) resolve();
                    });
                    recreate.then(_=>{
                        this.main.canvas = document.querySelector("canvas");
                        resolve()
                    })
                    this.main.LoadingManager = new THREE.LoadingManager();
                    delete this.main.default;
                })
            }
        }
        this.scenes = [this.Scene0];
        this.init();
    }
    init() {
        this.default = new this.Scene0(this);
        this.default.animate();
    }
    start(scene) {
        this.default = new this.scenes[scene](this);
        this.default.animate();
    }
    id() {
        return this.default.name + Math.random().toString(36).substr(2, 9);
    }
}
//Initialize first scene
var schedablocks;
const audio = new Audio();
document.addEventListener("DOMContentLoaded", _=>{
    schedablocks = new Schedablocks(document.querySelector("canvas.webgl"), window.innerWidth-16,window.innerHeight);
    console.log("This is my super object:");
    console.log(schedablocks);
    children[0].addEventListener("click",_=>{
        /* let recreate = new Promise((resolve,reject) =>{
            let promise = schedablocks.default.clear()
            if (promise) resolve();
        });
        recreate.then(_=>{
            schedablocks.start(1)
        }) */
        
        let iframe = document.createElement("iframe");
        iframe.src = "old/menu.html";
        game.appendChild(iframe);
    })
    children[1].addEventListener("click",_=>{
        /* let recreate = new Promise((resolve,reject) =>{
            let promise = schedablocks.default.clear()
            if (promise) resolve();
        });
        recreate.then(_=>{
            schedablocks.start(1)
        }) */

        let iframe = document.createElement("iframe");
        iframe.src = "old/game.html";
        game.appendChild(iframe);
    })
    children[2].addEventListener("click",_=>{

        let recreate = schedablocks.default.clear()
        recreate.then(_=>{
            schedablocks.init()
        })
        
        
    })
})


function initAudioButton(game) {
target = document.createElement("div");
target.className = "sound blend";
game.appendChild(target);
if (audio.src.length == 0) {
  audio.src = songs[Math.floor(Math.random() * songs.length)];
  audio.load();
  audio.onended = () => {
    audio.src = songs[Math.floor(Math.random() * songs.length)];
    audio.play()
  }
  initAudio();
}else if (!audio.paused){
  target.textContent = "SOUND";
}else{
  target.textContent = "MUTED";
  target.style.color = "#fab1a0";
}
target.addEventListener("click", toggleAudio, false);
}

function toggleAudio(){

if(!audio.paused && !audio.ended ) {
  let interval = setInterval(() => {
    audio.pause();
    if(audio.paused){
      clearInterval(interval);
      target.textContent = "MUTED";
      target.style.color = "#fab1a0";
      localStorage.setItem("music", 0);
      return true;
    }
  }, 100);

}
else if (audio.paused) {
    audio.play();
    target.textContent = "SOUND";
    target.style = "";
    localStorage.setItem("music", 1);
    return true;
}
}
function initAudio() {
if(localStorage.getItem("music") == '0') {
  target.textContent = "MUTED";
  target.style.color = "#fab1a0";
}else if(localStorage.getItem("music") == '1' || localStorage.getItem("music") == null) {
  audio.play();
  target.textContent = "SOUND";
  target.style = "";
}
}

class Particles {
    constructor(scene,howMany, scale = 30, offset = 5) {
    this.scene = scene;
    this.howMany = howMany;
    this.particle = new THREE.Object3D();
    this.particle.name = "particle";
    this.scale = scale;
    this.offset = offset;
    }
    init() {
        this.scene.add(this.particle);
        var material = new THREE.MeshNormalMaterial();
        var geometry = new THREE.TetrahedronGeometry(2, 0);
        for (var i = 0; i < this.howMany; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(this.scale,this.scale,this.scale);
        mesh.position.set(Math.random()*this.offset - 0.5*this.offset, Math.random()*this.offset - 0.5*this.offset, Math.random()*this.offset - 0.5*this.offset).normalize();
        mesh.position.multiplyScalar(90*this.offset + (Math.random() * 700)*this.offset);
        mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
        this.particle.add(mesh);
        }
    }
    animate() {
    this.particle.rotation.y +=.004;
    }
}