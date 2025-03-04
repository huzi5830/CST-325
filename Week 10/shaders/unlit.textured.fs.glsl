precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;

// todo #3 - receive texture coordinates and verify correctness by 
// using them to set the pixel color 
varying vec2 vTexcoords;

void main(void) {
    // todo #5
     vec2 uv = vec2(vTexcoords.x, vTexcoords.y);
    vec4 textureColor = texture2D(uTexture, uv);
    gl_FragColor = vec4(textureColor.rgb, textureColor.a * uAlpha);
    // todo #3
    // gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
   // gl_FragColor = vec4(vTexcoords.x, vTexcoords.y, 0.0, uAlpha);
      
}

// EOF 00100001-10
