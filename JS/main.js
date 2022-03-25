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
        switch (reference.i) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          default:
            break;
        }
      });
      i++;
    });
});
const game = document.getElementById("game");
let scene, camera, renderer, skyboxGeo, skybox, controls, myReq;
let autoRotate = true;

function createMaterialArray() {
  const skyboxImagepaths = ["images/menu/front.jpg", "images/menu/back.jpg", "images/menu/up.jpg", "images/menu/down.jpg", "images/menu/right.jpg", "images/menu/left.jpg",];
  const materialArray = skyboxImagepaths.map(image => {
    let texture = new THREE.TextureLoader().load(image);

    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
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
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true,
    logarithmicDepthBuffer: true });
  renderer.setSize(game.clientWidth, game.clientHeight);
  renderer.setClearColor(0x574b90, 1);
  renderer.gammaOutput = true; 
  game.appendChild(renderer.domElement);
  const materialArray = createMaterialArray();

  skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);



  //Luces y ya!
  var light = new THREE.DirectionalLight("#c1582d", 1);
  var ambient = new THREE.AmbientLight("#85b2cd");
  light.position.set( 5493, 2997, 5037 ).normalize();
  scene.add(light);
  scene.add(ambient);



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
                mesh.scale.set( 800, 800, 800 );
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






  scene.add(skybox);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enabled = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;
  controls.minDistance = 700;
  controls.maxDistance = 20000;
  window.addEventListener('resize', onWindowResize, false);
  animate();
  
}
function onWindowResize() {
  camera.aspect = game.clientWidth / game.clientHeight;

  camera.updateProjectionMatrix();
  renderer.setSize(game.clientWidth, game.clientHeight);
}

function animate() {
    controls.autoRotate = autoRotate;
    
    controls.update();
    renderer.render(scene, camera);
    myReq = window.requestAnimationFrame(animate);
   
}

init();