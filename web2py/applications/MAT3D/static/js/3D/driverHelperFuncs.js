/**
 * @author Abraham Cardenas / https://github.com/Abe-Crdns (acarde12@ucsc.edu)
 */

function readFileByType(){
  var filename = (fileInput.files[0]).name;
  var reader = new FileReader();

  reader.addEventListener('progress', function(event){
    var size = '(' + Math.floor(event.total / 1000) + ' KB)';
    var progress = Math.floor( ( event.loaded / event.total ) * 100 );
    console.log("Loading " + filename + "..." + progress.toString() + "%", size);
  });

  // previous values in case invalid file
  var prevObj = object;
  var prevObjMesh = objMesh;
  var prevTransfArr = transformArr;

  removeObjByType();

  var fileExt = filename.split('.').pop().toLowerCase();

  switch(fileExt){
    case 'obj':
      var dateBefore = new Date();
      reader.addEventListener('load', function(event){
        var dateAfter = new Date();
        console.log(filename, "loaded in", (dateAfter - dateBefore), "ms");

        var contents = event.target.result;
        object = new THREE.OBJLoader().parse(contents);
        object.name = filename;
        var material = new THREE.MeshStandardMaterial();
        objMesh = new THREE.Mesh(object, material);

        scene.add(object);
        adjustObjAndCam(object, objMesh);
        removeLoadScreen();
      });
      reader.readAsText(fileInput.files[0]);
      break;

    case 'stl':
      var dateBefore = new Date();
      reader.addEventListener('load', function(event){
        var dateAfter = new Date();
        console.log(filename, "loaded in", (dateAfter - dateBefore), "ms");

        var contents = event.target.result;

        var geometry = new THREE.STLLoader().parse(contents);
        object = geometry;
        object.name = filename;
        geometry.sourceType = "stl";
        geometry.sourceFile = fileInput.files[0].name;

        var material = new THREE.MeshStandardMaterial();
        objMesh = new THREE.Mesh(geometry, material);
        objMesh.name = filename;

        scene.add(objMesh);
        adjustObjAndCam(objMesh, objMesh);
        removeLoadScreen();
        console.log();
      }, false);

      if(reader.readAsBinaryString !== undefined){
        reader.readAsBinaryString(fileInput.files[0]);
      }
      else{
        reader.readAsArrayBuffer(fileInput.files[0]);
      }
      break;

    case 'zip':
      reader.addEventListener('load', function(event){
        var dateBefore = new Date();

        JSZip.loadAsync(fileInput.files[0])
        .then(function(zip){
          var dateAfter = new Date();
          var objFile = '', mtlFile = '';

          console.log("Loaded " + filename + " in " + (dateAfter - dateBefore) + "ms");
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
            console.log("Error, did not find obj and mtl file within the zip file.");
            object = prevObj;
            objMesh = prevObjMesh;

            var objName = object.name;
            if(objName != 'cube1' && objName != 'teapot1' && objName != 'sphere1' && objName != 'cylinder1' && fileExt != 'stl'){
              scene.add(object);
            }
            else{
              scene.add(objMesh);
            }
            removeLoadScreen();
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

          adjustObjAndCam(object, objMesh);
          setTimeout(removeLoadScreen, 1500);
        });
      });
      reader.readAsBinaryString(fileInput.files[0]);
      break;

    default:
      console.log('Error, select an obj, stl, or zip file.');
      object = prevObj;
      objMesh = prevObjMesh;
      transformArr = prevTransfArr;

      var objName = object.name;
      if(objName != 'cube1' && objName != 'teapot1' && objName != 'sphere1' && objName != 'cylinder1' && fileExt != 'stl'){
        scene.add(object);
      }
      else{
        scene.add(objMesh);
      }
      removeLoadScreen();
      break;
  }
}

