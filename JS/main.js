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
}


const game = document.getElementById("game");
const audio = new Audio();
var analyser, dataArray, stats, target, audioSrc;
function main() {
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
    renderer.autoClear = false;
    renderer.gammaOutput = true; 
    if (document.querySelector("canvas")){
      document.querySelector("canvas").remove()
    }
    game.appendChild(renderer.domElement);
    const materialArray = createMaterialArray();
  
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
    particles = new Particles(scene, 150);
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
        map: balltilesBaseColor,
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
 █     █░ ▄▄▄     ▄▄▄█████▓▓█████  ██▀███       ██████  ██░ ██  ▄▄▄      ▓█████▄ ▓█████  ██▀███    ██████    
▓█░ █ ░█░▒████▄   ▓  ██▒ ▓▒▓█   ▀ ▓██ ▒ ██▒   ▒██    ▒ ▓██░ ██▒▒████▄    ▒██▀ ██▌▓█   ▀ ▓██ ▒ ██▒▒██    ▒    
▒█░ █ ░█ ▒██  ▀█▄ ▒ ▓██░ ▒░▒███   ▓██ ░▄█ ▒   ░ ▓██▄   ▒██▀▀██░▒██  ▀█▄  ░██   █▌▒███   ▓██ ░▄█ ▒░ ▓██▄      
░█░ █ ░█ ░██▄▄▄▄██░ ▓██▓ ░ ▒▓█  ▄ ▒██▀▀█▄       ▒   ██▒░▓█ ░██ ░██▄▄▄▄██ ░▓█▄   ▌▒▓█  ▄ ▒██▀▀█▄    ▒   ██▒   
░░██▒██▓  ▓█   ▓██▒ ▒██▒ ░ ░▒████▒░██▓ ▒██▒   ▒██████▒▒░▓█▒░██▓ ▓█   ▓██▒░▒████▓ ░▒████▒░██▓ ▒██▒▒██████▒▒   
░ ▓░▒ ▒   ▒▒   ▓▒█░ ▒ ░░   ░░ ▒░ ░░ ▒▓ ░▒▓░   ▒ ▒▓▒ ▒ ░ ▒ ░░▒░▒ ▒▒   ▓▒█░ ▒▒▓  ▒ ░░ ▒░ ░░ ▒▓ ░▒▓░▒ ▒▓▒ ▒ ░   
  ▒ ░ ░    ▒   ▒▒ ░   ░     ░ ░  ░  ░▒ ░ ▒░   ░ ░▒  ░ ░ ▒ ░▒░ ░  ▒   ▒▒ ░ ░ ▒  ▒  ░ ░  ░  ░▒ ░ ▒░░ ░▒  ░ ░   
  ░   ░    ░   ▒    ░         ░     ░░   ░    ░  ░  ░   ░  ░░ ░  ░   ▒    ░ ░  ░    ░     ░░   ░ ░  ░  ░     
    ░          ░  ░           ░  ░   ░              ░   ░  ░  ░      ░  ░   ░       ░  ░   ░           ░     
                                                                          ░                                  
    */

    /* //Shader chuncks
    loadFile('shaders/utils.glsl').then((utils) => {
      THREE.ShaderChunck['utils'] = utils;

      // Light direction
      const light = [0.7559289460184544, 0.7559289460184544, -0.3779644730092272];

      controls.panSpeed = 0.9;
      controls.dynamicDampingFactor = 0.9;

      // Ray caster
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      const targetgeometry = new THREE.PlaneGeometry(2, 2);
      for (let vertex of targetgeometry.vertices) {
        vertex.z = - vertex.y;
        vertex.y = 0.;
      }
      const targetmesh = new THREE.Mesh(targetgeometry);

      // Textures
      const cubetextureloader = new THREE.CubeTextureLoader();

      const textureCube = cubetextureloader.load([
        'xpos.jpg', 'xneg.jpg',
        'ypos.jpg', 'ypos.jpg',
        'zpos.jpg', 'zneg.jpg',
      ]);

    });

    const waterSimulation = new WaterSimulation();
    const water = new Water();
    const caustics = new Caustics(water.geometry);
    scene.add(water.mesh);
    const pool = new Pool(); */

    /* 
 █     █░ ▄▄▄     ▄▄▄█████▓▓█████  ██▀███       ██████  ██░ ██  ▄▄▄      ▓█████▄ ▓█████  ██▀███    ██████    
▓█░ █ ░█░▒████▄   ▓  ██▒ ▓▒▓█   ▀ ▓██ ▒ ██▒   ▒██    ▒ ▓██░ ██▒▒████▄    ▒██▀ ██▌▓█   ▀ ▓██ ▒ ██▒▒██    ▒    
▒█░ █ ░█ ▒██  ▀█▄ ▒ ▓██░ ▒░▒███   ▓██ ░▄█ ▒   ░ ▓██▄   ▒██▀▀██░▒██  ▀█▄  ░██   █▌▒███   ▓██ ░▄█ ▒░ ▓██▄      
░█░ █ ░█ ░██▄▄▄▄██░ ▓██▓ ░ ▒▓█  ▄ ▒██▀▀█▄       ▒   ██▒░▓█ ░██ ░██▄▄▄▄██ ░▓█▄   ▌▒▓█  ▄ ▒██▀▀█▄    ▒   ██▒   
░░██▒██▓  ▓█   ▓██▒ ▒██▒ ░ ░▒████▒░██▓ ▒██▒   ▒██████▒▒░▓█▒░██▓ ▓█   ▓██▒░▒████▓ ░▒████▒░██▓ ▒██▒▒██████▒▒   
░ ▓░▒ ▒   ▒▒   ▓▒█░ ▒ ░░   ░░ ▒░ ░░ ▒▓ ░▒▓░   ▒ ▒▓▒ ▒ ░ ▒ ░░▒░▒ ▒▒   ▓▒█░ ▒▒▓  ▒ ░░ ▒░ ░░ ▒▓ ░▒▓░▒ ▒▓▒ ▒ ░   
  ▒ ░ ░    ▒   ▒▒ ░   ░     ░ ░  ░  ░▒ ░ ▒░   ░ ░▒  ░ ░ ▒ ░▒░ ░  ▒   ▒▒ ░ ░ ▒  ▒  ░ ░  ░  ░▒ ░ ▒░░ ░▒  ░ ░   
  ░   ░    ░   ▒    ░         ░     ░░   ░    ░  ░  ░   ░  ░░ ░  ░   ▒    ░ ░  ░    ░     ░░   ░ ░  ░  ░     
    ░          ░  ░           ░  ░   ░              ░   ░  ░  ░      ░  ░   ░       ░  ░   ░           ░     
                                                                          ░                                  
    */


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
    },150);
  }
  init()
}


