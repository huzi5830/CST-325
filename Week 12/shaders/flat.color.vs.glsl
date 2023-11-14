precision mediump float;

attribute vec3 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
   gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);
}