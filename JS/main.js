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
function loadFile(filename) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.FileLoader();

    loader.load(filename, (data) => {
      resolve(data);
    });
  });
};


const game = document.getElementById("game");
const audio = new Audio();
var analyser, dataArray, stats, target, audioSrc;
function createMaterialArray(skyboxImagepaths) {
  const materialArray = skyboxImagepaths.map(image => {
    let texture = new THREE.TextureLoader().load(image);

    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide});
  });
  return materialArray;
}
function main() {
  const skyboxImagepaths = ["images/menu/front.png", "images/menu/back.png", "images/menu/up.png", "images/menu/down.png", "images/menu/right.png", "images/menu/left.png",];
  var noise = new SimplexNoise();
  let scene, camera, renderer, skyboxGeo, skybox, controls, myReq, plane, ball, clock, delta, interval, particles;
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
    renderer.autoClear = false;
    renderer.gammaOutput = true; 
    if (document.querySelector("canvas")){
      document.querySelector("canvas").remove()
    }
    game.appendChild(renderer.domElement);
    const materialArray = createMaterialArray(skyboxImagepaths);
  
    skyboxGeo = new THREE.BoxGeometry(10000*2, 10000*2, 10000*2);
    skybox = new THREE.Mesh(skyboxGeo, materialArray);
  
    var spriteMap = new THREE.TextureLoader().load( "images/menu/schedablocks.png" );
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
    menuText = new THREE.Sprite( spriteMaterial );
    menuText.position.set(0,2500,0);
    menuText.scale.set(4000, 4000, 4000);
    scene.add( menuText );
    menuText.name = "menuText";


    
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


    particles = new Particles(scene, 150, 30, 5);
    particles.init();
    initAudioButton(game);
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
    plane.name = "plane";
    scene.add(plane);

    const balltilesBaseColor = new ballTextureLoader.load('images/menu/ball/Metal_scratched_009_basecolor.jpg');
    const balltilesNormalMap = new ballTextureLoader.load('images/menu/ball/Metal_scratched_009_normal.jpg');

    var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
    var lambertMaterial = new THREE.MeshStandardMaterial({
        aoMap: balltilesBaseColor,
        normalMap: balltilesNormalMap,
        displacementMap: balltilesHeightMap,
        displacementScale: 1,
        roughnessMap: balltilesRoughnessMap,
        roughness: 1,
        aoMap: balltilesAmbientOcclusionMap
    });

    ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(3000,-150, 0);
    ball.scale.set(20,20,20);
    ball.name = "ball";
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
    skybox.name = "skybox";
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





    // Limit FPS
    clock = new THREE.Clock();
    delta = 0;
    // 60 fps
    interval = 1 / 60;

    var startspriteMap = new THREE.TextureLoader().load( "images/menu/start.png" );
    var startspriteMaterial = new THREE.SpriteMaterial( { map: startspriteMap} );
    startspriteMaterial.depthWrite = false;
    startspriteMaterial.depthTest  = false;
    start = new THREE.Sprite( startspriteMaterial );
    start.position.set(0,-2000,0);
    start.scale.set(1890*3,250*3,1);
    scene.add( start );
    start.name = "start";


/* 
 █████╗ ███╗   ██╗██╗███╗   ███╗ █████╗ ████████╗███████╗
██╔══██╗████╗  ██║██║████╗ ████║██╔══██╗╚══██╔══╝██╔════╝
███████║██╔██╗ ██║██║██╔████╔██║███████║   ██║   █████╗  
██╔══██║██║╚██╗██║██║██║╚██╔╝██║██╔══██║   ██║   ██╔══╝  
██║  ██║██║ ╚████║██║██║ ╚═╝ ██║██║  ██║   ██║   ███████╗
╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
*/

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
    particles.animate()


    delta += clock.getDelta();
    if (delta > interval) {
      renderer.render(scene, camera);

      delta = delta % interval;
      stats.end();
    }
    
    myReq = window.requestAnimationFrame(animate);
   
  }
  function onWindowResize() {
    setTimeout(_=>{
      camera.aspect = game.clientWidth / game.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(game.clientWidth, game.clientHeight);
    },250);
  }
  init()
}


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



