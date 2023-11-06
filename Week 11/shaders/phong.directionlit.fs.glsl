precision mediump float;

uniform vec3 uLightDirection;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    // diffuse contribution
    // todo #1 normalize the light direction and store in a separate variable
    vec3 nLightDirection = normalize(uLightDirection);

    // todo #2 normalize the world normal and store in a separate variable
    vec3 nWorldNormal = normalize(vWorldNormal);

    // todo #3 calculate the lambert term
    vec3 materialColor = vec3(0.9, 0.9, 0.9); 
    vec3 lightColorDiffuse = vec3(1.0, 1.0, 1.0);
    vec3 colorDiffuse = materialColor* lightColorDiffuse * max(dot(nWorldNormal,nLightDirection), 0.0);

    // specular contribution
    // todo #4 in world space, calculate the direction from the surface point to the eye (normalized)
    vec3 eyeDirection = normalize(uCameraPosition - vWorldPosition);

    // todo #5 in world space, calculate the reflection vector (normalized)
    vec3 distance = dot(nLightDirection,nWorldNormal) * nWorldNormal;
    vec3 moveTo =  distance - nLightDirection;
    vec3 reflectionOfLight = nLightDirection + (2.0*moveTo);

    // todo #6 calculate the phong term
    float specPower = 64.0;
    float specTerm = max(dot(reflectionOfLight,eyeDirection),0.0);
    float phongSpecular = pow(specTerm,specPower);

    // combine
    // todo #7 apply light and material interaction for diffuse value by using the texture color as the material
    vec2 uv = vec2(vTexcoords.x, vTexcoords.y);
    vec4 textureColor = texture2D(uTexture, uv);
    materialColor = vec3(textureColor.x,textureColor.y,textureColor.z);
   

    // todo #8 apply light and material interaction for phong, assume phong material color is (0.3, 0.3, 0.3)
    vec3 lightColorSpec = vec3(0.5,0.5,0.5);


    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;
    vec3 ambient = albedo * 0.1;
    vec3 diffuseColor = materialColor * lightColorDiffuse * max(dot(nWorldNormal,nLightDirection), 0.0);
    vec3 specularColor = materialColor * lightColorSpec * phongSpecular; 

    // todo #9
    // add "diffuseColor" and "specularColor" when ready
    vec3 finalColor = ambient + diffuseColor + specularColor;
    gl_FragColor= vec4(finalColor,1.0);
    //gl_FragColor= vec4(specularColor,1.0);
    //gl_FragColor = vec4(diffuseColor,1.0);
    //gl_FragColor = vec4(phongSpecular,phongSpecular,phongSpecular,1.0);
    //gl_FragColor = vec4(reflectionOfLight,1.0);
    //gl_FragColor = vec4(eyeDirection,1.0);
    //gl_FragColor = vec4(colorDiffuse,1.0);
    //gl_FragColor = vec4(nWorldNormal,1.0);
    //gl_FragColor = vec4(nLightDirection,1.0);
    //gl_FragColor = vec4(uLightDirection,1.0);
    //gl_FragColor = vec4(finalColor, 1.0);
}

// EOF 00100001-10