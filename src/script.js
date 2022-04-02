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


const deg2rad = function (degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
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
        
        this.Scene0 = class {
            constructor(main){
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
            clear() {
                this.controls.removeEventListener("change", this.animate);
                window.cancelAnimationFrame(this.animate);
            }
        }
        this.init();
    }
    init() {
        this.firstScene = new this.Scene0(this);
        this.firstScene.animate();
    }
    fireParticleShader1 () {
        return {
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
}

//Initialize first scene

const schedablocks = new Schedablocks(document.querySelector("canvas.webgl"));