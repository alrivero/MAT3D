/**
 * @author Abraham Cardenas / https://github.com/Abe-Crdns (acarde12@ucsc.edu)
 */

 /**
  * Reads the file within fileInput.files[0]. Files supported in this current version are obj, stl, and zip files.
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

/**
 * Adjusts the current object and its mesh and resets the controls and camera.
 *
 * @param {THREE.BufferGeometry}
 * @param {THREE.Mesh}
 */
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
  camera.position.x = 15;
  camera.position.y = 15;
  camera.position.z = 15;
}

/**
 * Removes an entity from the scene.
 *
 * @param {THREE.BufferGeometry}
 * @param {THREE.Scene}
 */
function removeEntity(object, scene){
  var selectedObject = scene.getObjectByName(object.name);
  scene.remove(selectedObject);
  animate();
}

/**
 * Checks the type of the current "object" being displayed and removes it from the scene.
 */
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
  //console.clear();
  document.getElementById("log").innerHTML = "";
  object = null; objMesh = null;
}

/**
 * Displays the loading screen.
 */
function displayLoadScreen(){
  document.getElementById("content").innerHTML =
  '<object id="loadScreen" type="text/html" data="loadingScreen/index.html"></object>';
  document.getElementById('loadScreen').setAttribute("height", 500);
  document.getElementById('loadScreen').setAttribute("width", 500);
}

/**
 * Removes the loading screen.
 */
function removeLoadScreen(){
  var loadScreen = document.getElementById('loadScreen');
  loadScreen.parentNode.removeChild(loadScreen);
}

