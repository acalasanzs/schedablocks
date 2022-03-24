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

    class FirstPersonControls {
      constructor(camera, MouseMoveSensitivity = 0.002, speed = 800.0, jumpHeight = 350.0, height = 30.0) {
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

        camera.rotation.set(0, 0, 0);

        var pitchObject = new THREE.Object3D();
        pitchObject.add(camera);

        var yawObject = new THREE.Object3D();
        yawObject.position.y = 10;
        yawObject.add(pitchObject);

        var PI_2 = Math.PI / 2;

        var onMouseMove = function (event) {

          if (scope.enabled === false)
            return;

          var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
          var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

          yawObject.rotation.y -= movementX * scope.MouseMoveSensitivity;
          pitchObject.rotation.x -= movementY * scope.MouseMoveSensitivity;

          pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));

        };

        var onKeyDown = (function (event) {

          if (scope.enabled === false)
            return;

          switch (event.keyCode) {
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
              if (canJump === true)
                velocity.y += run === false ? scope.jumpHeight : scope.jumpHeight + 50;
              canJump = false;
              break;

            case 16: // shift
              run = true;
              break;

          }

        }).bind(this);

        var onKeyUp = (function (event) {

          if (scope.enabled === false)
            return;

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

        var onMouseDownClick = (function (event) {
          if (scope.enabled === false)
            return;
          scope.click = true;
        }).bind(this);

        var onMouseUpClick = (function (event) {
          if (scope.enabled === false)
            return;
          scope.click = false;
        }).bind(this);

        scope.dispose = function () {
          window.removeEventListener('mousemove', onMouseMove, false);
          window.removeEventListener('keydown', onKeyDown, false);
          window.removeEventListener('keyup', onKeyUp, false);
          window.removeEventListener('mousedown', onMouseDownClick, false);
          window.removeEventListener('mouseup', onMouseUpClick, false);
        };

        window.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('keydown', onKeyDown, false);
        window.addEventListener('keyup', onKeyUp, false);
        window.addEventListener('mousedown', onMouseDownClick, false);
        window.addEventListener('mouseup', onMouseUpClick, false);

        scope.enabled = false;

        scope.getObject = function () {

          return yawObject;

        };

        scope.update = function () {

          var time = performance.now();
          var delta = (time - prevTime) / 1000;

          velocity.y -= 9.8 * 100.0 * delta;
          velocity.x -= velocity.x * 10.0 * delta;
          velocity.z -= velocity.z * 10.0 * delta;

          direction.z = Number(moveForward) - Number(moveBackward);
          direction.x = Number(moveRight) - Number(moveLeft);
          direction.normalize();

          var currentSpeed = scope.speed;
          if (run && (moveForward || moveBackward || moveLeft || moveRight))
            currentSpeed = currentSpeed + (currentSpeed * 1.1);

          if (moveForward || moveBackward)
            velocity.z -= direction.z * currentSpeed * delta;
          if (moveLeft || moveRight)
            velocity.x -= direction.x * currentSpeed * delta;

          scope.getObject().translateX(-velocity.x * delta);
          scope.getObject().translateZ(velocity.z * delta);

          scope.getObject().position.y += (velocity.y * delta);

          if (scope.getObject().position.y < scope.height) {

            velocity.y = 0;
            scope.getObject().position.y = scope.height;

            canJump = true;
          }
          prevTime = time;
        };
      }
    }
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

    window.addEventListener('resize', _=>{setTimeout(() => {
      this.resize();
    }, 300)})
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
    this.tl.to(this.mesh.scale, .5, {z: .05, ease: GSAP.Expo.easeOut})
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