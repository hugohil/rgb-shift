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
        maxZ: { value: 10.0 }
      },
      side: THREE.DoubleSide,
      fragmentShader: require('./rgb-shift.glsl'),
      vertexShader: require('./vert.glsl')
    })
    const plane = new THREE.PlaneGeometry((10 * ratio), 10, 128, 128)
    image = new THREE.Mesh(plane, material)
    image.position.z = -15
    scene.add(image)
    renderer.domElement.addEventListener('pointermove', computeMouse)
  },
  (xhr) => {},
  (xhr) => {
    console.log('An error happened')
  })

// const controller = {}
// const gui = new dat.GUI()

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

  const intersects = raycaster.intersectObjects(scene.children)
  if (intersects.length) {
    renderer.domElement.classList.add('pointing')
  } else if (!intersects.length && renderer.domElement.classList.contains('pointing')) {
    renderer.domElement.classList.remove('pointing')
  } else if (!intersects.length) {
    scene.children.forEach((child) => {
      child.rotation.x > 0 && (child.rotation.x -= 0.01)
      child.rotation.y > 0 && (child.rotation.y -= 0.01)
      if (child.material.uniforms.millis.value > 0) {
        (child.material.uniforms.millis.value -= 0.25)
      }
    })
  }
  intersects.forEach(({ object, uv }) => {
    if (object.material.uniforms.millis.value <= object.material.uniforms.maxZ.value) {
      object.material.uniforms.millis.value += 0.05
    }
    object.rotation.x = (mouse.y * 0.1)
    object.rotation.y = (mouse.x * 0.1)
  })

  ++time
  stats.end()
  renderer.render(scene, camera)
}
animate()
