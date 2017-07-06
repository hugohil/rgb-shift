'use strict'

require('./vendors/dat.gui.css')
const dat = require('./vendors/dat.gui.min')

const THREE = require('three')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, 1000)

let image = null

let x = 0
let y = 0
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
        impulseRX: { value: 0.01 },
        impulseRY: { value: 0.01 },
        impulseGX: { value: 0.01 },
        impulseGY: { value: 0.01 },
        impulseBX: { value: 0.01 },
        impulseBY: { value: 0.01 },
        delta: { value: 0.0 },
        mousePosition: { value: new THREE.Vector2(0, 0) },
        shiftRadius: { value: 20.0 }
      },
      fragmentShader: require('./rgb-shift.glsl'),
      vertexShader: require('./vert.glsl')
    })
    const plane = new THREE.PlaneGeometry((10 * ratio), 10, 64, 64)
    image = new THREE.Mesh(plane, material)
    image.position.z = -10
    scene.add(image)
    renderer.domElement.addEventListener('mousemove', computeMouseVelocity)
  },
  (xhr) => {},
  (xhr) => {
    console.log('An error happened')
  })

const controller = {
  radius: 250,
  maxDeltaTime: 300,
  coeff: {
    r: 0.05,
    g: 0.0025,
    b: 0.005
  }
}
const gui = new dat.GUI()
gui.add(controller, 'radius', 50, 500)
gui.add(controller, 'maxDeltaTime', 100, 1000)
gui.add(controller.coeff, 'r', 0, 0.05)
gui.add(controller.coeff, 'g', 0, 0.05)
gui.add(controller.coeff, 'b', 0, 0.05)

function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function map (value, inMin, inMax, outMin, outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin)
}

function computeMouseVelocity (event) {
  const newX = event.clientX
  const newY = event.clientY

  const xDist = (newX - x)
  const yDist = (newY - y)

  x = newX
  y = newY
  time = Date.now()

  image.material.uniforms.impulseRX.value = xDist ? xDist * controller.coeff.r : 0
  image.material.uniforms.impulseRY.value = yDist ? yDist * controller.coeff.r : 0

  image.material.uniforms.impulseGX.value = xDist ? xDist * controller.coeff.g : 0
  image.material.uniforms.impulseGY.value = yDist ? yDist * controller.coeff.g : 0

  image.material.uniforms.impulseBX.value = xDist ? xDist * controller.coeff.b : 0
  image.material.uniforms.impulseBY.value = yDist ? yDist * controller.coeff.b : 0

  image.material.uniforms.mousePosition.value = new THREE.Vector2(x, y)
}

function animate () {
  window.requestAnimationFrame(animate)
  const delta = map((Date.now() - time), 0, controller.maxDeltaTime, 1, 0)
  image && (image.material.uniforms.delta.value = clamp(delta, 0, 1))
  renderer.render(scene, camera)
}
animate()