function adjustObjAndCam(object, objMesh){
  var objBox = new THREE.Box3();
  objBox.setFromObject(object);

  var objHeight = objBox.max.y - objBox.min.y;
  var objWidth = objBox.max.x - objBox.min.x;
  var objDepth = objBox.max.z - objBox.min.z;

  if(objHeight > 30 || objWidth > 30 || objDepth > 30){
    var maxVal = Math.max(objHeight, objWidth, objDepth);
    var scaleMatrix = new THREE.Matrix4();
    scaleMatrix.set(
            10/maxVal, 0, 0, 0,
            0, 10/maxVal, 0, 0,
            0, 0, 10/maxVal, 0,
            0, 0, 0, 1
    );
    objMesh.geometry.applyMatrix(scaleMatrix);
    objMesh.geometry.verticesNeedUpdate = true;

    objBox = new THREE.Box3();
    objBox.setFromObject(object);
  }
  controls.reset();
  object.position.x = 0;
  object.position.y = 0;
  object.position.z = 0;
  camera.position.x = 20;
  camera.position.y = 20;
  camera.position.z = 20;
}

function removeEntity(object, scene){
  var selectedObject = scene.getObjectByName(object.name);
  scene.remove(selectedObject);
  animate();
}

function removeObjByType(){
  // delete displayed object
  var objName = object.name;
  var objExt = objName.split('.').pop().toLowerCase();
  if(objExt != 'stl' && objName != 'cube1' && objName != 'teapot1' && objName != 'sphere1' && objName != 'cylinder1'){
    removeEntity(object, scene);
  }
  else{
    removeEntity(objMesh, scene);
  }
  transformArr = [];
  console.clear();
  object = null; objMesh = null;
}

function displayLoadScreen(){
  document.getElementById("content").innerHTML =
  '<object id="loadScreen" type="text/html" data="loadingScreen/index.html"></object>';
  document.getElementById('loadScreen').setAttribute("height", 500);
  document.getElementById('loadScreen').setAttribute("width", 500);
}

function removeLoadScreen(){
  var loadScreen = document.getElementById('loadScreen');
  loadScreen.parentNode.removeChild(loadScreen);
}

function setupGui(){
  var gui = new dat.GUI({autoPlace: false});
  var customContainer = document.getElementById('a_gui');
  customContainer.appendChild(gui.domElement);
  var isAmbient = true, isLight1 = true, isLight2 = true, isLight3 = true;

  // PREDEFINED OBJECTS
  var objData = {
    objects: "Cube"
  };
  var objectTypes = gui.add(objData, 'objects', [ "Cube", "Teapot", "Sphere", "Cylinder", "File" ] ).name('Object').listen();
	objectTypes.onChange(function(value){ handleObjectType(value) });

  var backgroundData = {
    Background: '#A0A0A0',
  };
  var color = new THREE.Color();
  var colorConvert = handleColorChange(color);
  gui.addColor(backgroundData, 'Background').onChange(function(value){
    colorConvert(value);
    renderer.setClearColor(color.getHex());
  });

  // LIGHTS FOLDER
  loadGuiLights(gui, isAmbient, isLight1, isLight2, isLight3);

  // TRANSFORMATIONS FOLDER
  loadGuiTransfms(gui);

  // COORDINATE SYSTEM COLORS, OPACITY & SIZE
  loadGuiCoordSys(gui);

  var resetData = {
    reset: function(){ resetObj() }
  };
  gui.add(resetData, 'reset').name("Reset Object");

}

