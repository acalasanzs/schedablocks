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
/**
 * @author acalasanzs
 */
var velocityFactor;
 class PointerLockControls {
    constructor(camera, cannonBody) {

        var eyeYPos = 2; // eyes are 2 meters above the ground
        velocityFactor = 0.2;
        var jumpVelocity = 20;
        var scope = this;

        var pitchObject = new THREE.Object3D();
        pitchObject.add(camera);

        var yawObject = new THREE.Object3D();
        yawObject.position.y = 2;
        yawObject.add(pitchObject);

        var quat = new THREE.Quaternion();

        var moveForward = false;
        var moveBackward = false;
        var moveLeft = false;
        var moveRight = false;

        var canJump = false;

        var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
        var upAxis = new CANNON.Vec3(0, 1, 0);
        cannonBody.addEventListener("collide", function (e) {
            var contact = e.contact;

            // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
            // We do not yet know which one is which! Let's check.
            if (contact.bi.id == cannonBody.id) // bi is the player body, flip the contact normal
                contact.ni.negate(contactNormal);

            else
                contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is


            // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
            if (contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
                canJump = true;
        });

        var velocity = cannonBody.velocity;

        var PI_2 = Math.PI / 2;

        var onMouseMove = function (event) {

            if (scope.enabled === false)
                return;

            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            yawObject.rotation.y -= movementX * 0.002;
            pitchObject.rotation.x -= movementY * 0.002;

            pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
        };

        var onKeyDown = function (event) {

            switch (event.keyCode) {

                case 38: // up
                case 87: // w
                    moveForward = true;
                    break;

                case 37: // left
                case 65: // a
                    moveLeft = true; break;

                case 40: // down
                case 83: // s
                    moveBackward = true;
                    break;

                case 39: // right
                case 68: // d
                    moveRight = true;
                    break;

                case 32: // space
                    if (canJump === true) {
                        velocity.y = jumpVelocity;
                    }
                    canJump = false;
                    break;
            }

        };

        var onKeyUp = function (event) {

            switch (event.keyCode) {

                case 38: // up
                case 87: // w
                    moveForward = false;
                    break;

                case 37: // left
                case 65: // a
                    moveLeft = false;
                    break;

                case 40: // down
                case 83: // a
                    moveBackward = false;
                    break;

                case 39: // right
                case 68: // d
                    moveRight = false;
                    break;

            }

        };

        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);

        this.enabled = false;

        this.getObject = function () {
            return yawObject;
        };

        this.getDirection = function (targetVec) {
            targetVec.set(0, 0, -1);
            quat.multiplyVector3(targetVec);
        };

        // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
        var inputVelocity = new THREE.Vector3();
        var euler = new THREE.Euler();
        this.update = function (delta) {

            if (scope.enabled === false)
                return;

            delta *= 0.1;

            inputVelocity.set(0, 0, 0);

            if (moveForward) {
                inputVelocity.z = -velocityFactor * delta;
            }
            if (moveBackward) {
                inputVelocity.z = velocityFactor * delta;
            }

            if (moveLeft) {
                inputVelocity.x = -velocityFactor * delta;
            }
            if (moveRight) {
                inputVelocity.x = velocityFactor * delta;
            }

            // Convert velocity to world coordinates
            euler.x = pitchObject.rotation.x;
            euler.y = yawObject.rotation.y;
            euler.order = "XYZ";
            quat.setFromEuler(euler);
            inputVelocity.applyQuaternion(quat);
            //quat.multiplyVector3(inputVelocity);
            // Add to the object
            velocity.x += inputVelocity.x;
            velocity.z += inputVelocity.z;

            yawObject.position.copy(cannonBody.position);
        };
    }
}

function deg2rad(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
var loadingScreen;
var sphereShape, sphereBody, world, physicsMaterial, walls=[], balls=[], ballMeshes=[], boxes=[], boxMeshes=[];
var camera, scene, renderer, animation, value, tween;
var geometry, floorMaterial, material, mesh;
var controls,time = Date.now();


stats = new Stats();
stats.showPanel(0);
stats.dom.style.left = "calc(100% - 80px)";
document.body.appendChild( stats.dom );


var blocker = document.getElementById( 'blocker' );
var shotPointer = document.getElementById("pointer");
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

    var element = document.body;

    var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

            controls.enabled = true;

            blocker.style.display = 'none';
            shotPointer.classList.remove("hide");
            document.title = "GAME - DO NOT ENTER DIRECTLY";

        } else {

            controls.enabled = false;
            blocker.style.display = '';
            shotPointer.classList.add("hide");
            instructions.style.display = '';
            document.title = "GAME - PAUSED";

        }

    }

    var pointerlockerror = function ( event ) {
        instructions.style.display = '';
        shotPointer.classList.add("hide");
        document.title = "GAME - DO NOT ENTER DIRECTLY";
    }

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {
        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if ( /Firefox/i.test( navigator.userAgent ) ) {

            var fullscreenchange = function ( event ) {

                if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                    document.removeEventListener( 'fullscreenchange', fullscreenchange );
                    document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                    element.requestPointerLock();
                }

            }

            document.addEventListener( 'fullscreenchange', fullscreenchange, false );
            document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            element.requestFullscreen();

        } else {

            element.requestPointerLock();

        }

    }, false );

} else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

