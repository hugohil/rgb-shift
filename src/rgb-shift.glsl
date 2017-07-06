precision highp float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D texture;
uniform float impulseRX;
uniform float impulseRY;
uniform float impulseGX;
uniform float impulseGY;
uniform float impulseBX;
uniform float impulseBY;
uniform vec2 mousePosition;
uniform float shiftRadius;
uniform float delta;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main () {
  float diffX = map(vUv.x, 0.0, mousePosition.x, 0.0, shiftRadius);
  float diffY = map(vUv.y, 0.0, mousePosition.y, 0.0, shiftRadius);

  float offsetRX = diffX * delta * impulseRX;
  float offsetRY = diffY * delta * impulseRY;
  float offsetGX = diffX * delta * impulseGX;
  float offsetGY = diffY * delta * impulseGY;
  float offsetBX = diffX * delta * impulseBX;
  float offsetBY = diffY * delta * impulseBY;

  vec2 ROffset = vec2(vUv.x + offsetRX, vUv.y + offsetRY);
  vec2 GOffset = vec2(vUv.x + offsetGX, vUv.y + offsetGY);
  vec2 BOffset = vec2(vUv.x + offsetBX, vUv.y + offsetBY);

  float r = texture2D(texture, ROffset).r;
  float g = texture2D(texture, GOffset).g;
  float b = texture2D(texture, BOffset).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
