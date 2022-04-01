
        let mode = THREE.EquirectangularReflectionMapping;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 200);
        var renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        var controls = new THREE.OrbitControls(camera, renderer.domElement);

        var loader = new THREE.TextureLoader();
        const texture1 = loader.load('images/Panorama-Salzwedel-Museumsplatz_4000x2000.jpg');
        // texture1.mapping = THREE.EquirectangularRefractionMapping;
        texture1.mapping = mode;
        scene.background = texture1;

        var baseObj = new THREE.Group();

        var sphereGeometry = new THREE.SphereBufferGeometry(50, 64, 48);

        // var first = new THREE.Mesh(sphereGeometry, new THREE.MeshPhysicalMaterial({
        var first = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({
            color: "white",
            envMap: texture1,
            refractionRatio: 0.05,
            premultipliedAlpha: false,
            roughness: 0,
            metalness: 1.0,
        }));
        first.material.envMap.mapping = mode;
        baseObj.add(first);
        scene.add(baseObj);

        render();

        function render() {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        const theSwitch = document.querySelector('.toggle');
        theSwitch.addEventListener('change', event => {
            if (theSwitch.checked) {
                mode = THREE.EquirectangularRefractionMapping;
            } else {
                mode = THREE.EquirectangularReflectionMapping;
            }
            first.material.envMap.mapping = mode;
            first.material.needsUpdate = true;
        });

        // set size according to dimensions of viewport
        function setSize() {
            var width = window.innerWidth,
                height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', setSize);

    