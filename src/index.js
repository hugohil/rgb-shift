'use strict'

require('./vendors/dat.gui.css')
const dat = require('./vendors/dat.gui.min')

const Stats = require('./vendors/stats.min')

const THREE = require('three')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, 1000)
const raycaster = new THREE.Raycaster()

let image = null

const mouse = new THREE.Vector2()
let time = 0

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const stats = new Stats()
// stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

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
        powerVert: { value: 2.0 },
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
  powerVert: 2.0,
  powerR: 0.35,
  powerG: 0.1,
  powerB: 0.25
}
const gui = new dat.GUI()
gui.add(controller, 'maxDeltaTime', 100, 1000)
gui.add(controller, 'powerVert', 0.1, 10.0)
gui.add(controller, 'powerR', 0.01, 1.0)
gui.add(controller, 'powerG', 0.01, 1.0)
gui.add(controller, 'powerB', 0.01, 1.0)

// function clamp (value, min, max) {
//   return Math.min(Math.max(value, min), max)
// }

// function map (value, inMin, inMax, outMin, outMax) {
//   return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin)
// }

function computeMouse (event) {
  mouse.x = ((event.clientX / window.innerWidth) * 2) - 1
  mouse.y = -((event.clientY / window.innerHeight) * 2) + 1
}

function animate () {
  stats.begin()
  window.requestAnimationFrame(animate)
  raycaster.setFromCamera(mouse, camera)

  scene.children.forEach((child) => {
    child.material.uniforms.intersects.value = 0.0
  })

  const intersects = raycaster.intersectObjects(scene.children)
  intersects.forEach(({ object, uv }) => {
    object.material.uniforms.mouse.value = uv
    object.material.uniforms.intersects.value = 1.0
  })

  image && (image.material.uniforms.millis.value = time / 25000)

  image && (image.material.uniforms.powerVert.value = controller.powerVert)
  image && (image.material.uniforms.powerR.value = controller.powerR)
  image && (image.material.uniforms.powerG.value = controller.powerG)
  image && (image.material.uniforms.powerB.value = controller.powerB)

  ++time
  stats.end()
  renderer.render(scene, camera)
}
animate()
