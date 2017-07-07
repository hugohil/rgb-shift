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

float computeNoise (float power) {
  return pnoise(vUv, mouse * power) * pnoise(mouse, vec2(millis + power));
}

float computeTurbulence (float p) {
  float power = pow(millis, p);
  return computeNoise(pnoise(vec2(power * p), mouse) / power);
}

void main () {
  vec2 offsetR = vUv + (computeTurbulence(powerR) * intersects);
  vec2 offsetG = vUv + (computeTurbulence(powerG) * intersects);
  vec2 offsetB = vUv + (computeTurbulence(powerB) * intersects);

  float r = texture2D(texture, offsetR).r;
  float g = texture2D(texture, offsetG).g;
  float b = texture2D(texture, offsetB).b;

  gl_FragColor = vec4(r, g, b, 1.);
}