function initAudioButton(game) {
  target = document.createElement("div");
  target.className = "sound blend";
  game.appendChild(target);
  if (audio.src.length == 0) {
    audio.src = audioSrc;
    audio.loop = true;
    audio.load();
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












class MyDeliciousGame {
  constructor(game) {
    initAudioButton(game);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(game.clientWidth, game.clientHeight);
    this.fov = 100;
    this.aspect = game.clientWidth/ game.clientHeight;  // the canvas default
    this.near = 0.1;
    this.far = 200;
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    this.camera.position.z = 30;
    this.renderer.setClearColor(0x000000);
    game.appendChild(this.renderer.domElement);
    console.log(game)
    this.canvas = this.renderer.domElement;
    
    window.addEventListener("resize", _=>{
      setTimeout(this.windowResize,150);
    });

  }
  windowResize() {

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

      var geometry = new THREE.TetrahedronGeometry(2, 0);
      var material = new THREE.MeshNormalMaterial();

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


let mainScenario;
const songs = ["music/head.mp3","music/nevermind.mp3","music/through.mp3","music/weekend.mp3","music/nandemonaiya.mp3","music/faking.mp3","music/older.mp3","music/notsobad.mp3","music/monogatari.mp3","music/bakamitai.mp3","music/levels.mp3","music/toby.mp3","music/crush.mp3","music/flutter.mp3","music/funny.mp3"];
audioSrc = songs[Math.floor(Math.random() * songs.length)];
document.getElementById("new").addEventListener("click",_=>{
  if(document.querySelector("canvas"))document.querySelector("canvas").remove();
  if (game.innerHTML.includes("SIDE")) game.innerHTML = "";
  let myGame = new MyDeliciousGame(game);
}, false);
document.getElementById("schedablocks").addEventListener("click",_=>{
  if(document.querySelector("canvas"))document.querySelector("canvas").remove();
  game.innerHTML = "";
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