'use strict'

var gl;

var appInput = new Input();
var time = new Time();
var camera = new OrbitCamera(appInput);

var sphereGeometry = null; // this will be created after loading from a file
var groundGeometry = null;
var barrelGeometry = null;
var orbGeometry = null;

var projectionMatrix = new Matrix4();
var lightPosition = new Vector3(4, 1.5, 0);
var orbPosition = new Vector3(4, 1.5, 0);

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
var phongShaderProgram;
var orbShader;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// we need to asynchronously fetch files from the "server" (your local hard drive)
var loadedAssets = {
    phongTextVS: null, phongTextFS: null,
    sphereJSON: null,
    barrelJSON: null,
    marbleImage: null,
    crackedMudImage: null,
    barrelImage: null,
    orbTextVS:null,
    orbTextFS:null
};

// -------------------------------------------------------------------------
function initializeAndStartRendering() {
    initGL();
    loadAssets(function() {
        createShaders(loadedAssets);
        createScene();
        updateAndRender();
    });
}

// -------------------------------------------------------------------------
function initGL(canvas) {
    var canvas = document.getElementById("webgl-canvas");

    try {
        gl = canvas.getContext("webgl");
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;

        gl.enable(gl.DEPTH_TEST);
    } catch (e) {}

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

// -------------------------------------------------------------------------
function loadAssets(onLoadedCB) {
    var filePromises = [
        fetch('./shaders/phong.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/phong.pointlit.fs.glsl').then((response) => { return response.text(); }),
        fetch('./data/sphere.json').then((response) => { return response.json(); }),
        fetch('./data/barrel.json').then((response) => { return response.json(); }),
        loadImage('./data/marble.jpg'),
        loadImage('./data/crackedMud.png'),
        loadImage('./data/barrel.png'),
        fetch('./shaders/flat.color.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/flat.color.fs.glsl').then((response) => { return response.text(); })
    ];

    Promise.all(filePromises).then(function(values) {
        // Assign loaded data to our named variables
        loadedAssets.phongTextVS = values[0];
        loadedAssets.phongTextFS = values[1];
        loadedAssets.sphereJSON = values[2];
        loadedAssets.barrelJSON = values[3];
        loadedAssets.marbleImage = values[4];
        loadedAssets.crackedMudImage = values[5];
        loadedAssets.barrelImage = values[6];
        loadedAssets.orbTextVS = values[7];
        loadedAssets.orbTextFS =values[8];
    }).catch(function(error) {
        console.error(error.message);
    }).finally(function() {
        onLoadedCB();
    });
}
// -------------------------------------------------------------------------
function createShaders(loadedAssets) {
    phongShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.phongTextVS, loadedAssets.phongTextFS);
    orbShader = createCompiledAndLinkedShaderProgram(loadedAssets.orbTextVS, loadedAssets.orbTextFS);
    phongShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(phongShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(phongShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(phongShaderProgram, "aTexcoords")
    };

    phongShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uProjectionMatrix"),
        lightPositionUniform: gl.getUniformLocation(phongShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(phongShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(phongShaderProgram, "uTexture"),
    };

    orbShader.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(orbShader, "aVertexPosition"),
    };

    orbShader.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(orbShader, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(orbShader, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(orbShader, "uProjectionMatrix"),
      
    };
}

// -------------------------------------------------------------------------
function createScene() {
    groundGeometry = new WebGLGeometryQuad(gl, phongShaderProgram);
    groundGeometry.create(loadedAssets.crackedMudImage);

    var scale = new Matrix4().makeScale(10.0, 10.0, 10.0);

    // compensate for the model being flipped on its side
    var rotation = new Matrix4().makeRotationX(-90);

    groundGeometry.worldMatrix.makeIdentity();
    groundGeometry.worldMatrix.multiply(rotation).multiply(scale);

    sphereGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    sphereGeometry.create(loadedAssets.sphereJSON, loadedAssets.marbleImage);

    // Scaled it down so that the diameter is 3
    var scale = new Matrix4().makeScale(0.03, 0.03, 0.03);
    // raise it by the radius to make it sit on the ground
    var translation = new Matrix4().makeTranslation(0, 1.5, 0);

    sphereGeometry.worldMatrix.makeIdentity();
    sphereGeometry.worldMatrix.multiply(translation).multiply(scale);

    barrelGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    barrelGeometry.create(loadedAssets.barrelJSON, loadedAssets.barrelImage);

    var scaleBarrel = new Matrix4().makeScale(0.3, 0.3, 0.3);
    var translationBarrel = new Matrix4().makeTranslation(-5, 2, -5);

    barrelGeometry.worldMatrix.makeIdentity();
    barrelGeometry.worldMatrix.multiply(translationBarrel).multiply(scaleBarrel);

    orbGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    orbGeometry.create(loadedAssets.sphereJSON, loadedAssets.marbleImage);

    var orbScale = new Matrix4().makeScale(0.005, 0.005, 0.005);
    var orbTranslation = new Matrix4().makeTranslation(orbPosition.x, orbPosition.y, orbPosition.z);
    
    orbGeometry.worldMatrix.makeIdentity();
    orbGeometry.worldMatrix.multiply(orbTranslation).multiply(orbScale);

   
}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    var aspectRatio = gl.canvasWidth / gl.canvasHeight;

    // todo #10
    var light = new Vector4(lightPosition.x, lightPosition.y, lightPosition.z, 1.0);
    var rotationSpeed = 1.2;
    var rotation = new Matrix4().makeRotationY(45.0 * rotationSpeed * time.deltaTime);
    var translateToOrigin = new Matrix4().makeTranslation(-sphereGeometry.worldMatrix.elements[0], -sphereGeometry.worldMatrix.elements[5], -sphereGeometry.worldMatrix.elements[10]);
    var translateBack = new Matrix4().makeTranslation(sphereGeometry.worldMatrix.elements[0], sphereGeometry.worldMatrix.elements[5], sphereGeometry.worldMatrix.elements[10]);
    var totalTransformation = translateBack.clone().multiply(rotation.clone()).multiply(translateToOrigin.clone());
    lightPosition = totalTransformation.clone().multiplyVector(light);
    //orbGeometry.worldMatrix.multiply(totalTransformation);
    //orbGeometry.worldMatrix.elements[0] = lightPosition.x;
    //orbGeometry.worldMatrix.elements[5] = lightPosition.y;
    //orbGeometry.worldMatrix.elements[10] = lightPosition.z;

    time.update();
    camera.update(time.deltaTime);
    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    // this is a new frame so let's clear out whatever happened last frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(phongShaderProgram);
    var uniforms = phongShaderProgram.uniforms;
    var cameraPosition = camera.getPosition();
    gl.uniform3f(uniforms.lightPositionUniform, lightPosition.x, lightPosition.y, lightPosition.z);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

    projectionMatrix.makePerspective(45, aspectRatio, 0.1, 1000);
    groundGeometry.render(camera, projectionMatrix, phongShaderProgram);
    sphereGeometry.render(camera, projectionMatrix, phongShaderProgram);
    barrelGeometry.render(camera, projectionMatrix, phongShaderProgram);
    orbGeometry.render(camera, projectionMatrix, phongShaderProgram);
}

// EOF 00100001-10