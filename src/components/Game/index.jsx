import React, {Component} from 'react'
import { createRef } from 'react/cjs/react.production.min';
import * as THREE from 'three';
import * as GSAP from 'gsap';

let scene, camera, renderer;

let game = createRef();

class Game extends Component {

  constructor(props) {
    super(props)
    this.animate = this.animate.bind(this)
    this.animation = this.animation.bind(this)
    this.mesh = undefined;
    this.tl = undefined;
    this.raycaster = undefined;
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

    window.addEventListener('resize', this.resize)
    this.animate()
    return renderer.domElement;
  }
  resize() {
    renderer.setSize(game.current.clientWidth, game.current.clientHeight);
    camera.aspect = game.current.clientWidth/game.current.clientHeight;
    camera.updateProjectionMatrix()
  }
  new () {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshLambertMaterial({color: 0xFFCC00})
    this.mesh = new THREE.Mesh(geometry, material);

    scene.add(this.mesh)

    var light = new THREE.PointLight(0xFFFFFF, 1, 500);
    light.position.set(10,0,25);
    scene.add(light)
    this.animation()
  }
  animation() {
    this.tl = new GSAP.TimelineMax();
    this.tl.to(this.mesh.scale, 1, {x: 2, ease: GSAP.Expo.easeOut})
    this.tl.to(this.mesh.scale, .5, {z: .5, ease: GSAP.Expo.easeOut})
    this.tl.to(this.mesh.position, .5, {x: 2, ease: GSAP.Expo.easeOut})
    this.tl.to(this.mesh.rotation, .5, {y: Math.PI*.5, ease: GSAP.Expo.easeOut}, "=-1.5")
    this.animate();
  }
  //animation
  animate(){
    requestAnimationFrame(this.animate);    
    
    renderer.render(scene,camera);
  }
  componentDidMount() {
    game.current.appendChild(this.init());
    this.resize()
  }

  render() {    
      return <div ref={game} className='content-container'></div>;
  }
}

export default Game