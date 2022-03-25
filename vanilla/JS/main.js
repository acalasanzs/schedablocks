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
let scene, camera, renderer;

function init() {
    scene = new THREE.Scene;

    camera = new THREE.PerspectiveCamera(55, game.clientWidth/game.clientHeight, 45, 30000);
    camera.position.set(-900,-200,-900);

        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize(window.innerWidth,window.innerHeight);
        document.body.appendChild(renderer.domElement);

        let controls = new THREE.OrbitControls(camera);
        controls.addEventListener('change', renderer);
        controls.minDistance = 500;
        controls.maxDistance = 1500;
        
        
        let materialArray = [];
        let texture_ft = new THREE.TextureLoader().load( 'images/menu/front.jpg');
        let texture_bk = new THREE.TextureLoader().load( 'images/menu/back.jpg');
        let texture_up = new THREE.TextureLoader().load( 'images/menu/up.jpg');
        let texture_dn = new THREE.TextureLoader().load( 'images/menu/down.jpg');
        let texture_rt = new THREE.TextureLoader().load( 'images/menu/right.jpg');
        let texture_lf = new THREE.TextureLoader().load( 'images/menu/left.jpg');
          
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
   
        for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;
        let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
        let skybox = new THREE.Mesh( skyboxGeo, materialArray );
        scene.add( skybox );  
        animate();
}
function animate() {
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
}
init();