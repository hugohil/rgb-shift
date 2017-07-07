#pragma glslify: pnoise = require('glsl-noise/periodic/2d')

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec2 mouse;
uniform float millis;
uniform float powerVert;
uniform float intersects;

float computeNoise (float power) {
  return pnoise(position.xy * .75, mouse * power) * pnoise(mouse, vec2(millis + power));
}

float computeTurbulence (float p) {
  float power = pow(millis, p);
  return computeNoise(pnoise(vec2(power * p), vec2(millis)) / power);
}

void main () {
  vPosition = position;
  vUv = uv;
  vNormal = normal;

  float noise = computeTurbulence(powerVert) * intersects;
  vec3 pos = position + normal * noise;
  pos.z *= 2.;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