function loadGuiLights(gui, isAmbient, isLight1, isLight2, isLight3){
  // LIGHTS
  var lightsFldr = gui.addFolder('Lighting');

  // AMBIENT
  var ambientLightFldr = lightsFldr.addFolder('Ambient Light');
  var ambientData = {
    'Ambient on?': true,
    'Color': ambientLight.color.getHex()
  };
  var ambient = ambientLightFldr.add(ambientData, 'Ambient on?').name('Ambient on?').listen();
  ambient.onChange(function(value){
    handleLightChange(value, isAmbient, ambientCol, ambientLight);
  });
  var ambientCol = ambientLightFldr.addColor(ambientData, 'Color').onChange(handleColorChange(ambientLight.color));

  // POINT LIGHT #1
  var light1Fldr = lightsFldr.addFolder('Point Light #1');
  var light1Data = {
    'Light #1 on?': true,
    'Color': ptLightArr[0].color.getHex()
  };
  var light1 = light1Fldr.add(light1Data, 'Light #1 on?').name('Light #1 on?').listen();
  light1.onChange(function(value){
    handleLightChange(value, isLight1, light1Col, ptLightArr[0], xlight1Pos, ylight1Pos, zlight1Pos);
  });
  var light1Col = light1Fldr.addColor(light1Data, 'Color').onChange(handleColorChange(ptLightArr[0].color));
  var light1PosFldr = light1Fldr.addFolder('Position');
  var light1PosData = {
    'x': xLight1,
    'y': yLight1,
    'z': zLight1
  };
  var xlight1Pos = light1PosFldr.add(light1PosData, 'x').min(-500).max(500).step(1).name('x').listen();
  xlight1Pos.onChange(function(value){ handleLightPosChange(value, 'light1', 'x') });
  var ylight1Pos = light1PosFldr.add(light1PosData, 'y').min(-500).max(500).step(1).name('y').listen();
  ylight1Pos.onChange(function(value){ handleLightPosChange(value, 'light1', 'y') });
  var zlight1Pos = light1PosFldr.add(light1PosData, 'z').min(-500).max(500).step(1).name('z').listen();
  zlight1Pos.onChange(function(value){ handleLightPosChange(value, 'light1', 'z') });

  // POINT LIGHT #2
  var light2Fldr = lightsFldr.addFolder('Point Light #2');
  var light2Data = {
    'Light #2 on?': true,
    'Color': ptLightArr[1].color.getHex()
  };
  var light2 = light2Fldr.add(light2Data, 'Light #2 on?').name('Light #2 on?').listen();
  light2.onChange(function(value){
    handleLightChange(value, isLight2, light2Col, ptLightArr[1], xlight2Pos, ylight2Pos, zlight2Pos);
  });
  var light2Col = light2Fldr.addColor(light2Data, 'Color').onChange(handleColorChange(ptLightArr[1].color));
  var light2PosFldr = light2Fldr.addFolder('Position');
  var light2PosData = {
    'x': xLight2,
    'y': yLight2,
    'z': zLight2
  };
  var xlight2Pos = light2PosFldr.add(light2PosData, 'x').min(-500).max(500).step(1).name('x').listen();
  xlight2Pos.onChange(function(value){ handleLightPosChange(value, 'light2', 'x') });
  var ylight2Pos = light2PosFldr.add(light2PosData, 'y').min(-500).max(500).step(1).name('y').listen();
  ylight2Pos.onChange(function(value){ handleLightPosChange(value, 'light2', 'y') });
  var zlight2Pos = light2PosFldr.add(light2PosData, 'z').min(-500).max(500).step(1).name('z').listen();
  zlight2Pos.onChange(function(value){ handleLightPosChange(value, 'light2', 'z') });

  // POINT LIGHT #3
  var light3Fldr = lightsFldr.addFolder('Point Light #3');
  var light3Data = {
    'Light #3 on?': true,
    'Color': ptLightArr[2].color.getHex()
  };
  var light3 = light3Fldr.add(light3Data, 'Light #3 on?').name('Light #3 on?').listen();
  light3.onChange(function(value){
    handleLightChange(value, isLight3, light3Col, ptLightArr[2], xlight3Pos, ylight3Pos, zlight3Pos);
  });
  var light3Col = light3Fldr.addColor(light3Data, 'Color').onChange(handleColorChange(ptLightArr[2].color));
  var light3PosFldr = light3Fldr.addFolder('Position');
  var light3PosData = {
    'x': xLight3,
    'y': yLight3,
    'z': zLight3
  };
  var xlight3Pos = light3PosFldr.add(light3PosData, 'x').min(-500).max(500).step(1).name('x').listen();
  xlight3Pos.onChange(function(value){ handleLightPosChange(value, 'light3', 'x') });
  var ylight3Pos = light3PosFldr.add(light3PosData, 'y').min(-500).max(500).step(1).name('y').listen();
  ylight3Pos.onChange(function(value){ handleLightPosChange(value, 'light3', 'y') });
  var zlight3Pos = light3PosFldr.add(light3PosData, 'z').min(-500).max(500).step(1).name('z').listen();
  zlight3Pos.onChange(function(value){ handleLightPosChange(value, 'light3', 'z') });
}