/* 
 ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄       ▄▄  ▄▄▄▄▄▄▄▄▄▄▄ 
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░▌     ▐░░▌▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░▌░▌   ▐░▐░▌▐░█▀▀▀▀▀▀▀▀▀ 
▐░▌          ▐░▌       ▐░▌▐░▌▐░▌ ▐░▌▐░▌▐░▌          
▐░▌ ▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌▐░▌ ▐░▐░▌ ▐░▌▐░█▄▄▄▄▄▄▄▄▄ 
▐░▌▐░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌  ▐░▌  ▐░▌▐░░░░░░░░░░░▌
▐░▌ ▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌   ▀   ▐░▌▐░█▀▀▀▀▀▀▀▀▀ 
▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌          
▐░█▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄ 
▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌
 ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀ 
      ╔═╗╦  ╔╗ ╔═╗╦═╗╔╦╗  ╦  ╔═╗╦  ╔═╗╦═╗ ╦
      ╠═╣║  ╠╩╗║╣ ╠╦╝ ║   ║  ╠═╣║  ║╣ ║╔╩╦╝
      ╩ ╩╩═╝╚═╝╚═╝╩╚═ ╩   ╩  ╩ ╩╩═╝╚═╝╩╩ ╚═
*/



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



THREE.FirstPersonControls = function ( camera, MouseMoveSensitivity = 0.002, speed = 800.0, jumpHeight = 350.0, height = 30.0) {
  var scope = this;
  
  scope.MouseMoveSensitivity = MouseMoveSensitivity;
  scope.speed = speed;
  scope.height = height;
  scope.jumpHeight = scope.height + jumpHeight;
  scope.click = false;
  
  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  var canJump = false;
  var run = false;
  
  var velocity = new THREE.Vector3();
  var direction = new THREE.Vector3();

  var prevTime = performance.now();

  camera.rotation.set( 0, 0, 0 );

  var pitchObject = new THREE.Object3D();
  pitchObject.add( camera );

  var yawObject = new THREE.Object3D();
  yawObject.position.y = 10;
  yawObject.add( pitchObject );

  var PI_2 = Math.PI / 2;

  var onMouseMove = function ( event ) {

    if ( scope.enabled === false ) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * scope.MouseMoveSensitivity;
    pitchObject.rotation.x -= movementY * scope.MouseMoveSensitivity;

    pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

  };

  var onKeyDown = (function ( event ) {
    
    if ( scope.enabled === false ) return;
    
    switch ( event.keyCode ) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 32: // space
        if ( canJump === true ) velocity.y += run === false ? scope.jumpHeight : scope.jumpHeight + 50;
        canJump = false;
        break;

      case 16: // shift
        run = true;
        break;

    }

  }).bind(this);

  var onKeyUp = (function ( event ) {
    
    if ( scope.enabled === false ) return;
    
    switch ( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

      case 16: // shift
        run = false;
        break;

    }

  }).bind(this);
  
  var onMouseDownClick= (function ( event ) {
    if ( scope.enabled === false ) return; 
    scope.click = true;
  }).bind(this);
  
  var onMouseUpClick= (function ( event ) {
    if ( scope.enabled === false ) return; 
    scope.click = false;
  }).bind(this);

  scope.dispose = function() {
    document.removeEventListener( 'mousemove', onMouseMove, false );
    document.removeEventListener( 'keydown', onKeyDown, false );
    document.removeEventListener( 'keyup', onKeyUp, false );
    document.removeEventListener( 'mousedown', onMouseDownClick, false );
    document.removeEventListener( 'mouseup', onMouseUpClick, false );
  };

  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );
  document.addEventListener( 'mousedown', onMouseDownClick, false );
  document.addEventListener( 'mouseup', onMouseUpClick, false );

  scope.enabled = false;

  scope.getObject = function () {

    return yawObject;

  };

  scope.update = function () {

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;

    velocity.y -= 9.8 * 100.0 * delta;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize();

    var currentSpeed = scope.speed;
    if (run && (moveForward || moveBackward || moveLeft || moveRight)) currentSpeed = currentSpeed + (currentSpeed * 1.1);

    if ( moveForward || moveBackward ) velocity.z -= direction.z * currentSpeed * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * currentSpeed * delta;

    scope.getObject().translateX( -velocity.x * delta );
    scope.getObject().translateZ( velocity.z * delta );
    
    scope.getObject().position.y += ( velocity.y * delta );

    if ( scope.getObject().position.y < scope.height ) {

      velocity.y = 0;
      scope.getObject().position.y = scope.height;

      canJump = true;
    }
    prevTime = time;
  };
};



