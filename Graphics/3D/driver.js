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


/*
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
*/

function init(){
  // setting up the canvas, scene, and camera
  var canvas = document.getElementById('canvas');
  renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(500, 500);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x696969);
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

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
  var ambient = new THREE.AmbientLight(0xDCDCDC);

  // scene
  scene.add(ambient);
  scene.add(keyLight);
  scene.add(fillLight);
  scene.add(backLight);

  // manually load obj file and mtl file
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath('objects/R2D2/');
  mtlLoader.setPath('objects/R2D2/');
  mtlLoader.load('r2-d2.mtl', function(materials){

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('objects/R2D2/');
    objLoader.load('r2-d2.obj', function(obj){
      objMesh = new THREE.Mesh(obj, materials);
      object = obj;
      object.name = 'r2d2';
      scene.add(obj);
      //object.position.y -= 60;

      centerCameraOnObject(object);

      var gridXZ = new THREE.GridHelper(1000, 250, new THREE.Color(0xffffff), new THREE.Color(0x00AA00));
      //gridXZ.position.set( 0,0,100 );
      scene.add(gridXZ);

      var gridXY = new THREE.GridHelper(1000, 250, new THREE.Color(0xffffff), new THREE.Color(0x0000AA));
    //  gridXY.position.set( 0,0,0 );
      gridXY.rotation.x = Math.PI/2;
      scene.add(gridXY);

      var gridYZ = new THREE.GridHelper(1000, 250, new THREE.Color(0xffffff), new THREE.Color(0xAA0000));
      //gridYZ.position.set( 0,0,100 );
      gridYZ.rotation.z = Math.PI/2;
      scene.add(gridYZ);
    });

  });

  // read obj file and zip file
  var fileInput = document.getElementById('fileInput');
  fileInput.type = 'file';

  fileInput.addEventListener('change', function(ev){
    var filename = (fileInput.files[0]).name;
    var reader = new FileReader();

    reader.addEventListener('progress', function(event){
      var size = '(' + Math.floor(event.total / 1000) + ' KB)';
      //var progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';
      console.log('Loading', filename, size);
    } );
    reader.addEventListener('load', function(event){
      var prevObj = object;
      removeEntity(object);

      var extension = filename.split('.').pop().toLowerCase();

      switch(extension){
        case 'obj':
          var contents = event.target.result;
          object = new THREE.OBJLoader().parse(contents);
          object.name = filename;
          scene.add(object);

          centerCameraOnObject(object);

          break;

        case 'zip':
          var dateBefore = new Date();

          JSZip.loadAsync(ev.target.files[0])
          .then(function(zip){
            var dateAfter = new Date();
            var objFile = '', mtlFile = '';

            console.log("Loaded in " + (dateAfter - dateBefore) + "ms");
            zip.forEach(function(relativePath, zipEntry){
              var currExt = zipEntry.name.split('.').pop().toLowerCase();
              if(zipEntry.name.indexOf("__MACOSX") == -1){
                if(currExt == 'obj'){
                  objFile = zipEntry.name;
                }
                else if(currExt == 'mtl'){
                  mtlFile = zipEntry.name;
                }
              }
            });
            if(objFile != '' && mtlFile != ''){
              let mtl = zip.file(mtlFile).async("text");
              let obj = zip.file(objFile).async("text");

              return Promise.resolve([mtl, obj, objFile]);
            }
            else{
              // throw an error and break from promises
              console.log("ERROR");
            }
          }, function(e){
              console.log("Error reading " + ev.target.files[0].name + ": " + e.message);
          }).then(async function([mtl, obj, objFile]){
            var resMtl = await mtl;
            var resObj = await obj;

            var mtlLoader = new THREE.MTLLoader();
            var materials = mtlLoader.parse(resMtl);
            var objLoader = new THREE.OBJLoader();
            object = objLoader.setMaterials(materials).parse(resObj);
            objMesh = new THREE.Mesh(object, materials);
            object.name = objFile;
            scene.add(object);

            centerCameraOnObject(object);
          });
          break;

        default:
          console.log('Error, select an obj or zip file.');
          object = prevObj;
          scene.add(object);
          break;
      }
    });
    reader.readAsText(fileInput.files[0]);
  }, false );
  document.body.appendChild(fileInput);

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

function centerCameraOnObject(object){
  var objBox = new THREE.Box3();
  objBox.setFromObject(object);
  var objHeight = objBox.max.y - objBox.min.y;
  var objWidth = objBox.max.x - objBox.min.x;
  controls.reset();
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 0;
  camera.position.z = objWidth + objWidth;
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
