'use strict'

require('./vendors/dat.gui.css')
const dat = require('./vendors/dat.gui.min')

const THREE = require('three')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, 1000)
const raycaster = new THREE.Raycaster()

let image = null

const mouse = new THREE.Vector2()
let time = Date.now()

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const loader = new THREE.TextureLoader()
loader.crossOrigin = 'anonymous'
loader.load(
  'https://source.unsplash.com/random',
  (texture) => {
    const ratio = (texture.image.width / texture.image.height)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        texture: { value: texture },
        millis: { value: 0.0 },
        mouse: { value: new THREE.Vector2(0, 0) },
        radius: { value: 0.75 },
        intersects: { value: 0.0 },
        powerR: { value: 0.0 },
        powerG: { value: 0.0 },
        powerB: { value: 0.0 }
      },
      fragmentShader: require('./rgb-shift.glsl'),
      vertexShader: require('./vert.glsl')
    })
    const plane = new THREE.PlaneGeometry((10 * ratio), 10, 128, 128)
    image = new THREE.Mesh(plane, material)
    image.position.z = -10
    scene.add(image)
    renderer.domElement.addEventListener('pointermove', computeMouse)
  },
  (xhr) => {},
  (xhr) => {
    console.log('An error happened')
  })

const controller = {
  maxDeltaTime: 300,
  powerR: 1.2,
  powerG: 1.015,
  powerB: 0.93
}
const gui = new dat.GUI()
gui.add(controller, 'maxDeltaTime', 100, 1000)
gui.add(controller, 'powerR', 0.5, 1.5)
gui.add(controller, 'powerG', 0.5, 1.5)
gui.add(controller, 'powerB', 0.5, 1.5)

// function clamp (value, min, max) {
//   return Math.min(Math.max(value, min), max)
// }

// function map (value, inMin, inMax, outMin, outMax) {
//   return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin)
// }

function computeMouse (event) {
  mouse.x = ((event.clientX / window.innerWidth) * 2) - 1
  mouse.y = -((event.clientY / window.innerHeight) * 2) + 1
  time = Date.now()
}

function animate () {
  window.requestAnimationFrame(animate)
  raycaster.setFromCamera(mouse, camera)

  scene.children.forEach((child) => {
    child.material.uniforms.intersects.value = 0.0
    child.rotation.x = 0
    child.rotation.y = 0
  })

  const intersects = raycaster.intersectObjects(scene.children)
  intersects.forEach(({ object, uv }) => {
    object.material.uniforms.mouse.value = uv
    object.material.uniforms.intersects.value = 1.0
    object.rotation.x = (mouse.x * 0.1)
    object.rotation.y = (mouse.y * 0.1)
  })

  image && (image.material.uniforms.millis.value = Date.now())

  image && (image.material.uniforms.powerR.value = controller.powerR)
  image && (image.material.uniforms.powerG.value = controller.powerG)
  image && (image.material.uniforms.powerB.value = controller.powerB)

  renderer.render(scene, camera)
}
animate()