function MyDeliciousGame() {
  var plasmaBalls = [];
  var speed = 50;
  var disparado = new THREE.Clock();
  var disparadoDelta = 0;
  var clock = new THREE.Clock();
  var delta = 0;
  const ballTextureLoader = new THREE.TextureLoader();
  const balltilesHeightMap = new ballTextureLoader.load('images/menu/ball/Metal_scratched_009_height.png');
  const balltilesRoughnessMap = new ballTextureLoader.load('images/menu/ball/Metal_scratched_009_roughness.jpg');
  const balltilesAmbientOcclusionMap = new ballTextureLoader.load('images/menu/ball/Metal_scratched_009_ambientOcclusion.jpg');
  const skyboxImagepaths = ["images/game/front.png", "images/game/back.png", "images/game/up.png", "images/game/down.png", "images/game/right.png", "images/game/left.png",];
  var camera, scene, renderer, controls, raycaster, world, emitter;
  const sidebar = document.getElementById("sidebar");


  var sphereShape, sphereBody, world, physicsMaterial, walls=[], balls=[], ballMeshes=[], boxes=[], boxMeshes=[];

  function initCannon(){
    // Setup our world
    world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;

    var solver = new CANNON.GSSolver();

    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;

    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = true;
    if(split)
        world.solver = new CANNON.SplitSolver(solver);
    else
        world.solver = solver;

    world.gravity.set(0,-20,0);
    world.broadphase = new CANNON.NaiveBroadphase();

    // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                            physicsMaterial,
                                                            0.0, // friction coefficient
                                                            0.8  // restitution
                                                            );
    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);

    // Create a sphere
    var mass = 5, radius = 1.3;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0,5,0);
    sphereBody.linearDamping = 0.9;
    world.add(sphereBody);

    // Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.add(groundBody);
}

  function init() {
    let grayScreen = document.createElement("div");
    grayScreen.className = "gray";
    grayScreen.textContent = "(CLICK)";
    sidebar.classList.add("active");
    game.appendChild(grayScreen);
    initAudioButton(game);
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    camera = new THREE.PerspectiveCamera( 75, game.clientWidth/ game.clientHeight, 1, 3000 );
    world = new THREE.Group();
    
    raycaster = new THREE.Raycaster(camera.getWorldPosition(new THREE.Vector3()), camera.getWorldDirection(new THREE.Vector3()));

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffcccc );
    scene.fog = new THREE.Fog( 0xffffff, 0, 2000 );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( game.clientWidth, game.clientHeight );
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );
    renderer.outputEncoding = THREE.sRGBEncoding;
    if ( havePointerLock ) {
      var element = renderer.domElement;
      var pointerlockchange = function ( event ) {
        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
          controls.enabled = true;
          grayScreen.style.display = "none";
          sidebar.classList.remove("active");
        } else {
          controls.enabled = false;
          grayScreen.style.display = "block";
          sidebar.classList.add("active");
        }
      };
      var pointerlockerror = function () {
        grayScreen.style.display = 'none';
        sidebar.classList.remove("active");
      };
      game.addEventListener("click", event => {
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        if ( /Firefox/i.test( navigator.userAgent ) ) {
          var fullscreenchange = function () {
            if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
              document.removeEventListener( 'fullscreenchange', fullscreenchange );
              document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
              element.requestPointerLock();
            }
          };
          document.addEventListener( 'fullscreenchange', fullscreenchange, false );
          document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
          element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
          element.requestFullscreen();
        } else {
          element.requestPointerLock();
        }
      }, false);
      document.addEventListener( 'pointerlockchange', pointerlockchange, false );
      document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
      document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
      document.addEventListener( 'pointerlockerror', pointerlockerror, false );
      document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
      document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

      grayScreen.addEventListener( 'click', function () {
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        if ( /Firefox/i.test( navigator.userAgent ) ) {
          var fullscreenchange = function ( event ) {
            if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
              document.removeEventListener( 'fullscreenchange', fullscreenchange );
              document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
              element.requestPointerLock();
            }
          };
          document.addEventListener( 'fullscreenchange', fullscreenchange, false );
          document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
          element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
          element.requestFullscreen();
        } else {
          element.requestPointerLock();
        }
      }, false );          
    }else{
      alert("You cannot run this game in this browser");
    }
    window.addEventListener( 'resize', onWindowResize, false );


    var dirLight = new THREE.SpotLight( 0xffffff, 1, 0.0, 180.0);
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set(-1000, 2000, 2000);
    dirLight.castShadow = true;

    scene.add( dirLight );


    var dirLight2 = new THREE.SpotLight( 0xffffff, .6, 0.0, 180.0);
    dirLight2.color.setHSL( 0.1, 1, 0.95 );
    dirLight2.position.set(-1000, 2000, -2000);
    dirLight2.castShadow = true;
    scene.add( dirLight );


    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.6 );
    light.position.set( 0, 100, 0.4 );
    scene.add( light );
    
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    dirLight.shadow.camera.far = 3000;

    var ambient = new THREE.AmbientLight( 0x111111 );
    scene.add( ambient );

    controls = new THREE.FirstPersonControls( camera );
    scene.add( controls.getObject() );

    // floor
    const ballTextureLoader = new THREE.TextureLoader();
    const balltilesHeightMap = new ballTextureLoader.load('images/menu/ball/Stylized_Wood_Planks_001_height.png');
    const balltilesNormalMap = new ballTextureLoader.load('images/menu/ball/Stylized_Wood_Planks_001_normal.jpg');
    const balltilesColorMap = new ballTextureLoader.load('images/menu/ball/Stylized_Wood_Planks_001_basecolor.jpg');
    const balltilesRoughnessMap = new ballTextureLoader.load('images/menu/ball/Stylized_Wood_Planks_001_roughness.jpg');
    const balltilesAmbientOcclusionMap = new ballTextureLoader.load('images/menu/ball/Stylized_Wood_Planks_001_ambientOcclusion.jpg');
    [balltilesHeightMap, balltilesNormalMap, balltilesColorMap, balltilesRoughnessMap, balltilesAmbientOcclusionMap].forEach(texture =>{
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.x = 50;
      texture.repeat.y = 50;

    })
    balltilesHeightMap.offset.set(.001,.001,.001);
    balltilesNormalMap.offset.set(.001,.001,.001);
    balltilesRoughnessMap.offset.set(.10,.10,.10);
    balltilesAmbientOcclusionMap.offset.set(.10,.10,.10);

    var floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
    var floorMaterial = new THREE.MeshStandardMaterial({
      aoMap: balltilesColorMap,
      normalMap: balltilesNormalMap,
      displacementMap: balltilesHeightMap,
      roughnessMap: balltilesRoughnessMap,
      roughness: 1,
      aoMap: balltilesAmbientOcclusionMap,
      side: THREE.DoubleSide
  });
    floorMaterial.color.setHSL( 0.095, 1, 0.75 );

    var floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    world.add(floor);
    

    
    for(var i=0; i<70; i++){
        var Sx = (Math.random()-0.5)*20;
        var Sy = (Math.random()-0.5)*200;
        var boxMaterial = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } );
        var halfExtents = new CANNON.Vec3(Sx,Sy,Sx);
        var boxShape = new CANNON.Box(halfExtents);
        var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
        var x = Math.random() * 160*5 - 80*5;
        var y = 0;
        var z = Math.random() * 160*5 - 80*5;
        var boxBody = new CANNON.Body({ mass: 5 });
        boxBody.addShape(boxShape);
        var boxMesh = new THREE.Mesh( boxGeometry, boxMaterial );
        world.add(boxBody);
        scene.add(boxMesh);
        boxBody.position.set(x,y,z);
        boxMesh.position.set(x,y,z);
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        boxes.push(boxBody);
        boxMeshes.push(boxMesh);
    }

    // 3Dモデル用テクスチャ画像の読込
    var loader = new THREE.GLTFLoader();
    // Load a glTF resource
    loader.load(
        // resource URL
        'scene.gltf',
        // called when the resource is loaded
        function ( gltf ) {

                mesh = gltf.scene;
                mesh.scale.set( 0.65, 0.65, 0.65 );
                mesh.rotation.set( 0, -80, 0);

                if (mesh){
                  animate();
                }
                mesh.position.set(2, -1, -2.5);
                camera.add( mesh );
                emitter = new THREE.Object3D();
                emitter.position.set(2, -1, -5);
                camera.add(emitter);
    
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



    
    scene.add( world );
    game.appendChild(renderer.domElement);
    const materialArray = createMaterialArray(skyboxImagepaths);
    
  
    skyboxGeo = new THREE.BoxGeometry(2000, 2000, 2000);
    skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);



    window.addEventListener("resize", _=>{
      setTimeout(onWindowResize,250);
    });
  }
  function shoot() {
    var icosahedronGeometry = new THREE.SphereGeometry(0.5, 8, 4);
    var standardMaterial = new THREE.MeshStandardMaterial({
        color: "aqua",
        displacementMap: balltilesHeightMap,
        displacementScale: 1,
        roughnessMap: balltilesRoughnessMap,
        roughness: 1,
        aoMap: balltilesAmbientOcclusionMap
    });
    let plasmaBall = new THREE.Mesh(icosahedronGeometry, standardMaterial);
    plasmaBall.position.copy(emitter.getWorldPosition()); // start position - the tip of the weapon
    plasmaBall.quaternion.copy(camera.quaternion); // apply camera's quaternion
    scene.add(plasmaBall);
    plasmaBalls.push(plasmaBall);
  }
  function animate() {
    requestAnimationFrame( animate );
    if ( controls.enabled === true ) {

      controls.update();
  
      raycaster.set(camera.getWorldPosition(new THREE.Vector3()), camera.getWorldDirection(new THREE.Vector3()));
      delta = clock.getDelta();
      plasmaBalls.forEach(b => {
      b.translateZ(-speed * delta); // move along the local z-axis
      });
      if (controls.click === true) {
        disparadoDelta = disparado.getDelta();
        if(disparadoDelta > 0.1){
          shoot();
        }
        var intersects = raycaster.intersectObjects(world.children);
        
        if ( intersects.length > 0 ) {
          var intersect = intersects[ 0 ];
          makeParticles(scene,intersect.point);
        }
      }
  
      if (particles.length > 0) {
        var pLength = particles.length;
        while (pLength--) {
          particles[pLength].prototype.update(pLength);
        }
      }
  
    }
  
    renderer.render( scene, camera );
  }
  function onWindowResize() {
    camera.aspect = game.clientWidth / game.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(game.clientWidth, game.clientHeight);
  }

  initCannon()
  init()
  animate()
}
var particles = new Array();

