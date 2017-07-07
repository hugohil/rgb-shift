#pragma glslify: pnoise = require('glsl-noise/periodic/2d')

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec2 mouse;
uniform float intersects;

void main () {
  vPosition = position;
  vUv = uv;
  vNormal = normal;

  vec3 pos = position + normal * ((pnoise(uv, mouse) * pnoise(position.xy, mouse) * 1.25) * intersects);
  pos.z *= 10.;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