/**
 * Loads the different lighting options in the gui.
 *
 * @param {dat.GUI}
 * @param {boolean} - Is the ambient light on?
 * @param {boolean} - Is point light #1 on?
 * @param {boolean} - Is point light #2 on?
 * @param {boolean} - Is point light #3 on?
 */
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
    handleLightOnOff(value, isAmbient, ambientLight, ambientCol);
  });
  var ambientCol = ambientLightFldr.addColor(ambientData, 'Color').onChange(handleLightColor(ambientLight.color));

  // POINT LIGHT #1
  var light1Fldr = lightsFldr.addFolder('Point Light #1');
  var light1Data = {
    'Light #1 on?': true,
    'Color': ptLightArr[0].color.getHex()
  };
  var light1 = light1Fldr.add(light1Data, 'Light #1 on?').name('Light #1 on?').listen();
  light1.onChange(function(value){
    handleLightOnOff(value, isLight1, ptLightArr[0], light1Col, xlight1Pos, ylight1Pos, zlight1Pos);
  });
  var light1Col = light1Fldr.addColor(light1Data, 'Color').onChange(handleLightColor(ptLightArr[0].color));
  var light1PosFldr = light1Fldr.addFolder('Position');
  var light1PosData = {
    'x': xLight1,
    'y': yLight1,
    'z': zLight1
  };
  var xlight1Pos = light1PosFldr.add(light1PosData, 'x').min(-500).max(500).step(1).name('x').listen();
  xlight1Pos.onChange(function(value){ handleLightPos(value, 'light1', 'x') });
  var ylight1Pos = light1PosFldr.add(light1PosData, 'y').min(-500).max(500).step(1).name('y').listen();
  ylight1Pos.onChange(function(value){ handleLightPos(value, 'light1', 'y') });
  var zlight1Pos = light1PosFldr.add(light1PosData, 'z').min(-500).max(500).step(1).name('z').listen();
  zlight1Pos.onChange(function(value){ handleLightPos(value, 'light1', 'z') });

  // POINT LIGHT #2
  var light2Fldr = lightsFldr.addFolder('Point Light #2');
  var light2Data = {
    'Light #2 on?': true,
    'Color': ptLightArr[1].color.getHex()
  };
  var light2 = light2Fldr.add(light2Data, 'Light #2 on?').name('Light #2 on?').listen();
  light2.onChange(function(value){
    handleLightOnOff(value, isLight2, ptLightArr[1], light2Col, xlight2Pos, ylight2Pos, zlight2Pos);
  });
  var light2Col = light2Fldr.addColor(light2Data, 'Color').onChange(handleLightColor(ptLightArr[1].color));
  var light2PosFldr = light2Fldr.addFolder('Position');
  var light2PosData = {
    'x': xLight2,
    'y': yLight2,
    'z': zLight2
  };
  var xlight2Pos = light2PosFldr.add(light2PosData, 'x').min(-500).max(500).step(1).name('x').listen();
  xlight2Pos.onChange(function(value){ handleLightPos(value, 'light2', 'x') });
  var ylight2Pos = light2PosFldr.add(light2PosData, 'y').min(-500).max(500).step(1).name('y').listen();
  ylight2Pos.onChange(function(value){ handleLightPos(value, 'light2', 'y') });
  var zlight2Pos = light2PosFldr.add(light2PosData, 'z').min(-500).max(500).step(1).name('z').listen();
  zlight2Pos.onChange(function(value){ handleLightPos(value, 'light2', 'z') });

  // POINT LIGHT #3
  var light3Fldr = lightsFldr.addFolder('Point Light #3');
  var light3Data = {
    'Light #3 on?': true,
    'Color': ptLightArr[2].color.getHex()
  };
  var light3 = light3Fldr.add(light3Data, 'Light #3 on?').name('Light #3 on?').listen();
  light3.onChange(function(value){
    handleLightOnOff(value, isLight3, ptLightArr[2], light3Col, xlight3Pos, ylight3Pos, zlight3Pos);
  });
  var light3Col = light3Fldr.addColor(light3Data, 'Color').onChange(handleLightColor(ptLightArr[2].color));
  var light3PosFldr = light3Fldr.addFolder('Position');
  var light3PosData = {
    'x': xLight3,
    'y': yLight3,
    'z': zLight3
  };
  var xlight3Pos = light3PosFldr.add(light3PosData, 'x').min(-500).max(500).step(1).name('x').listen();
  xlight3Pos.onChange(function(value){ handleLightPos(value, 'light3', 'x') });
  var ylight3Pos = light3PosFldr.add(light3PosData, 'y').min(-500).max(500).step(1).name('y').listen();
  ylight3Pos.onChange(function(value){ handleLightPos(value, 'light3', 'y') });
  var zlight3Pos = light3PosFldr.add(light3PosData, 'z').min(-500).max(500).step(1).name('z').listen();
  zlight3Pos.onChange(function(value){ handleLightPos(value, 'light3', 'z') });
}

