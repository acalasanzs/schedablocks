document.addEventListener("DOMContentLoaded",e=>{
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
        tl.to(reference, duration/4, {scale: 1.2, ease: Expo.easeIn})
        tl.to(reference, duration/2, {scale: 1, ease: Expo.easeOut, delay: duration})
      });
      i++;
    });
});
const game = document.getElementById("game");
const audio = new Audio();
var analyser, dataArray, stats;
function main() {
  var noise = new SimplexNoise();
  let scene, camera, renderer, skyboxGeo, skybox, controls, myReq, plane, ball;
  let menuText;
  let autoRotate = true;
  function makeRoughGround(mesh, distortionFr) {
    mesh.geometry.vertices.forEach(function (vertex, i) {
        var amp = 30;
        var time = Date.now();
        var distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
        vertex.z = distance;
    });
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
    mesh.geometry.computeVertexNormals();
    mesh.geometry.computeFaceNormals();
}
function makeRoughBall(mesh, bassFr, treFr) {
  mesh.geometry.vertices.forEach(function (vertex, i) {
      var offset = mesh.geometry.parameters.radius;
      var amp = 7;
      var time = window.performance.now();
      vertex.normalize();
      var rf = 0.00001;
      var distance = (offset + bassFr ) + noise.noise3D(vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
      vertex.multiplyScalar(distance);
  });
  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.normalsNeedUpdate = true;
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeFaceNormals();
}
  function createMaterialArray() {
    const skyboxImagepaths = ["images/menu/front.png", "images/menu/back.png", "images/menu/up.png", "images/menu/down.png", "images/menu/right.png", "images/menu/left.png",];
    const materialArray = skyboxImagepaths.map(image => {
      let texture = new THREE.TextureLoader().load(image);
  
      return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide});
    });
    return materialArray;
  }
  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      55,
      game.clientWidth/ game.clientHeight,
      45,
      30000,
    );
    camera.position.set(5493, 3556, -4089);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
    renderer.setSize(game.clientWidth, game.clientHeight);
    renderer.setClearColor(0x574b90, 1);
    renderer.gammaOutput = true; 
    if (document.querySelector("canvas")){
      document.querySelector("canvas").remove()
    }
    game.appendChild(renderer.domElement);
    const materialArray = createMaterialArray();
  
    skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
    skybox = new THREE.Mesh(skyboxGeo, materialArray);
  
    var spriteMap = new THREE.TextureLoader().load( "images/menu/schedablocks.png" );
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
    menuText = new THREE.Sprite( spriteMaterial );
    menuText.position.set(0,2500,0);
    menuText.scale.set(4000, 4000, 4000)
    scene.add( menuText );
    menuText.name = "menuText";
  
  
    let instance = new THREE.TextSprite({
      alignment: 'center',
      color: '#000',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 1000,
      fontStyle: 'italic',
      text: "Loading...",
    });
    instance.name = "loading";
    scene.add(instance);
  
  
    lights()
  
  
      var manager = new THREE.LoadingManager();
      manager.onProgress = function ( item, loaded, total ) {};
  
      // 3Dモデル用テクスチャ画像の読込
      var loader = new THREE.GLTFLoader();
  
      // Load a glTF resource
      loader.load(
          // resource URL
          'scene.gltf',
          // called when the resource is loaded
          function ( gltf ) {
  
                  mesh = gltf.scene;
                  mesh.scale.set( 400, 400, 400 );
  
                  if (mesh){
                    scene.remove( scene.getObjectByName(instance.name) );
                    animate();
                  }
                  scene.add( mesh );
      
                  //scene.add( gltf.scene );
  
                  //gltf.animations; // Array<THREE.AnimationClip>
                  //gltf.scene; // THREE.Scene
                  //gltf.scenes; // Array<THREE.Scene>
                  //gltf.cameras; // Array<THREE.Camera>
                  //gltf.asset; // Object
  
          },
          // called when loading is in progresses
          function ( xhr ) {
  
                  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
          },
          // called when loading has errors
          function ( error ) {
  
                  console.log( 'An error happened' );
  
          }
      );
  








    /* 
                                                      ███    ███ ██    ██ ███████ ██  ██████ 
                                                      ████  ████ ██    ██ ██      ██ ██      
                                                      ██ ████ ██ ██    ██ ███████ ██ ██      
                                                      ██  ██  ██ ██    ██      ██ ██ ██      
                                                      ██      ██  ██████  ███████ ██  ██████
███    ███ ██    ██ ███████ ██  ██████ 
████  ████ ██    ██ ██      ██ ██      
██ ████ ██ ██    ██ ███████ ██ ██      
██  ██  ██ ██    ██      ██ ██ ██      
██      ██  ██████  ███████ ██  ██████ 
                                            ███    ███ ██    ██ ███████ ██  ██████ 
                                            ████  ████ ██    ██ ██      ██ ██      
                                            ██ ████ ██ ██    ██ ███████ ██ ██      
                                            ██  ██  ██ ██    ██      ██ ██ ██      
                                            ██      ██  ██████  ███████ ██  ██████  
    */

    audio.src = "music/nevermind.mp3";
    audio.load()
    let played = document.addEventListener("click",_=>{
      audio.play()
      document.removeEventListener("click",played)
    });
    const ballTextureLoader = new THREE.TextureLoader();
    const balltilesHeightMap = new ballTextureLoader.load('images/menu/ball/Metal_scratched_009_height.png');
    const balltilesRoughnessMap = new ballTextureLoader.load('images/menu/ball/Metal_scratched_009_roughness.jpg');
    const balltilesAmbientOcclusionMap = new ballTextureLoader.load('images/menu/ball/Metal_scratched_009_ambientOcclusion.jpg');

    var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    var planeMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        displacementMap: balltilesHeightMap,
        displacementScale: 1,
        roughnessMap: balltilesRoughnessMap,
        roughness: 1,
        aoMap: balltilesAmbientOcclusionMap,
        side: THREE.DoubleSide
    });
    
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, -1250, 0);
    plane.scale.set(13,13, 13);
    scene.add(plane);

    const balltilesBaseColor = new ballTextureLoader.load('images/menu/ball/Metal_scratched_009_basecolor.jpg');
    const balltilesNormalMap = new ballTextureLoader.load('images/menu/ball/Metal_scratched_009_normal.jpg');

    var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
    var lambertMaterial = new THREE.MeshStandardMaterial({
        map: balltilesBaseColor,
        normalMap: balltilesNormalMap,
        displacementMap: balltilesHeightMap,
        displacementScale: 1,
        roughnessMap: balltilesRoughnessMap,
        roughness: 1,
        aoMap: balltilesAmbientOcclusionMap
    });

    ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(4000,-150, 0);
    ball.scale.set(20,20,20);
    scene.add(ball);


    if (!analyser) {
      var context = new AudioContext();
      var src = context.createMediaElementSource(audio);
      analyser = context.createAnalyser();
      src.connect(analyser);
      analyser.connect(context.destination);
      analyser.fftSize = 512;
      var bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }
    
          /* 
                                                      ███    ███ ██    ██ ███████ ██  ██████ 
                                                      ████  ████ ██    ██ ██      ██ ██      
                                                      ██ ████ ██ ██    ██ ███████ ██ ██      
                                                      ██  ██  ██ ██    ██      ██ ██ ██      
                                                      ██      ██  ██████  ███████ ██  ██████
███    ███ ██    ██ ███████ ██  ██████ 
████  ████ ██    ██ ██      ██ ██      
██ ████ ██ ██    ██ ███████ ██ ██      
██  ██  ██ ██    ██      ██ ██ ██      
██      ██  ██████  ███████ ██  ██████ 
                                            ███    ███ ██    ██ ███████ ██  ██████ 
                                            ████  ████ ██    ██ ██      ██ ██      
                                            ██ ████ ██ ██    ██ ███████ ██ ██      
                                            ██  ██  ██ ██    ██      ██ ██ ██      
                                            ██      ██  ██████  ███████ ██  ██████  
    */
  
    scene.add(skybox);





    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controls.minDistance = 700;
    controls.maxDistance = 7000;
    window.addEventListener('resize', onWindowResize, false);

    stats = new Stats();
    stats.showPanel(0);
    stats.dom.id = "stats"
    document.body.appendChild( stats.dom );

    animate();
    
  };
  function lights() {
    //Luces y ya!
    const upColor = 0xFFFF80;
    const downColor = 0x4040FF;
  
    var light = new THREE.HemisphereLight(upColor, downColor, 1);
    var light2 = new THREE.DirectionalLight(0xFFFFFF, 1);
    light2.position.set(100, -500, 100);
    var light3 = new THREE.DirectionalLight(0x574b90, 1);
    light3.position.set(100, 500, 100);
    var ambient = new THREE.AmbientLight("#85b2cd", 1);
    scene.add(light3);
    scene.add(light2);
    scene.add(light);
    scene.add(ambient);
  }
  function animate() {
    controls.autoRotate = autoRotate;
    controls.update();

    stats.begin();


    analyser.getByteFrequencyData(dataArray);

    var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
    var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);
    var lowerMax = max(lowerHalfArray);
    var upperAvg = avg(upperHalfArray);


    var lowerMaxFr = lowerMax / lowerHalfArray.length;
    var upperAvgFr = upperAvg / upperHalfArray.length;

    makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
    makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));



    
    renderer.render(scene, camera);
    stats.end();
    myReq = window.requestAnimationFrame(animate);
    
   
  }
  function onWindowResize() {
    camera.aspect = game.clientWidth / game.clientHeight;
  
    camera.updateProjectionMatrix();
    renderer.setSize(game.clientWidth, game.clientHeight);
  }
  init()
}
function getStandardDeviation(array) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
}