function makeParticles(scene, intersectPosition){
  var totalParticles = 80;
  
  var pointsGeometry = new THREE.Geometry();
  pointsGeometry.oldvertices = [];
  var colors = [];
  for (var i = 0; i < totalParticles; i++) {
    var position = randomPosition(Math.random());
    var vertex = new THREE.Vector3(position[0], position[1] , position[2]);
    pointsGeometry.oldvertices.push([0,0,0]);
    pointsGeometry.vertices.push(vertex);

    var color = new THREE.Color(Math.random() * 0xffffff);
    colors.push(color);
  }
  pointsGeometry.colors = colors;

  var pointsMaterial = new THREE.PointsMaterial({
    size: .8,
    sizeAttenuation: true,
    depthWrite: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    vertexColors: THREE.VertexColors
  });

  var points = new THREE.Points(pointsGeometry, pointsMaterial);

  points.prototype = Object.create(THREE.Points.prototype);
  points.position.x = intersectPosition.x;
  points.position.y = intersectPosition.y;
  points.position.z = intersectPosition.z;
  points.updateMatrix();
  points.matrixAutoUpdate = false;

  points.prototype.constructor = points;
  points.prototype.update = function(index) {
    var pCount = this.constructor.geometry.vertices.length;
	  var positionYSum = 0;
    while(pCount--) {
      var position = this.constructor.geometry.vertices[pCount];
      var oldPosition = this.constructor.geometry.oldvertices[pCount];

      var velocity = {
        x: (position.x - oldPosition[0] ),
        y: (position.y - oldPosition[1] ),
        z: (position.z - oldPosition[2] )				
      }

      var oldPositionX = position.x;
      var oldPositionY = position.y;
      var oldPositionZ = position.z;

      position.y -= .03; // gravity

      position.x += velocity.x;
      position.y += velocity.y;
      position.z += velocity.z;
      
      var wordlPosition = this.constructor.position.y + position.y;
      
      if (wordlPosition <= 0) {
        //particle touched the ground
        oldPositionY = position.y;
        position.y = oldPositionY - (velocity.y * .3);
		
		    positionYSum += 1;
      }

      this.constructor.geometry.oldvertices[pCount] = [oldPositionX, oldPositionY, oldPositionZ];
    }
	
    pointsGeometry.verticesNeedUpdate = true;
	
    if (positionYSum >= totalParticles) {
      particles.splice(index, 1);
	    scene.remove(this.constructor);
      console.log('particle removed');
    }

  };
  particles.push( points );
  scene.add(points);
}