/**
 * Loads the different transformation options.
 *
 * @param {dat.GUI}
 */
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
  xTrans.onFinishChange(function(value){ handleTransfm(value, 'translate', 'x'); });
  var yTrans = translateFldr.add(transData, 'y');
  yTrans.onFinishChange(function(value){ handleTransfm(value, 'translate', 'y'); });
  var zTrans = translateFldr.add(transData, 'z');
  zTrans.onFinishChange(function(value){ handleTransfm(value, 'translate', 'z'); });

  // SCALE
  var scaleFldr = transformFldr.addFolder('Scale');
  var scaleData = function(){
    this.x = '0';
    this.y = '0';
    this.z = '0';
  };
  var scleData = new scaleData();
  var xScale = scaleFldr.add(scleData, 'x');
  xScale.onFinishChange(function(value){ handleTransfm(value, 'scale', 'x'); });
  var yScale = scaleFldr.add(scleData, 'y');
  yScale.onFinishChange(function(value){ handleTransfm(value, 'scale', 'y'); });
  var zScale = scaleFldr.add(scleData, 'z');
  zScale.onFinishChange(function(value){ handleTransfm(value, 'scale', 'z'); });

  // SHEAR
  var shearFldr = transformFldr.addFolder('Shear');
  var shearData = function(){
    this.x = '0';
    this.y = '0';
    this.z = '0';
  };
  var shrData = new shearData();
  var xShear = shearFldr.add(shrData, 'x');
  xShear.onFinishChange(function(value){ handleTransfm(value, 'shear', 'x'); });
  var yShear = shearFldr.add(shrData, 'y');
  yShear.onFinishChange(function(value){ handleTransfm(value, 'shear', 'y'); });
  var zShear = shearFldr.add(shrData, 'z');
  zShear.onFinishChange(function(value){ handleTransfm(value, 'shear', 'z'); });

  // ROTATION
  var rotatFldr = transformFldr.addFolder('Rotation');
  var rotatData = function(){
    this.x = '0';
    this.y = '0';
    this.z = '0';
  };
  var rotData = new rotatData();
  var xRot = rotatFldr.add(rotData, 'x');
  xRot.onFinishChange(function(value){ handleTransfm(value, 'rotation', 'x'); });
  var yRot = rotatFldr.add(rotData, 'y');
  yRot.onFinishChange(function(value){ handleTransfm(value, 'rotation', 'y'); });
  var zRot = rotatFldr.add(rotData, 'z');
  zRot.onFinishChange(function(value){ handleTransfm(value, 'rotation', 'z'); });
}

/**
 * Loads the different coordinate system options.
 *
 * @param {dat.GUI}
 */
