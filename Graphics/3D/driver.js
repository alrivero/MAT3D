/**
 * @author Abraham Cardenas / https://github.com/Abe-Crdns (acarde12@ucsc.edu)
 * @version 1.0
 */

// global program variables
var renderer, scene, camera, controls, objMesh, object;
var ambientLight, ptLightArr = [];
var xLight1, yLight1, zLight1;
var xLight2, yLight2, zLight2;
var xLight3, yLight3, zLight3;
var GridXY1, GridXY2;
var GridXZ1, GridXZ2;
var GridYZ1, GridYZ2;
var GridSizes, GridXYCol, GridXZCol, GridYZCol;
var transformArr = [];
var xShearVal = '0', yShearVal = '0', zShearVal = '0';
/*
var xTransVal = '0', yTransVal = '0', zTransVal = '0';
var xScaleVal = 0, yScaleVal = 0, zScaleVal = 0;
var xRotVal = 0,  yRotVal = 0, zRotVal = 0;
*/

function init(){
  // RENDERER
  var canvas = document.getElementById('canvas1');
  renderer = new THREE.WebGLRenderer({canvas: canvas}, {antialias: true});
  renderer.setClearColor(0xA0A0A0);
  renderer.setSize(window.innerHeight-10, window.innerHeight-10);

  // CAMERA & SCENE
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  scene = new THREE.Scene();

  // CAMERA CONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  // LIGHTING
  ptLightArr.push(new THREE.PointLight(0xffffff, 1, 0));
  ptLightArr.push(new THREE.PointLight(0xffffff, 1, 0));
  ptLightArr.push(new THREE.PointLight(0xffffff, 1, 0));

  xLight1 = 0; yLight1 = 200; zLight1 = 0;
  ptLightArr[0].position.set(xLight1, yLight1, zLight1);
  xLight2 = 100; yLight2 = 200; zLight2 = 100;
  ptLightArr[1].position.set(xLight2, yLight2, zLight2);
  xLight3 = -100; yLight3 = -200; zLight3 = -100;
  ptLightArr[2].position.set(xLight3, yLight3, zLight3);

  scene.add(ptLightArr[0]);
  scene.add(ptLightArr[1]);
  scene.add(ptLightArr[2]);

  ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  // INITIAL CUBE OBJECT
  object = new THREE.BoxGeometry(2, 2, 2);
  object.name = 'cube1';
  var material = new THREE.MeshStandardMaterial();
  objMesh = new THREE.Mesh(object, material);
  objMesh.material.color.setHex(0x2194ce);
  objMesh.name = 'cube1';
  scene.add(objMesh);

  // ADJUST THE SCENE
  controls.reset();
  objMesh.position.x = 1;
  objMesh.position.y = 1;
  objMesh.position.z = 1;
  camera.position.x = 20;
  camera.position.y = 20;
  camera.position.z = 20;

  // INITIAL COORDINATE SYSTEM
  GridSizes = 40;
  GridXYCol = new THREE.Color(0x008800);
  GridXZCol = new THREE.Color(0x000088);
  GridYZCol = new THREE.Color(0x880000);

  var testGrid = new CircularLabeledGrid(100, 10, 0x000088, 0.4, true, "#000000", "center", [0, 1, 0]);
  testGrid.name = "Lit";
  scene.add(testGrid);

  GridXZ1 = new LabeledGrid(GridSizes, GridSizes, 10, [0, 1, 0], 0x000088, 0.4, true, "#000000", "left");
  GridXZ1.name = "GridXZ1";
  scene.add(GridXZ1);
  GridXZ2 = new LabeledGrid(GridSizes, GridSizes, 10, [0, -1, 0], 0x000088, 0.4, true, "#000000", "left");
  GridXZ2.name = "GridXZ2";
  scene.add(GridXZ2);

  GridXY1 = new LabeledGrid(GridSizes, GridSizes, 10, [0, 0, 1], 0x008800, 0.4, true, "#000000", "left");
  GridXY1.name = "GridXY1";
  scene.add(GridXY1);
  GridXY2 = new LabeledGrid(GridSizes, GridSizes, 10, [0, 0, -1], 0x008800, 0.4, true, "#000000", "left");
  GridXY2.name = "GridXY2";
  scene.add(GridXY2);

  GridYZ1 = new LabeledGrid(GridSizes, GridSizes, 10, [1, 0, 0], 0x880000, 0.4, true, "#000000", "left");
  GridYZ1.name = "GridYZ1";
  scene.add(GridYZ1);
  GridYZ2 = new LabeledGrid(GridSizes, GridSizes, 10, [-1, 0, 0], 0x880000, 0.4, true, "#000000", "left");
  GridYZ2.name = "GridYZ2";
  scene.add(GridYZ2);

  // GUI
  setupGui();

  // EVENTS
  window.addEventListener('resize', function(){
    renderer.setSize(window.innerHeight-10, window.innerHeight-10);
  }, false);

  animate();
}

var animate = function(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

// calls the init function when the window is done loading.
window.onload = init;
