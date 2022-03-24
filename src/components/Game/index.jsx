import React, {useEffect, Component} from 'react'
import { createRef } from 'react/cjs/react.production.min';
import * as THREE from 'three';

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
scene.background = new THREE.Color(0x2a3b4c);

//add camera
camera = new THREE.PerspectiveCamera(
    75,
    game.current.clientWidth/game.current.clientHeight
);

//renderer
renderer = new THREE.WebGLRenderer();
renderer.setSize(game.current.clientWidth, game.current.clientHeight);

//add geometry
var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 5;


return renderer.domElement;

}

//animation
animate(){
  requestAnimationFrame(this.animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
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