function loadGuiCoordSys(gui){
  var coordFldr = gui.addFolder('Coordinate Planes');

  // XY PLANE
  var xyFldr = coordFldr.addFolder('XY Plane');
  var opacityXYVal = 0.4;
  var xyData = {
    'Grid color': GridXYCol.getHex(),
    'Text color': textColXY.getHex(),
    'opacity': opacityXYVal,
    'size': GridSizes,
  };
  xyFldr.addColor(xyData, 'Grid color').onChange(function(value){ handleGridColor(value, GridXYCol, GridXY1, GridXY2) });
  xyFldr.addColor(xyData, 'Text color').onChange(function(value){ handleTextColor(value, textColXY, GridXY1, GridXY2) });
  var xyOpacity = xyFldr.add(xyData, 'opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
  xyOpacity.onChange(function(value){ handleGridOpacity(value, GridXY1, GridXY2) });
  var xySize = xyFldr.add(xyData, 'size' ).min(10).max(500).step(5).name('Size').listen();
  xySize.onChange(function(value){ handleGridSize(value, GridXY1, GridXY2) });

  // XZ PLANE
  var xzFldr = coordFldr.addFolder('XZ Plane');
  var opacityXZVal = 0.4;
  var xzData = {
    'Grid color': GridXZCol.getHex(),
    'Text color': textColXZ.getHex(),
    'Opacity': opacityXZVal,
    'Size': GridSizes
  };
  xzFldr.addColor(xzData, 'Grid color').onChange(function(value){ handleGridColor(value, GridXZCol, GridXZ1, GridXZ2) });
  xzFldr.addColor(xzData, 'Text color').onChange(function(value){ handleTextColor(value, textColXZ, GridXZ1, GridXZ2) });
  var xzOpacity = xzFldr.add(xzData, 'Opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
  xzOpacity.onChange(function(value){ handleGridOpacity(value, GridXZ1, GridXZ2) });
  var xzSize = xzFldr.add(xzData, 'Size' ).min(10).max(500).step(5).name('Size').listen();
  xzSize.onChange(function(value){ handleGridSize(value, GridXZ1, GridXZ2) });

  // YZ PLANE
  var yzFldr = coordFldr.addFolder('YZ Plane');
  var opacityYZVal = 0.4;
  var yzData = {
    'Grid color': GridYZCol.getHex(),
    'Text color': textColYZ.getHex(),
    'Opacity': opacityYZVal,
    'Size': GridSizes
  };
  yzFldr.addColor(yzData, 'Grid color').onChange(function(value){ handleGridColor(value, GridYZCol, GridYZ1, GridYZ2) });
  yzFldr.addColor(yzData, 'Text color').onChange(function(value){ handleTextColor(value, textColYZ, GridYZ1, GridYZ2) });
  var yzOpacity = yzFldr.add(yzData, 'Opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
  yzOpacity.onChange(function(value){ handleGridOpacity(value, GridYZ1, GridYZ2) });
  var yzSize = yzFldr.add(yzData, 'Size' ).min(10).max(500).step(5).name('Size').listen();
  yzSize.onChange(function(value){ handleGridSize(value, GridYZ1, GridYZ2) });
}

/**
 * Resets all the transformations that were applied to the current object being displayed.
 */
function resetTransfms(){
  var resMat = new THREE.Matrix4().identity();
  for(var i = 0; i < transformArr.length; i++){
    var temp = new THREE.Matrix4();
    var invMat = temp.getInverse(transformArr[i]);
    resMat.multiply(invMat);
  }
  objMesh.geometry.applyMatrix(resMat);
  objMesh.geometry.verticesNeedUpdate = true;
  controls.reset();
  camera.position.x = 15;
  camera.position.y = 15;
  camera.position.z = 15;

  transformArr = [];
  //console.clear();
  document.getElementById("log").innerHTML = "";
}

/**
 * Changes the position of a given light type.
 *
 * @param {number} - The number that sets the value of the light position.
 * @param {string} - Specifies which light type needs a position change.
 * @param {string} - Specifies which direction to apply the light position change.
 */
function handleLightPos(value, lightType, dir){
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

/**
 * Applies a transformation to the current object on screen.
 *
 * @param {number} - The number that sets the value of the transformation.
 * @param {string} - Specifies the transformation type.
 * @param {string} - Specifies which direction to apply the transformation.
 */
function handleTransfm(value, transformType, dir){
  var num = exprToNum(value);
  if(num != null){
    if(num == 0){
      return;
    }
    else if((transformType == 'translate' || transformType == 'scale' || transformType == 'shear') && num > 250){
      console.log("Error, can not apply a " + transformType + " transformation larger than 250 units.");
      return;
    }
    else{
      var strNum = num.toString();
      switch(transformType){
        case 'translate':
          var transMat;
          switch(dir){
            case 'x':
              transMat = new THREE.Matrix4().makeTranslation(num, 0, 0);
              console.log("Translated in the x direction by " + strNum + " units.");
              break;

            case 'y':
              transMat = new THREE.Matrix4().makeTranslation(0, num, 0);
              console.log("Translated in the y direction by " + strNum + " units.");
              break;

            case 'z':
              transMat = new THREE.Matrix4().makeTranslation(0, 0, num);
              console.log("Translated in the z direction by " + strNum + " units.");
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
              console.log("Scaled in the x direction by " + strNum + " units.");
              break;

            case 'y':
              scaleMat = new THREE.Matrix4().makeScale(1, num, 1);
              console.log("Scaled in the y direction by " + strNum + " units.");
              break;

            case 'z':
              scaleMat = new THREE.Matrix4().makeScale(1, 1, num);
              console.log("Scaled in the z direction by " + strNum + " units.");
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
                console.log("Sheared in the x direction by " + strNum + " units.");
                break;

              case 'y':
                shearMat = new THREE.Matrix4().makeShear(0, num, 0);
                console.log("Sheared in the y direction by " + strNum + " units.");
                break;

              case 'z':
                shearMat = new THREE.Matrix4().makeShear(0, 0, num);
                console.log("Sheared in the z direction by " + strNum + " units.");
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
              console.log("Rotated in the x direction by " + strNum + " degrees.");
              break;

            case 'y':
              rotMat = new THREE.Matrix4().makeRotationY(rad);
              console.log("Rotated in the y direction by " + strNum + " degrees.");
              break;

            case 'z':
              rotMat = new THREE.Matrix4().makeRotationZ(rad);
              console.log("Rotated in the z direction by " + strNum + " degrees.");
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

/**
 * Changes the type of object that is being displayed.
 *
 * @param {string} - The object type to display.
 */
function handleObjectType(objType){
  switch(objType){
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
  camera.position.x = 15;
  camera.position.y = 15;
  camera.position.z = 15;
}

/**
 * Turns off the given light and disables its gui options.
 *
 * @param {boolean} - The boolean to change if the light is on or off.
 * @param {boolean} - Is the given light on?
 * @param {THREE.Light}
 * @param {Object} - The object within the gui that controls the color for the
 *                   given light type.
 * @param {Object} - The object within the gui that controls the options for the
 *                   x position of a given light type (can't be ambient).
 * @param {Object} - The object within the gui that controls the options for the
 *                   y position of a given light type (can't be ambient).
 * @param {Object} - The object within the gui that controls the options for the
 *                   z position of a given light type (can't be ambient).
 */
function handleLightOnOff(value, isOn, lightObj, lightCol, xLight, yLight, zLight){
  isOn = value;
  xLight = xLight || '';
  yLight = yLight || '';
  zLight = zLight || '';
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

/**
 * Changes the grid size of a given grid.
 *
 * @param {number} - The new value of the grid size of the given grid.
 * @param {LabeledGrid}
 * @param {LabeledGrid}
 */
function handleGridSize(value, grid1, grid2){
  grid1.resize(value, value);
  grid2.resize(value, value);
}

/**
 * Changes the opacity of a given grid.
 *
 * @param {number} - The new value of the opacity of the given grid.
 * @param {LabeledGrid}
 * @param {LabeledGrid}
 */
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

/**
 * Changes the color of the labels of a given grid.
 *
 * @param {number} - The decimal value of the new color.
 * @param {Object} - The object within the gui that controls the color for the grid labels.
 * @param {LabeledGrid}
 * @param {LabeledGrid}
 */
function handleTextColor(value, textCol, grid1, grid2){
  var decToHex = value.toString(16);
  var hexStr1 = ('#' + decToHex);
  var hexStr2 = ('0x' + decToHex);
  textCol.setHex(hexStr2);
  grid1.setTextColor(hexStr1);
  grid2.setTextColor(hexStr1);
  grid2._textRotateZ(-Math.PI/2);
}

/**
 * Changes the color of a given grid.
 *
 * @param {number} - The decimal value of the new color.
 * @param {Object} - The object within the gui that controls the color for the grid.
 * @param {LabeledGrid}
 * @param {LabeledGrid}
 */
function handleGridColor(val, gridCol, grid1, grid2){
  var hexStr = ('0x' + val.toString(16));
  gridCol.setHex(hexStr);
  grid1.setColor(gridCol.getHex());
  grid2.setColor(gridCol.getHex());
}

/**
 * Changes the light color whenever the color is changed.
 *
 * @param {THREE.Color}
 */
function handleLightColor(color){
	return function(value){
    if(typeof value === 'string'){
      value = value.replace('#', '0x');
    }
    color.setHex(value);
	};
}

/**
 * Determines if a given string input is a valid expression and returns the value of
 * that expression if it is valid.
 *
 * @param {string} - The string to check for an expression.
 * @returns {number} - The value of a valid expression.
 */
function exprToNum(input){
  // Check if the input is a valid expression
  var checkInput = input;
  var prnthesesInd1 = checkInput.indexOf("(");
  var prnthesesInd2 = checkInput.indexOf(")");
  var piInd = checkInput.indexOf("pi");
  var eInd = checkInput.indexOf("e");
  var addInd = checkInput.indexOf("+");
  var subInd = checkInput.indexOf("-");
  var multInd = checkInput.indexOf("*");
  var divInd = checkInput.indexOf("/");
  var deciInd = checkInput.indexOf(".");
  var invalInput = false;

  if((divInd != -1 && divInd != 0 && divInd != checkInput.length) || (multInd != -1 && multInd != 0 &&
    multInd != checkInput.length) || (subInd != -1 && subInd != 0 && subInd != checkInput.length) ||
    (addInd != -1 && addInd != 0 && addInd != checkInput.length) || (deciInd != -1) || (piInd != -1) ||
    (eInd != -1) || ((prnthesesInd1 != -1) && (prnthesesInd2 != -1))){

    while(prnthesesInd1 != -1 && prnthesesInd2 != -1){
      prnthesesInd1 = checkInput.indexOf("(");
      prnthesesInd2 = checkInput.indexOf(")");
      checkInput = checkInput.replace("(", '');
      checkInput = checkInput.replace(")", '');
    }

    while(piInd != -1){
      piInd = checkInput.indexOf("pi");
      checkInput = checkInput.replace("pi", Math.PI.toString());
    }

    while(eInd != -1){
      eInd = checkInput.indexOf("e");
      checkInput = checkInput.replace("e", Math.E.toString());
    }

    var prevDeciInd;
    deciInd = checkInput.indexOf(".");
    while(deciInd != -1){
      deciInd = checkInput.indexOf(".");
      if(deciInd == prevDeciInd){
        invalInput = true;
        break;
      }
      checkInput = checkInput.replace(".", '');
      prevDeciInd = deciInd;
    }

    var prevAddInd;
    while(addInd != -1){
      addInd = checkInput.indexOf("+");
      if(addInd == prevAddInd){
        invalInput = true;
        break;
      }
      checkInput = checkInput.replace("+", '');
      prevAddInd = addInd;
    }

    var prevSubInd;
    while(subInd != -1){
      subInd = checkInput.indexOf("-");
      if(subInd == prevSubInd){
        invalInput = true;
        break;
      }
      checkInput = checkInput.replace("-", '');
      prevSubInd = subInd;
    }

    var prevMultInd;
    while(multInd != -1){
      multInd = checkInput.indexOf("*");
      if(multInd == prevMultInd){
        invalInput = true;
        break;
      }
      checkInput = checkInput.replace("*", '');
      prevMultInd = multInd;
    }

    var prevDivInd;
    while(divInd != -1){
      divInd = checkInput.indexOf("/");
      if(divInd == prevDivInd){
        invalInput = true;
        break;
      }
      checkInput = checkInput.replace("/", '');
      prevDivInd = divInd;
    }

    if(/^\d+$/.test(checkInput) && !invalInput){

      var piInd = input.indexOf("pi");
      while(piInd != -1){
        if(piInd != 0 && /^\d+$/.test(input[piInd-1]) && /^\d+$/.test(input[piInd+2])){
          input = input.replace("pi", "*" + Math.PI.toString() + "*");
        }
        else if(piInd != 0 && /^\d+$/.test(input[piInd-1])){
          input = input.replace("pi", "*" + Math.PI.toString());
        }
        else if(/^\d+$/.test(input[piInd+2])){
          input = input.replace("pi", Math.PI.toString() + "*");
        }
        else{
          input = input.replace("pi", Math.PI.toString());
        }

        piInd = input.indexOf("pi");
      }

      var eInd = input.indexOf("e");
      while(eInd != -1){
        if(eInd != 0 && /^\d+$/.test(input[eInd-1]) && /^\d+$/.test(input[eInd+2])){
          input = input.replace("e", "*" + Math.E.toString() + "*");
        }
        else if(eInd != 0 && /^\d+$/.test(input[eInd-1])){
          input = input.replace("e", "*" + Math.E.toString());
        }
        else if(/^\d+$/.test(input[eInd+2])){
          input = input.replace("e", Math.E.toString() + "*");
        }
        else{
          input = input.replace("e", Math.E.toString());
        }

        eInd = input.indexOf("e");
      }

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
    console.log("Error, "+ input + " is not a number.");
  }
}
