#pragma glslify: pnoise = require('glsl-noise/periodic/2d')

precision highp float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D texture;

void main () {
  vec4 color = texture2D(texture, vUv);
  gl_FragColor = color;
}
