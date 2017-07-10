#pragma glslify: pnoise = require('glsl-noise/periodic/2d')

precision highp float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D texture;
uniform vec2 mouse;
uniform float radius;
uniform float millis;
uniform float intersects;
uniform float powerR;
uniform float powerG;
uniform float powerB;

float computeTurbulence (float p) {
  float power = pow(millis, p);
  return pnoise(vec2(power * p), vec2(millis)) / power;
}

void main () {
  // vec2 offsetR = vUv + (computeTurbulence(powerR) * intersects);
  // vec2 offsetG = vUv + (computeTurbulence(powerG) * intersects);
  // vec2 offsetB = vUv + (computeTurbulence(powerB) * intersects);
  vec2 offsetR = vUv;
  vec2 offsetG = vUv;
  vec2 offsetB = vUv;

  float r = texture2D(texture, offsetR).r;
  float g = texture2D(texture, offsetG).g;
  float b = texture2D(texture, offsetB).b;

  gl_FragColor = vec4(r, g, b, 1.);

  // vec4 color = texture2D(texture, vUv);
  // gl_FragColor = color;
}
