THREEx.ArToolkitContext.baseURL = '../';

var enableStats = false;

//////////////////////////////////////////////////////////////////////////////////
//		Init
//////////////////////////////////////////////////////////////////////////////////

// init renderer
var renderer = new THREE.WebGLRenderer({
  // antialias	: true,
  alpha: true,
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0);
// renderer.setPixelRatio( 1/2 );

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0px';
renderer.domElement.style.left = '0px';
document.body.appendChild(renderer.domElement);

// array of functions for the rendering loop
var onRenderFcts = [];

// init scene and camera
var scene = new THREE.Scene();

//////////////////////////////////////////////////////////////////////////////////
//		Initialize a basic camera
//////////////////////////////////////////////////////////////////////////////////

// Create a camera
var camera = new THREE.PerspectiveCamera(140, window.innerWidth / window.innerHeight, 1, 10000);
scene.add(camera);

////////////////////////////////////////////////////////////////////////////////
//          handle arToolkitSource
////////////////////////////////////////////////////////////////////////////////

var arToolkitSource = new THREEx.ArToolkitSource({
  // to read from the webcam
  // sourceType: 'webcam',

  // to read from an image
  sourceType: "image",
  sourceUrl: "./images/kanji-fullpage.png",

  // to read from a video
  // sourceType: 'video',
  // sourceUrl: './headtracking.mp4',
});

arToolkitSource.init(function onReady() {
  onResize();
});

// handle resize
window.addEventListener('resize', function () {
  onResize();
});

function onResize() {
  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
  }
}

////////////////////////////////////////////////////////////////////////////////
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////

// create atToolkitContext
var arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: 'https://raw.githubusercontent.com/allanhal/pesquisa/master/assets/camera_para.dat',
  detectionMode: 'mono',
  maxDetectionRate: 30,
  canvasWidth: 80 * 3,
  canvasHeight: 60 * 3,
});
// initialize it
arToolkitContext.init(function onCompleted() {
  // copy projection matrix to camera
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

// update artoolkit on every frame
onRenderFcts.push(function () {
  if (arToolkitSource.ready === false) return;

  arToolkitContext.update(arToolkitSource.domElement);
});

////////////////////////////////////////////////////////////////////////////////
//          Create a ArMarkerControls
////////////////////////////////////////////////////////////////////////////////

var markerRoot = new THREE.Group();
markerRoot.name = 'markerRoot';
scene.add(markerRoot);
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
  type: 'pattern',
  patternUrl: 'https://raw.githubusercontent.com/allanhal/pesquisa/master/assets/kanji.patt',
});

// build a smoothedControls
var smoothedRoot = new THREE.Group();
smoothedRoot.name = 'smoothedRoot';
scene.add(smoothedRoot);
var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
  lerpPosition: 0.4,
  lerpQuaternion: 0.3,
  lerpScale: 1,
});
onRenderFcts.push(function (delta) {
  smoothedControls.update(markerRoot);
});

//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////
var stats = new Stats();
if (enableStats) {
  document.body.appendChild(stats.dom);
}
// render the scene
onRenderFcts.push(function () {
  renderer.render(scene, camera);
  stats.update();
});

// run the rendering loop
var lastTimeMsec = null;
requestAnimationFrame(function animate(nowMsec) {
  // keep looping
  requestAnimationFrame(animate);
  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
  lastTimeMsec = nowMsec;
  // call each update function
  onRenderFcts.forEach(function (onRenderFct) {
    onRenderFct(deltaMsec / 1000, nowMsec / 1000);
  });
});