function loadGuiTransfms(gui){
  var transformFldr = gui.addFolder('Transformations');

  // TRANSLATE
  var translateFldr = transformFldr.addFolder('Translate');
  var translateData = function(){
    this.x = '0';
    this.y = '0';
    this.z = '0';
  };
  var transData = new translateData();
  var xTrans = translateFldr.add(transData, 'x');
  xTrans.onFinishChange(function(value){ handleTransfmChange(value, 'translate', 'x'); });
  var yTrans = translateFldr.add(transData, 'y');
  yTrans.onFinishChange(function(value){ handleTransfmChange(value, 'translate', 'y'); });
  var zTrans = translateFldr.add(transData, 'z');
  zTrans.onFinishChange(function(value){ handleTransfmChange(value, 'translate', 'z'); });

  // SCALE
  var scaleFldr = transformFldr.addFolder('Scale');
  var scaleData = function(){
    this.x = '0';
    this.y = '0';
    this.z = '0';
  };
  var scleData = new scaleData();
  var xScale = scaleFldr.add(scleData, 'x');
  xScale.onFinishChange(function(value){ handleTransfmChange(value, 'scale', 'x'); });
  var yScale = scaleFldr.add(scleData, 'y');
  yScale.onFinishChange(function(value){ handleTransfmChange(value, 'scale', 'y'); });
  var zScale = scaleFldr.add(scleData, 'z');
  zScale.onFinishChange(function(value){ handleTransfmChange(value, 'scale', 'z'); });

  // SHEAR
  var shearFldr = transformFldr.addFolder('Shear');
  var shearData = function(){
    this.x = '0';
    this.y = '0';
    this.z = '0';
  };
  var shrData = new shearData();
  var xShear = shearFldr.add(shrData, 'x');
  xShear.onFinishChange(function(value){ handleTransfmChange(value, 'shear', 'x'); });
  var yShear = shearFldr.add(shrData, 'y');
  yShear.onFinishChange(function(value){ handleTransfmChange(value, 'shear', 'y'); });
  var zShear = shearFldr.add(shrData, 'z');
  zShear.onFinishChange(function(value){ handleTransfmChange(value, 'shear', 'z'); });

  // ROTATION
  var rotatFldr = transformFldr.addFolder('Rotation');
  var rotatData = function(){
    this.x = '0';
    this.y = '0';
    this.z = '0';
  };
  var rotData = new rotatData();
  var xRot = rotatFldr.add(rotData, 'x');
  xRot.onFinishChange(function(value){ handleTransfmChange(value, 'rotation', 'x'); });
  var yRot = rotatFldr.add(rotData, 'y');
  yRot.onFinishChange(function(value){ handleTransfmChange(value, 'rotation', 'y'); });
  var zRot = rotatFldr.add(rotData, 'z');
  zRot.onFinishChange(function(value){ handleTransfmChange(value, 'rotation', 'z'); });
}

