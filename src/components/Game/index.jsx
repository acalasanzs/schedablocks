import React, {useEffect, Component} from 'react'
import { createRef } from 'react/cjs/react.production.min';
import * as THREE from 'three';
import * as GSAP from 'gsap';

let scene, camera, renderer, cube;
let game = createRef();
class Game extends Component {

  constructor(props) {
    super(props)
    this.animate = this.animate.bind(this)
  }

  init () {
    //creating scene
    scene = new THREE.Scene();

    //add camera
    camera = new THREE.PerspectiveCamera(
        75,
        game.current.clientWidth/game.current.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    //renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor("#a29bfe")
    renderer.setSize(game.current.clientWidth, game.current.clientHeight);

    window.addEventListener('resize', () => {
      renderer.setSize(game.current.clientWidth, game.current.clientHeight);
      camera.aspect = game.current.clientWidth/game.current.clientHeight;
      camera.updateProjectionMatrix()
    })


    var geometry = new THREE.SphereGeometry(1, 10, 10);
    var material = new THREE.MeshLambertMaterial({color: 0xFFCC00})
    var mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh)

    var light = new THREE.PointLight(0xFFFFFF, 1, 500);
    light.position.set(10,0,25);
    scene.add(light)

    this.animate()
    return renderer.domElement;

  }

  //animation
  animate(){
    renderer.render(scene,camera)
  }
  componentDidMount() {
    game.current.appendChild(this.init());
    this.animate();
  }

  render() {    
      return <div ref={game} className='content-container'></div>;
  }
}

export default Game