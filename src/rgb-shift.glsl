#pragma glslify: pnoise = require('glsl-noise/periodic/2d')

precision highp float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D texture;
uniform vec2 mouse;
uniform float radius;
uniform float time;
uniform float intersects;

float computeNoise () {
  return pnoise(vUv, mouse) * pnoise(vUv, vec2(time * .000000002));
}

void main () {
  float noise = computeNoise() * intersects;
  vec2 offset = vUv + noise;

  float r = texture2D(texture, offset).r;
  float g = texture2D(texture, vUv).g;
  float b = texture2D(texture, vUv).b;

  gl_FragColor = vec4(r, g, b, 1.);
}