function randomPosition(radius) {
  radius = radius * Math.random();
  var theta = Math.random() * 2.0 * Math.PI;
  var phi = Math.random() * Math.PI;

  var sinTheta = Math.sin(theta); 
  var cosTheta = Math.cos(theta);
  var sinPhi = Math.sin(phi); 
  var cosPhi = Math.cos(phi);
  var x = radius * sinPhi * cosTheta;
  var y = radius * sinPhi * sinTheta;
  var z = radius * cosPhi;

  return [x, y, z];
}

class Controlers {
  constructor() {
    this.MouseMoveSensitivity = 0.007;
    this.speed = 1200.0;
    this.jumpHeight = 120.0;
    this.height = 30.0;
  }
}



const songs = ["music/head.mp3","music/nevermind.mp3","music/through.mp3","music/weekend.mp3","music/nandemonaiya.mp3","music/faking.mp3","music/older.mp3","music/notsobad.mp3","music/monogatari.mp3","music/bakamitai.mp3","music/levels.mp3","music/toby.mp3","music/crush.mp3","music/flutter.mp3","music/funny.mp3","music/Luke Chiang - May I Ask (feat. Alexis Kim).mp3","music/Modern Talking - Brother Louie.mp3","music/Ruel - Painkiller.mp3"];

document.getElementById("new").addEventListener("click",_=>{
  game.innerHTML = "";
  MyDeliciousGame(game);
}, false);
document.getElementById("schedablocks").addEventListener("click",_=>{
  game.innerHTML = "";
  main();
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