function scenario1() {
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(game.clientWidth, game.clientHeight);
  const fov = 60;
  const aspect = game.clientWidth/ game.clientHeight;  // the canvas default
  const near = 0.1;
  const far = 200;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 30;
  window.addEventListener("resize", _=>{
    onWindowResize(camera, renderer);
  });
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');
  game.appendChild(renderer.domElement);
  const canvas = renderer.domElement;

  // put the camera on a pole (parent it to an object)
  // so we can spin the pole to move the camera around the scene
  const cameraPole = new THREE.Object3D();
  scene.add(cameraPole);
  cameraPole.add(camera);

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function rand(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return min + (max - min) * Math.random();
  }

  function randomColor() {
    return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
  }

  const numObjects = 100;
  for (let i = 0; i < numObjects; ++i) {
    const material = new THREE.MeshPhongMaterial({
      color: randomColor(),
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
    cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
    cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
  }

  class PickHelper {
    constructor() {
      this.raycaster = new THREE.Raycaster();
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }
    pick(normalizedPosition, scene, camera, time) {
      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // cast a ray through the frustum
      this.raycaster.setFromCamera(normalizedPosition, camera);
      // get the list of objects the ray intersected
      const intersectedObjects = this.raycaster.intersectObjects(scene.children);
      if (intersectedObjects.length) {
        // pick the first object. It's the closest one
        this.pickedObject = intersectedObjects[0].object;
        // save its color
        this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
        // set its emissive color to flashing red/yellow
        this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
      }
    }
  }

  const pickPosition = {x: 0, y: 0};
  const pickHelper = new PickHelper();
  clearPickPosition();

  function render(time) {
    time *= 0.001;  // convert to seconds;

    cameraPole.rotation.y = time * .1;

    pickHelper.pick(pickPosition, scene, camera, time);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  }

  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
  }

  function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }
  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);

  window.addEventListener('touchstart', (event) => {
    // prevent the window from scrolling
    event.preventDefault();
    setPickPosition(event.touches[0]);
  }, {passive: false});

  window.addEventListener('touchmove', (event) => {
    setPickPosition(event.touches[0]);
  });

  window.addEventListener('touchend', clearPickPosition);
  
}
function onWindowResize(camera, renderer) {
  camera.aspect = game.clientWidth / game.clientHeight;

  camera.updateProjectionMatrix();
  renderer.setSize(game.clientWidth, game.clientHeight);
}
class Particles {
  constructor(scene,howMany) {
    this.scene = scene;
    this.howMany = howMany;
  }
  init() {
      var particle = new THREE.Object3D();
      this.scene.add(particle);

      var geometry = new THREE.TetrahedronGeometry(2, 0);
      var material = new THREE.MeshNormalMaterial();

      for (var i = 0; i < this.howMany; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        mesh.position.multiplyScalar(90 + (Math.random() * 700));
        mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
        particle.add(mesh);
      }
  }
  animate() {
    particle.rotation.y +=.004;
  }
}


let mainScenario;
document.getElementById("new").addEventListener("click",_=>{
  if(document.querySelector("canvas"))document.querySelector("canvas").remove();
  if (game.innerHTML.includes("SIDE")) game.innerHTML = "";
  let pause = setInterval(_=>{
    audio.pause();
    if (audio.paused)
      clearInterval(pause);
  },10)
  audio.currentTime = 0;
  scenario1();
}, false);
document.getElementById("schedablocks").addEventListener("click",_=>{
  if(document.querySelector("canvas"))document.querySelector("canvas").remove();
  if (game.innerHTML.includes("SIDE")) game.innerHTML = "";
  mainScenario = new main();
}, false);
document.getElementById("home").addEventListener("click", _=>{
  location.replace("https://youtu.be/dQw4w9WgXcQ");
})
//some helper functions here
function fractionate(val, minVal, maxVal) {
  return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
  var fr = fractionate(val, minVal, maxVal);
  var delta = outMax - outMin;
  return outMin + (fr * delta);
}

function avg(arr){
  var total = arr.reduce(function(sum, b) { return sum + b; });
  return (total / arr.length);
}

function max(arr){
  return arr.reduce(function(a, b){ return Math.max(a, b); })
}