function loadGuiCoordSys(gui){
  var coordFldr = gui.addFolder('Coordinate Planes');
  var xyFldr = coordFldr.addFolder('XY Plane');
  var opacityXYVal = 0.4;
  var xyData = {
    'Color': GridXYCol.getHex(),
    'opacity': opacityXYVal,
    'size': GridSizes
  };
  var xyCol = xyFldr.addColor(xyData, 'Color').onChange(function(value){ handleGridColor(value, GridXYCol, GridXY1, GridXY2) });
  var xyOpacity = xyFldr.add(xyData, 'opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
  xyOpacity.onChange(function(value){ handleGridOpacity(value, GridXY1, GridXY2) });
  var xySize = xyFldr.add(xyData, 'size' ).min(10).max(500).step(5).name('Size').listen();
  xySize.onChange(function(value){ GridXY1.resize(value, value); GridXY2.resize(value, value); });

  var xzFldr = coordFldr.addFolder('XZ Plane');
  var opacityXZVal = 0.4;
  var xzData = {
    'Color': GridXZCol.getHex(),
    'Opacity': opacityXZVal,
    'Size': GridSizes
  };
  var xzCol = xzFldr.addColor(xzData, 'Color').onChange(function(value){ handleGridColor(value, GridXZCol, GridXZ1, GridXZ2) });
  var xzOpacity = xzFldr.add(xzData, 'Opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
  xzOpacity.onChange(function(value){ handleGridOpacity(value, GridXZ1, GridXZ2) });
  var xzSize = xzFldr.add(xzData, 'Size' ).min(10).max(500).step(5).name('Size').listen();
  xzSize.onChange(function(value){ GridXZ1.resize(value, value); GridXZ2.resize(value, value); });

  var yzFldr = coordFldr.addFolder('YZ Plane');
  var opacityYZVal = 0.4;
  var yzData = {
    'Color': GridYZCol.getHex(),
    'Opacity': opacityYZVal,
    'Size': GridSizes
  };
  var yzCol = yzFldr.addColor(yzData, 'Color').onChange(function(value){ handleGridColor(value, GridYZCol, GridYZ1, GridYZ2) });
  var yzOpacity = yzFldr.add(yzData, 'Opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
  yzOpacity.onChange(function(value){ handleGridOpacity(value, GridYZ1, GridYZ2) });
  var yzSize = yzFldr.add(yzData, 'Size' ).min(10).max(500).step(5).name('Size').listen();
  yzSize.onChange(function(value){ GridYZ1.resize(value, value); GridYZ2.resize(value, value); });
}

function resetObj(){
  var resMat = new THREE.Matrix4().identity();
  for(var i = 0; i < transformArr.length; i++){
    var temp = new THREE.Matrix4();
    var invMat = temp.getInverse(transformArr[i]);
    resMat.multiply(invMat);//objMesh.geometry.applyMatrix(invMat);
    //objMesh.geometry.verticesNeedUpdate = true;
  }
  objMesh.geometry.applyMatrix(resMat);
  objMesh.geometry.verticesNeedUpdate = true;

  transformArr = [];
  console.clear();
}

function handleLightPosChange(value, lightType, dir){
  switch(lightType){
    case 'light1':
      switch(dir){
        case 'x':
          xLight1 = value;
          ptLightArr[0].position.set(xLight1, yLight1, zLight1);
          break;

        case 'y':
          yLight1 = value;
          ptLightArr[0].position.set(xLight1, yLight1, zLight1);
          break;

        case 'z':
          zLight1 = value;
          ptLightArr[0].position.set(xLight1, yLight1, zLight1);
          break;

        default:
          break;
      }
      break;

    case 'light2':
      switch(dir){
        case 'x':
          xLight2 = value;
          ptLightArr[1].position.set(xLight2, yLight2, zLight2);
          break;

        case 'y':
          yLight2 = value;
          ptLightArr[1].position.set(xLight2, yLight2, zLight2);
          break;

        case 'z':
          zLight2 = value;
          ptLightArr[1].position.set(xLight2, yLight2, zLight2);
          break;

        default:
          break;
      }
      break;

    case 'light3':
      switch(dir){
        case 'x':
          xLight3 = value;
          ptLightArr[2].position.set(xLight3, yLight3, zLight3);
          break;

        case 'y':
          yLight3 = value;
          ptLightArr[2].position.set(xLight3, yLight3, zLight3);
          break;

        case 'z':
          zLight3 = value;
          ptLightArr[2].position.set(xLight3, yLight3, zLight3);
          break;

        default:
          break;
      }
      break;

    default:
      break;
  }
}

function handleTransfmChange(value, transformType, dir){
  var num = stringToNum(value);
  if(num != null){
    if(num == 0){
      return;
    }
    else{
      switch(transformType){
        case 'translate':
          var transMat;
          switch(dir){
            case 'x':
              transMat = new THREE.Matrix4().makeTranslation(num, 0, 0);
              console.log("Translated in the x direction by", num, "units.");
              break;

            case 'y':
              transMat = new THREE.Matrix4().makeTranslation(0, num, 0);
              console.log("Translated in the y direction by", num, "units.");
              break;

            case 'z':
              transMat = new THREE.Matrix4().makeTranslation(0, 0, num);
              console.log("Translated in the z direction by", num, "units.");
              break;

            default:
              console.log("?_? ._.");
              break;
          }
          transformArr.push(transMat);
          objMesh.geometry.applyMatrix(transMat);
          objMesh.geometry.verticesNeedUpdate = true;
          break;

        case 'scale':
          var scaleMat;
          switch(dir){
            case 'x':
              scaleMat = new THREE.Matrix4().makeScale(num, 1, 1);
              console.log("Scaled in the x direction by", num, "units.");
              break;

            case 'y':
              scaleMat = new THREE.Matrix4().makeScale(1, num, 1);
              console.log("Scaled in the y direction by", num, "units.");
              break;

            case 'z':
              scaleMat = new THREE.Matrix4().makeScale(1, 1, num);
              console.log("Scaled in the z direction by", num, "units.");
              break;

            default:
              console.log("?_? ._.");
              break;
          }
          transformArr.push(scaleMat);
          objMesh.geometry.applyMatrix(scaleMat);
          objMesh.geometry.verticesNeedUpdate = true;
          break;

        case 'shear':
          var shearMat;
          if(fileInput.files[0] != null){
            console.log("Due to a bug, shear is disabled in file mode, sorry!");
          }
          else{
            switch(dir){
              case 'x':
                shearMat = new THREE.Matrix4().makeShear(num, 0, 0);
                console.log("Sheared in the x direction by", num, "units.");
                break;

              case 'y':
                shearMat = new THREE.Matrix4().makeShear(0, num, 0);
                console.log("Sheared in the y direction by", num, "units.");
                break;

              case 'z':
                shearMat = new THREE.Matrix4().makeShear(0, 0, num);
                console.log("Sheared in the z direction by", num, "units.");
                break;

              default:
                console.log("?_? ._.");
                break;
            }
            transformArr.push(shearMat);
            objMesh.geometry.applyMatrix(shearMat);
            objMesh.geometry.verticesNeedUpdate = true;
          }
          break;

        case 'rotation':
          var rotMat;
          var rad = num * (Math.PI/180);
          switch(dir){
            case 'x':
              rotMat = new THREE.Matrix4().makeRotationX(rad);
              console.log("Rotated in the x direction by", num, "degrees.");
              break;

            case 'y':
              rotMat = new THREE.Matrix4().makeRotationY(rad);
              console.log("Rotated in the y direction by", num, "degrees.");
              break;

            case 'z':
              rotMat = new THREE.Matrix4().makeRotationZ(rad);
              console.log("Rotated in the z direction by", num, "degrees.");
              break;

            default:
              console.log("?_? ._.");
              break;
          }
          transformArr.push(rotMat);
          objMesh.geometry.applyMatrix(rotMat);
          objMesh.geometry.verticesNeedUpdate = true;
          break;

        default:
          console.log("NANI?!");
          break;
      }
    }
  }

}

function handleObjectType(value){
  switch(value){
    case 'Cube':
      // delete displayed object
      removeObjByType();

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
      break;

    case 'Teapot':
      // delete displayed object
      removeObjByType();

      object = new THREE.TeapotBufferGeometry(1);
      object.name = 'teapot1';
      var material = new THREE.MeshStandardMaterial();
      objMesh = new THREE.Mesh(object, material);
      objMesh.material.color.setHex(0x2194ce);
      objMesh.name = 'teapot1';
      scene.add(objMesh);

      // ADJUST THE SCENE
      controls.reset();
      objMesh.position.x = 2.5;
      objMesh.position.y = 1;
      objMesh.position.z = 1.5;
      break;

    case 'Sphere':
      // delete displayed object
      removeObjByType();

      object = new THREE.SphereGeometry(1, 32, 32);
      object.name = 'sphere1';
      var material = new THREE.MeshStandardMaterial();
      objMesh = new THREE.Mesh(object, material);
      objMesh.material.color.setHex(0x2194ce);
      objMesh.name = 'sphere1';
      scene.add(objMesh);

      // ADJUST THE SCENE
      controls.reset();
      objMesh.position.x = 1;
      objMesh.position.y = 1;
      objMesh.position.z = 1;
      break;

    case 'Cylinder':
      // delete displayed object
      removeObjByType();

      object = new THREE.CylinderGeometry(1, 1, 2, 48);
      object.name = 'cylinder1';
      var material = new THREE.MeshStandardMaterial();
      objMesh = new THREE.Mesh(object, material);
      objMesh.material.color.setHex(0x2194ce);
      objMesh.name = 'cylinder1';
      scene.add(objMesh);

      // ADJUST THE SCENE
      controls.reset();
      objMesh.position.x = 1;
      objMesh.position.y = 1;
      objMesh.position.z = 1;
      break;

    case 'File':
      document.getElementById('fileInput').click();
      fileInput.type = 'file';
      fileInput.addEventListener('change', function(){
        displayLoadScreen();
        setTimeout(readFileByType, 500);
      }, false);
      break;

    default:
      console.log("How'd you get here? HAX!");
      break;
  }
  camera.position.x = 25;
  camera.position.y = 25;
  camera.position.z = 25;
}

function handleLightChange(value, isOn, lightCol, lightObj, xLight, yLight, zLight){
  isOn = value;
  if(!isOn){
    lightObj.intensity = 0;
    lightCol.domElement.style.pointerEvents = "none";
    lightCol.domElement.style.opacity = 0.5;
    if(lightObj != ambientLight){
      xLight.domElement.style.pointerEvents = "none";
      xLight.domElement.style.opacity = 0.5;
      yLight.domElement.style.pointerEvents = "none";
      yLight.domElement.style.opacity = 0.5;
      zLight.domElement.style.pointerEvents = "none";
      zLight.domElement.style.opacity = 0.5;
    }
  }
  else if(lightCol.domElement.style.pointerEvents == "none" && isOn){
    lightObj.intensity = 0.75;
    lightCol.domElement.style.pointerEvents = "auto";
    lightCol.domElement.style.opacity = 1.0;
    if(lightObj != ambientLight){
      xLight.domElement.style.pointerEvents = "auto";
      xLight.domElement.style.opacity = 1.0;
      yLight.domElement.style.pointerEvents = "auto";
      yLight.domElement.style.opacity = 1.0;
      zLight.domElement.style.pointerEvents = "auto";
      zLight.domElement.style.opacity = 1.0;
    }
  }
}

function handleGridOpacity(value, grid1, grid2){
  if(value == 0.0){
    grid1.toggle(false);
    grid2.toggle(false);
  }
  else{
    if((!grid1.getToggle()) && (!grid2.getToggle())){
      grid1.toggle(true);
      grid2.toggle(true);
    }
    grid1.setOpacity(value);
    grid2.setOpacity(value);
  }
}

function handleGridColor(val, gridCol, grid1, grid2){
  var hexStr = ('0x' + val.toString(16));
  gridCol.setHex(hexStr);
  grid1.setColor(gridCol.getHex());
  grid2.setColor(gridCol.getHex());
}

function handleColorChange(color){
	return function(value){
    if(typeof value === 'string'){
      value = value.replace('#', '0x');
    }
    color.setHex(value);
	};
}

function stringToNum(input){
  // Check if the input is a valid expression
  var checkInput = input;
  if((checkInput.indexOf("/") != -1 && checkInput.indexOf("/") != 0 && checkInput.indexOf("/") != checkInput.length)
      || checkInput.indexOf(".") != -1){

    while(checkInput.indexOf("/") != -1){
      var backspceIndex = checkInput.indexOf("/");
      checkInput = checkInput.slice(0, backspceIndex) + checkInput.slice(backspceIndex+1, checkInput.length);
    }
    while(checkInput.indexOf(".") != -1){
      var decimalIndex = checkInput.indexOf(".");
      checkInput = checkInput.slice(0, decimalIndex) + checkInput.slice(decimalIndex+1, checkInput.length);
    }
    if(/^\d+$/.test(checkInput)){
      if(isFinite(eval(input))){
        return eval(input);
      }
      else{
        console.log("Error, division by zero.");
      }
    }
  }
  if(!isNaN(input)){
    return +input;
  }
  else{
    console.log("Error,", input, "is not a number.");
  }
}