initCannon();
init();
animate();

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
    var mass = 5, radius = 2;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0, 5, 0);
    sphereBody.linearDamping = 0.9;
    world.add(sphereBody);

    // Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.add(groundBody);
}
function onTransitionEnd( event ) {

	event.target.remove();
	
}
function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 0, 500 );

    var ambient = new THREE.AmbientLight( 0x111111 );
    scene.add( ambient );

    light = new THREE.SpotLight( 0xffffff );
    light.position.set( 10, 30, 20 );
    light.target.position.set( 0, 0, 0 );

    if(true){
        light.castShadow = true;

        light.shadowCameraNear = 20;
        light.shadowCameraFar = 50;//camera.far;
        light.shadowCameraFov = 40;

        light.shadowMapBias = 0.1;
        light.shadowMapDarkness = 0.7;
        light.shadowMapWidth = 32*512;
        light.shadowMapHeight = 32*512;

        light.shadowCameraVisible = true;
    }

    scene.add( light );

    var dirLight = new THREE.SpotLight( 0xffffff, 1, 0.0, 180.0);
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set(-1000, 2000, 2000);
    dirLight.castShadow = true;
    scene.add( dirLight );
    
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    dirLight.shadow.camera.far = 3000;



    const fovAnim = () => {
        if (value > 25) {
            clearInterval(tween);
        }else{
            value += 2;
            camera.fov = 75 + value;
            camera.updateProjectionMatrix();
        }
    };


    controls = new PointerLockControls( camera , sphereBody );
    scene.add( controls.getObject() );
    
    document.addEventListener("keydown", event => {
        if (event.shiftKey) {
            velocityFactor = .8;
            value = 0;
            animation = true;
            if (!tween)
            tween = setInterval(fovAnim,10);
            else{
                clearInterval(tween);
                tween = setInterval(fovAnim,10);
            }   
            
        }else{
            velocityFactor = .2;
            clearInterval(tween);
        }
    });
    document.onkeyup = (event) => {
        velocityFactor = .2;
        if (value >= 25) {
            clearInterval(tween);
        }
        if (!(event.keyCode == 87 || event.keyCode == 65 || event.keyCode == 83 || event.keyCode == 68)){
            //velocityFactor = 0.2;
            camera.fov = 75;
            camera.updateProjectionMatrix();
        } 
    };

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

    });

    const boxtilesHeightMap = new ballTextureLoader.load('images/menu/ball/Wood_022_height.png');
    const boxtilesNormalMap = new ballTextureLoader.load('images/menu/ball/Wood_022_normal.jpg');
    const boxtilesColorMap = new ballTextureLoader.load('images/menu/ball/Wood_022_basecolor.jpg');
    const boxtilesRoughnessMap = new ballTextureLoader.load('images/menu/ball/Wood_022_roughness.jpg');
    const boxtilesAmbientOcclusionMap = new ballTextureLoader.load('images/menu/ball/Wood_022_ambientOcclusion.jpg');

    [boxtilesHeightMap, boxtilesNormalMap, boxtilesColorMap, boxtilesRoughnessMap, boxtilesAmbientOcclusionMap].forEach(texture =>{
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = 1;
        texture.repeat.y = 1;
  
      });
    geometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    material = new THREE.MeshPhysicalMaterial( {
        map: boxtilesColorMap,
        normalMap: boxtilesNormalMap,
        aoMap: boxtilesAmbientOcclusionMap
    });
    floorMaterial = new THREE.MeshLambertMaterial(  {
        map: balltilesColorMap,
        normalMap: balltilesNormalMap,
        displacementMap: balltilesHeightMap,
        roughnessMap: balltilesRoughnessMap,
        roughness: 1,
        aoMap: balltilesAmbientOcclusionMap,
        side: THREE.DoubleSide
    } )

    mesh = new THREE.Mesh( geometry, floorMaterial );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( scene.fog.color, 1 );

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    // Add boxes
    var halfExtents = new CANNON.Vec3(1,1,1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
    for(var i=0; i<7; i++){
        var x = (Math.random()-0.5)*20;
        var y = 1 + (Math.random()-0.5)*1;
        var z = (Math.random()-0.5)*20;
        var boxBody = new CANNON.Body({ mass: 5 });
        boxBody.addShape(boxShape);
        var boxMesh = new THREE.Mesh( boxGeometry, material );
        world.add(boxBody);
        scene.add(boxMesh);
        boxBody.position.set(x,y,z);
        boxMesh.position.set(x,y,z);
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        boxes.push(boxBody);
        boxMeshes.push(boxMesh);
    }


    // Add linked boxes
    var size = 0.5;
    var he = new CANNON.Vec3(size,size,size*0.1);
    var boxShape = new CANNON.Box(he);
    var mass = 0;
    var space = 0.1 * size;
    var N = 5, last;
    var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
    for(var i=0; i<N; i++){
        var boxbody = new CANNON.Body({ mass: mass });
        boxbody.addShape(boxShape);
        var boxMesh = new THREE.Mesh(boxGeometry, material);
        boxbody.position.set(5,(N-i)*(size*2+2*space) + size*2+space,0);
        boxbody.linearDamping = 0.01;
        boxbody.angularDamping = 0.01;
        // boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        world.add(boxbody);
        scene.add(boxMesh);
        boxes.push(boxbody);
        boxMeshes.push(boxMesh);

        if(i!=0){
            // Connect this body to the last one
            var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
            var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
            world.addConstraint(c1);
            world.addConstraint(c2);
        } else {
            mass=0.3;
        }
        last = boxbody;
    }

    // 3Dモデル用テクスチャ画像の読込
    var loader = new THREE.GLTFLoader();
  
    // Load a glTF resource
    loader.load(
        // resource URL
        'scene.gltf',
        // called when the resource is loaded
        function ( gltf ) {
                loadingScreen = document.getElementById( 'loading-screen' );
                loadingScreen.classList.add( 'fade-out' );
                // optional: remove loader from DOM via event listener
                loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
                mesh = gltf.scene;
                mesh.scale.set( 0.0025, 0.0025, 0.0025 );
                mesh.rotation.set( deg2rad(0), deg2rad(180), deg2rad(0));
                if (mesh){
                  animate();
                }
                mesh.position.set(0, -1, -1.9);
                camera.add( mesh );

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
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

var dt = 1/60;
function animate() {
    requestAnimationFrame( animate );
    if(controls.enabled){
        world.step(dt);

        // Update ball positions
        for(var i=0; i<balls.length; i++){
            ballMeshes[i].position.copy(balls[i].position);
            ballMeshes[i].quaternion.copy(balls[i].quaternion);
        }

        // Update box positions
        for(var i=0; i<boxes.length; i++){
            boxMeshes[i].position.copy(boxes[i].position);
            boxMeshes[i].quaternion.copy(boxes[i].quaternion);
        }
    }

    controls.update( Date.now() - time );
    stats.begin();
    renderer.render( scene, camera );
    stats.end();
    time = Date.now();

}

var ballShape = new CANNON.Sphere(0.2);
var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 8, 8);
var shootDirection = new THREE.Vector3();
var shootVelo = 25;
var projector = new THREE.Projector();
function getShootDir(targetVec){
    var vector = targetVec;
    targetVec.set(0,0,1);
    projector.unprojectVector(vector, camera);
    var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
    targetVec.copy(ray.direction);
}
window.addEventListener("click",function(e){
    shotPointer.classList.add("active");
    setTimeout(() => {
        shotPointer.classList.remove("active");
    }, 250);
    if(controls.enabled==true){
        var x = sphereBody.position.x;
        var y = sphereBody.position.y;
        var z = sphereBody.position.z;
        var ballBody = new CANNON.Body({ mass: 10 });
        ballBody.addShape(ballShape);
        var ballMesh = new THREE.Mesh( ballGeometry, material );
        world.add(ballBody);
        scene.add(ballMesh);
        ballMesh.castShadow = true;
        ballMesh.receiveShadow = true;
        balls.push(ballBody);
        ballMeshes.push(ballMesh);
        getShootDir(shootDirection);
        ballBody.velocity.set(  shootDirection.x * shootVelo,
                                shootDirection.y * shootVelo,
                                shootDirection.z * shootVelo);

        // Move the ball outside the player sphere
        x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
        y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
        z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
        ballBody.position.set(x,y,z);
        ballMesh.position.set(x,y,z);
    }
});
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