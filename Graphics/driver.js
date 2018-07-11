/*
 *  AUTHOR: Abraham Cardenas (acarde12@ucsc.edu)
 *  VERSION: 1.0
 *
 */

// global program variables
var renderer;
var controls;
var scene;
var camera;
var objMesh;
var object;

// global transformations variables (somehow set by the matrix calculator)
var xTrans;
var yTrans;
var zTrans;
var aScale;
var bScale;
var cScale;
var dScale;
var eScale;
var fScale;
var thetaRot;

function init(){
  // setting up the canvas, scene, and camera
  var canvas = document.getElementById('canvas');
  renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(500, 500);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 5;

  document.body.appendChild(renderer.domElement);

  // camera controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  // lighting
  var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
  keyLight.position.set(-100, 0, 100);
  var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
  fillLight.position.set(100, 0, 100);
  var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
  backLight.position.set(100, 0, -100).normalize();
  var ambient = new THREE.AmbientLight(0x808080); // soft white light

  // scene
  scene.add(ambient);
  scene.add(keyLight);
  scene.add(fillLight);
  scene.add(backLight);

  // manually load obj file and mtl file
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath('objects/Aventador/');
  mtlLoader.setPath('objects/Aventador/');
  mtlLoader.load('Avent.mtl', function(materials){

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('objects/Aventador/');
    objLoader.load('Avent.obj', function(obj){
      objMesh = new THREE.Mesh(obj, materials);
      object = obj;
      object.name = 'avent';
      scene.add(obj);
      //object.position.y -= 60;
    });

  });

  // coordinate system
  var gridHelper = new THREE.GridHelper(20, 20);
  scene.add(gridHelper);

  var fileInput = document.getElementById('fileInput');

  fileInput.addEventListener('change', function(e){
    removeEntity(object);

    // load obj and mtl file

    /*
    // set your file encoding
    var encoding = 'ISO-8859-1';
    // create a file reader
    var reader = new FileReader();

    // set on load handler for reader
    reader.onload = function(e){
        var result = reader.result;
        loader.parse(result);
    }
    // read the file as text using the reader
    reader.readAsText(file, encoding);
    */
  });

  // temporary transformation controls
  var transControls = new function(){
    this.rotationSpeed = 0.01;
    this.scale = 1;
    this.x = 0.8;
    this.y = 0.8;
    this.z = 0.8;
    this.a = 0.1;
    this.b = 0.1;
    this.c = 0.1;
    this.d = 0.1;
    this.e = 0.1;
    this.f = 0.1;
    this.theta = 0.1;

    this.doTranslation = function(){
      // new THREE.Matrix4().makeTranslation(3,3,3);
      var translationMatrix = new THREE.Matrix4();
      translationMatrix.set(
              1, 0, 0, transControls.x,
              0, 1, 0, transControls.y,
              0, 0, 1, transControls.z,
              0, 0, 0, 1
      );
      objMesh.geometry.applyMatrix(translationMatrix);
      objMesh.geometry.verticesNeedUpdate = true;
    }

    this.doScale = function(){
      var scaleMatrix = new THREE.Matrix4();
      scaleMatrix.set(
              transControls.x, 0, 0, 0,
              0, transControls.y, 0, 0,
              0, 0, transControls.z, 0,
              0, 0, 0, 1
      );
      objMesh.geometry.applyMatrix(scaleMatrix);
      objMesh.geometry.verticesNeedUpdate = true;
    }

    this.doShearing = function(){
      var scaleMatrix = new THREE.Matrix4();
      scaleMatrix.set(
              1, this.a, this.b, 0,
              this.c, 1, this.d, 0,
              this.e, this.f, 1, 0,
              0, 0, 0, 1
      );
      objMesh.geometry.applyMatrix(scaleMatrix);
      objMesh.geometry.verticesNeedUpdate = true;
    }

    this.doRotationY = function(){
      var c = Math.cos(this.theta), s = Math.sin(this.theta);
      var rotationMatrix = new THREE.Matrix4();
      rotationMatrix.set(
              c, 0, s, 0,
              0, 1, 0, 0,
              -s, 0, c, 0,
              0, 0, 0, 1
      );
      objMesh.geometry.applyMatrix(rotationMatrix);
      objMesh.geometry.verticesNeedUpdate = true;
    }

  };
  addControls(transControls);
  animate();
}

function addControls(controlObject){
  var gui = new dat.GUI();
  gui.add(controlObject, 'doTranslation');
  gui.add(controlObject, 'doScale');
  gui.add(controlObject, 'doShearing');
  gui.add(controlObject, 'doRotationY');
}

function removeEntity(object){
  var selectedObject = scene.getObjectByName(object.name);
  scene.remove(selectedObject);
  animate();
}

var animate = function(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

// calls the init function when the window is done loading.
window.onload = init;
