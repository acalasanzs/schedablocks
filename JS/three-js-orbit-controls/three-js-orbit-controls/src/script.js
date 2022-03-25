//Orbit Control is utilized in line 31-34 -- stretch out the JS tab so that all the lines fit
//Make sure to have OrbitControl.JS imported
//threejs folder > examples > js > controls > OrbitControls.js

$(function(){
      var scene, camera, renderer;
      var controls;
      var W, H;
      var cube;
      var particle;

      init();

      function init(){
        W = window.innerWidth;
        H = window.innerHeight;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, W/H, .1, 1000);
        camera.position.z = 400;
        renderer = new THREE.WebGLRenderer({
          //canvas: document.getElementById("canvas"),
          antialias: true,
          alpha: true
        })

        renderer.setClearColor(0x012345);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(W,H);
        
        document.getElementById("canvas").appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(  
            camera, 
            renderer.domElement
        );
        controls.target.z = 100;
        //first parameter is the camera and second parameter is the canvas or renderer.domElement


        particle = new THREE.Object3D();
        scene.add(particle);

        var geometry = new THREE.TetrahedronGeometry(2, 0);
        var material = new THREE.MeshNormalMaterial();

        for (var i = 0; i < 500; i++) {
          var mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
          mesh.position.multiplyScalar(90 + (Math.random() * 700));
          mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
          particle.add(mesh);
        }

        var geometry2 = new THREE.CubeGeometry(50,50,50);
        var material2 = new THREE.MeshNormalMaterial();
        cube = new THREE.Mesh(geometry2,material2);
        cube.position.set(0,0,100);
        scene.add(cube);

        window.addEventListener("resize", function(){
          var W = window.innerWidth;
          var H = window.innerHeight;
          renderer.setSize(W,H);
          camera.aspect = W/H;
          camera.updateProjectionMatrix();
        })

        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }

      function animate(){
        cube.rotation.x +=.005;
        cube.rotation.y +=.005;
        particle.rotation.y +=.004;

        requestAnimationFrame(animate);
        renderer.render(scene,camera);
      }
      })