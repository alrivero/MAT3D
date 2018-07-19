/**
 * @author Abraham Cardenas / (acarde12@ucsc.edu)
 * @version 1.0
 */

// global program variables
var renderer, scene, camera, controls, objMesh, object;
var ambientLight, ptLightArr = [];
var GridXY1, GridXY2;
var GridXZ1, GridXZ2;
var GridYZ1, GridYZ2;
var GridSizes, GridXYCol, GridXZCol, GridYZCol;
var transformArr = [];
var xTransVal = 0, yTransVal = 0, zTransVal = 0;
var xScaleVal = 0, yScaleVal = 0, zScaleVal = 0;
var xShearVal = 0, yShearVal = 0, zShearVal = 0;
var xRotVal = 0, yRotVal = 0, zRotVal = 0;

function init(){
  // RENDERER
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0xA0A0A0);
  renderer.setSize(300, 300);
  //document.body.appendChild(renderer.domElement);
  //document.body.appendChild(document.getElementById('content'));

  // CAMERA & SCENE
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  scene = new THREE.Scene();
  //scene.background = new THREE.Color(0xA0A0A0);

  // CAMERA CONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  // LIGHTING
  ptLightArr.push(new THREE.PointLight(0xffffff, 1, 0));
  ptLightArr.push(new THREE.PointLight(0xffffff, 1, 0));
  ptLightArr.push(new THREE.PointLight(0xffffff, 1, 0));

  ptLightArr[0].position.set(0, 200, 0);
  ptLightArr[1].position.set(100, 200, 100);
  ptLightArr[2].position.set(-100, -200, -100);

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
  camera.position.x = 25;
  camera.position.y = 25;
  camera.position.z = 25;

  // INITIAL COORDINATE SYSTEM
  GridSizes = 40;
  GridXYCol = new THREE.Color(0x008800);
  GridXZCol = new THREE.Color(0x000088);
  GridYZCol = new THREE.Color(0x880000);

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
