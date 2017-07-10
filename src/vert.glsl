#pragma glslify: pnoise = require('glsl-noise/periodic/2d')

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D texture;
uniform vec2 mouse;
uniform float millis;
uniform float powerVert;
uniform float intersects;

void main () {
  vPosition = position;
  vUv = uv;
  vNormal = normal;

  vec4 color = texture2D(texture, vUv);

  //convert to grayscale using NTSC conversion weights
  float gray = dot(color.rgb, vec3(.299, .587, .114));

  // vec3 pos = position + normal * (gray * intersects);
  vec3 pos = position + normal * gray;
  pos.z *= clamp(millis, .0, 15.);
  // vec3 pos = position + normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
