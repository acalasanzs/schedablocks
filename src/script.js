import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Loading
const textureLoader = new THREE.TextureLoader();

const abstract = {
    aoMap: textureLoader.load('/images/materials/abstract/Abstract_011_ambientOcclusion.jpg'),
    displacementMap: textureLoader.load('/images/materials/abstract/Abstract_011_height.png'),
    baseColor: textureLoader.load('/images/materials/abstract/Abstract_011_basecolor.jpg'),
    metallic: textureLoader.load('/images/materials/abstract/Abstract_011_metallic.jpg'),
    normalMap: textureLoader.load('/images/materials/abstract/Abstract_011_normal.jpg'),
    roughness: textureLoader.load('/images/materials/abstract/Abstract_011_roughness.jpg')
}


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(.5, 64, 64);

// Materials

const material = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.2,
    map: abstract.baseColor,
    normalMap: abstract.normalMap,
    roughnessMap: abstract.roughness,
    aoMap: abstract.aoMap,
    displacementMap: abstract.displacementMap,
    displacementScale: .15,
    metalnessMap: abstract.metallic
})

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

const ambient = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambient);
// Lights

const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.set(0,0,2);
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffff, 1)
pointLight2.position.set(0,2,0);
scene.add(pointLight2)

gui.add(sphere.material, "displacementScale").min(-3).max(3).step(0.01);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()