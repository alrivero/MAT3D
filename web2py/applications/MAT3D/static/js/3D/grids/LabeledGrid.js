var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Source: https://github.com/usco/glView-helpers/blob/master/src/grids/LabeledGrid.js

/*TODO:
 - refactor
 - use label helper
*/

var LabeledGrid = function (_THREE$Object3D) {
  _inherits(LabeledGrid, _THREE$Object3D);

  function LabeledGrid() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
    var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
    var upVector = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [0, 1, 0];
    var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0x00baff;
    var opacity = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.2;
    var text = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;
    var textColor = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "#000000";
    var textLocation = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : "center";

    _classCallCheck(this, LabeledGrid);

    var _this = _possibleConstructorReturn(this, (LabeledGrid.__proto__ || Object.getPrototypeOf(LabeledGrid)).call(this));

    _this.width = width;
    _this.length = length;
    _this.step = step;
    _this.color = color;
    _this.opacity = opacity;
    _this.text = text;
    _this.textColor = textColor;
    _this.textLocation = textLocation;
    _this.upVector = new THREE.Vector3().fromArray(upVector);

    _this.name = "grid";

    //TODO: clean this up
    _this.marginSize = 5;
    _this.stepSubDivisions = 10;

    _this._drawGrid();

    //default grid orientation is z up, rotate if not the case
    var upVector = _this.upVector;
    _this.up = upVector;
    _this.lookAt(upVector);
    return _this;
  }

  _createClass(LabeledGrid, [{
    key: "_drawGrid",
    value: function _drawGrid() {
      var gridGeometry, gridMaterial, mainGridZ, planeFragmentShader, planeGeometry, planeMaterial, subGridGeometry, subGridMaterial, subGridZ;

      //offset to avoid z fighting
      mainGridZ = 0;
      gridGeometry = new THREE.Geometry();
      gridMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHex(this.color),
        opacity: this.opacity,
        linewidth: 2,
        transparent: true
      });

      subGridZ = 0;
      subGridGeometry = new THREE.Geometry();
      subGridMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHex(this.color),
        opacity: this.opacity / 2,
        transparent: true
      });

      var step = this.step;
      var stepSubDivisions = this.stepSubDivisions;
      var width = this.width;
      var length = this.length;

      var centerBased = true;

      if (centerBased) {
        for (var i = 0; i <= width / 2; i += step / stepSubDivisions) {
          subGridGeometry.vertices.push(new THREE.Vector3(-length / 2, i, subGridZ));
          subGridGeometry.vertices.push(new THREE.Vector3(length / 2, i, subGridZ));

          subGridGeometry.vertices.push(new THREE.Vector3(-length / 2, -i, subGridZ));
          subGridGeometry.vertices.push(new THREE.Vector3(length / 2, -i, subGridZ));

          if (i % step == 0) {
            gridGeometry.vertices.push(new THREE.Vector3(-length / 2, i, mainGridZ));
            gridGeometry.vertices.push(new THREE.Vector3(length / 2, i, mainGridZ));

            gridGeometry.vertices.push(new THREE.Vector3(-length / 2, -i, mainGridZ));
            gridGeometry.vertices.push(new THREE.Vector3(length / 2, -i, mainGridZ));
          }
        }
        for (var i = 0; i <= length / 2; i += step / stepSubDivisions) {
          subGridGeometry.vertices.push(new THREE.Vector3(i, -width / 2, subGridZ));
          subGridGeometry.vertices.push(new THREE.Vector3(i, width / 2, subGridZ));

          subGridGeometry.vertices.push(new THREE.Vector3(-i, -width / 2, subGridZ));
          subGridGeometry.vertices.push(new THREE.Vector3(-i, width / 2, subGridZ));

          if (i % step == 0) {
            gridGeometry.vertices.push(new THREE.Vector3(i, -width / 2, mainGridZ));
            gridGeometry.vertices.push(new THREE.Vector3(i, width / 2, mainGridZ));

            gridGeometry.vertices.push(new THREE.Vector3(-i, -width / 2, mainGridZ));
            gridGeometry.vertices.push(new THREE.Vector3(-i, width / 2, mainGridZ));
          }
        }
      } else {
        for (var i = -width / 2; i <= width / 2; i += step / stepSubDivisions) {
          subGridGeometry.vertices.push(new THREE.Vector3(-length / 2, i, subGridZ));
          subGridGeometry.vertices.push(new THREE.Vector3(length / 2, i, subGridZ));

          if (i % step == 0) {
            gridGeometry.vertices.push(new THREE.Vector3(-length / 2, i, mainGridZ));
            gridGeometry.vertices.push(new THREE.Vector3(length / 2, i, mainGridZ));
          }
        }
        for (var i = -length / 2; i <= length / 2; i += step / stepSubDivisions) {
          subGridGeometry.vertices.push(new THREE.Vector3(i, -width / 2, subGridZ));
          subGridGeometry.vertices.push(new THREE.Vector3(i, width / 2, subGridZ));

          if (i % step == 0) {
            gridGeometry.vertices.push(new THREE.Vector3(i, -width / 2, mainGridZ));
            gridGeometry.vertices.push(new THREE.Vector3(i, width / 2, mainGridZ));
          }
        }
      }

      this.mainGrid = new THREE.LineSegments(gridGeometry, gridMaterial);
      //create sub grid geometry object
      this.subGrid = new THREE.LineSegments(subGridGeometry, subGridMaterial);

      //create margin
      var offsetWidth = width + this.marginSize;
      var offsetLength = length + this.marginSize;

      var marginGeometry = new THREE.Geometry();
      marginGeometry.vertices.push(new THREE.Vector3(-length / 2, -width / 2, subGridZ));
      marginGeometry.vertices.push(new THREE.Vector3(length / 2, -width / 2, subGridZ));

      marginGeometry.vertices.push(new THREE.Vector3(length / 2, -width / 2, subGridZ));
      marginGeometry.vertices.push(new THREE.Vector3(length / 2, width / 2, subGridZ));

      marginGeometry.vertices.push(new THREE.Vector3(length / 2, width / 2, subGridZ));
      marginGeometry.vertices.push(new THREE.Vector3(-length / 2, width / 2, subGridZ));

      marginGeometry.vertices.push(new THREE.Vector3(-length / 2, width / 2, subGridZ));
      marginGeometry.vertices.push(new THREE.Vector3(-length / 2, -width / 2, subGridZ));

      marginGeometry.vertices.push(new THREE.Vector3(-offsetLength / 2, -offsetWidth / 2, subGridZ));
      marginGeometry.vertices.push(new THREE.Vector3(offsetLength / 2, -offsetWidth / 2, subGridZ));

      marginGeometry.vertices.push(new THREE.Vector3(offsetLength / 2, -offsetWidth / 2, subGridZ));
      marginGeometry.vertices.push(new THREE.Vector3(offsetLength / 2, offsetWidth / 2, subGridZ));

      marginGeometry.vertices.push(new THREE.Vector3(offsetLength / 2, offsetWidth / 2, subGridZ));
      marginGeometry.vertices.push(new THREE.Vector3(-offsetLength / 2, offsetWidth / 2, subGridZ));

      marginGeometry.vertices.push(new THREE.Vector3(-offsetLength / 2, offsetWidth / 2, subGridZ));
      marginGeometry.vertices.push(new THREE.Vector3(-offsetLength / 2, -offsetWidth / 2, subGridZ));

      var strongGridMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHex(this.color),
        opacity: this.opacity * 2,
        linewidth: 2,
        transparent: true
      });
      this.margin = new THREE.LineSegments(marginGeometry, strongGridMaterial);

      //add all grids, subgrids, margins etc
      this.add(this.mainGrid);
      this.add(this.subGrid);
      this.add(this.margin);

      this._drawNumbering();
    }
  }, {
    key: "toggle",
    value: function toggle(_toggle) {
      //apply visibility settings to all children
      this.traverse(function (child) {
        child.visible = _toggle;
      });
    }
  },{
    key: "getToggle",
    value: function getToggle(){
      this.traverse(function (child) {
        return child.visible;
      });
    }
  }, {
    key: "setOpacity",
    value: function setOpacity(opacity) {
      this.opacity = opacity;
      this.mainGrid.material.opacity = opacity;
      this.subGrid.material.opacity = opacity / 2;
      this.margin.material.opacity = opacity * 2;
    }
  }, {
    key: "setColor",
    value: function setColor(color) {
      this.color = color;
      this.mainGrid.material.color = new THREE.Color().setHex(this.color);
      this.subGrid.material.color = new THREE.Color().setHex(this.color);
      this.margin.material.color = new THREE.Color().setHex(this.color);
    }
  }, {
    key: "toggleText",
    value: function toggleText(toggle) {
      this.text = toggle;
      var labels = this.labels.children;
      for (var i = 0; i < this.labels.children.length; i++) {
        var label = labels[i];
        label.visible = toggle;
      }
    }
  }, {
    key: "setTextColor",
    value: function setTextColor(color) {
      this.textColor = color;
      this._drawNumbering();
    }
  }, {
    key: "setTextLocation",
    value: function setTextLocation(location) {
      this.textLocation = location;
      return this._drawNumbering();
    }
  }, {
    key: "setUp",
    value: function setUp(upVector) {
      this.upVector = upVector;
      this.up = upVector;
      this.lookAt(upVector);
    }
  }, {
    key: "resize",
    value: function resize(width, length) {
      if (width && length) {
        var width = Math.max(width, 10);
        this.width = width;

        var length = Math.max(length, 10);
        this.length = length;

        this.step = Math.max(this.step, 5);

        this.remove(this.mainGrid);
        this.remove(this.subGrid);
        this.remove(this.margin);
        //this.remove(this.plane);
        return this._drawGrid();
      }
    }
  }, {
    key: "_drawNumbering",
    value: function _drawNumbering() {
      var label, sizeLabel, sizeLabel2, xLabelsLeft, xLabelsRight, yLabelsBack, yLabelsFront;
      var step = this.step;

      this._labelStore = {};

      if (this.labels != null) {
        this.mainGrid.remove(this.labels);
      }
      this.labels = new THREE.Object3D();

      var width = this.width;
      var length = this.length;
      var numbering = this.numbering = "centerBased";

      var labelsFront = new THREE.Object3D();
      var labelsBack = new THREE.Object3D();
      var labelsSideRight = new THREE.Object3D();
      var labelsSideLeft = new THREE.Object3D();

      if (numbering == "centerBased") {

        // 0, 10, 20
        for (var i = 0; i <= width / 2; i += step) {
          var sizeLabel = this.drawTextOnPlane("" + i, 32);
          var sizeLabel2 = this.drawTextOnPlane("" - i, 32);
          var sizeLabel3 = sizeLabel2.clone();
          var sizeLabel4 = sizeLabel.clone();

          sizeLabel.position.set(length / 2, -i, 0);
          sizeLabel.rotation.z = -Math.PI / 2;
          labelsFront.add(sizeLabel);

          sizeLabel2.position.set(length / 2, i, 0);
          sizeLabel2.rotation.z = -Math.PI / 2;
          labelsFront.add(sizeLabel2);

          sizeLabel3.position.set(length / 2, -i, 0);
          sizeLabel3.rotation.z = -Math.PI/2;
          labelsBack.add(sizeLabel3);
          labelsBack.rotation.z = -Math.PI;

          sizeLabel4.position.set(length / 2, i, 0);
          sizeLabel4.rotation.z = -Math.PI/2;
          labelsBack.add(sizeLabel4);
          labelsBack.rotation.z = -Math.PI;

        }

        for (var i = 0; i <= length / 2; i += step) {
          var sizeLabel = this.drawTextOnPlane("" + i, 32);
          var sizeLabel2 = this.drawTextOnPlane("" - i, 32);
          var sizeLabel3 = sizeLabel.clone();
          var sizeLabel4 = sizeLabel2.clone();

          sizeLabel.position.set(i, width / 2, 0);
          //sizeLabel2.rotation.z = -Math.PI / 2;
          labelsSideRight.add(sizeLabel);

          sizeLabel2.position.set(-i, width / 2, 0);
          //sizeLabel.rotation.z = -Math.PI / 2;
          labelsSideRight.add(sizeLabel2);

          sizeLabel3.position.set(-i, width / 2, 0);
          //sizeLabel3.rotation.z = -Math.PI/2;
          //sizeLabel2.rotation.z = -Math.PI / 2;
          labelsSideLeft.add(sizeLabel3);
          labelsSideLeft.rotation.z = -Math.PI;

          sizeLabel4.position.set(i, width / 2, 0);
          //sizeLabel4.rotation.z = -Math.PI/2;
          //sizeLabel2.rotation.z = -Math.PI / 2;
          labelsSideLeft.add(sizeLabel4);
          labelsSideLeft.rotation.z = -Math.PI;
        }

        //var labelsSideLeft = labelsSideRight.clone();
        //labelsSideLeft.rotation.z = -Math.PI;
        //labelsSideLeft = labelsSideRight.clone().translateY(- width );

        //var labelsBack = labelsFront.clone();
        //labelsBack.rotation.z = -Math.PI;
      }

      /*if (this.textLocation === "center") {
        yLabelsRight.translateY(- length/ 2);
        xLabelsFront.translateX(- width / 2);
      } else {
        yLabelsLeft = yLabelsRight.clone().translateY( -width );
        xLabelsBack = xLabelsFront.clone().translateX( -length );

        this.labels.add( yLabelsLeft );
        this.labels.add( xLabelsBack) ;
      }*/
      //this.labels.add( yLabelsRight );
      this.labels.add(labelsFront);
      this.labels.add(labelsBack);

      this.labels.add(labelsSideRight);
      this.labels.add(labelsSideLeft);

      //apply visibility settings to all labels
      var textVisible = this.text;
      this.labels.traverse(function (child) {
        child.visible = textVisible;
      });

      this.mainGrid.add(this.labels);
    }
  },  {
    key: "_rotateText",
    value: function _rotateText(axis, rads){
      if(axis == 'x'){
        this.labels.rotateX(rads);
      }
      else if(axis == 'y'){
        this.labels.rotateY(rads);
      }
      else if(axis == 'z'){
        this.labels.rotateZ(rads);
      }
      else{
        console.log("Invalid input.");
      }
    }
  }, {
    key: "drawTextOnPlane",
    value: function drawTextOnPlane(text, size) {
      var canvas, context, material, plane, texture;

      if (size == null) {
        size = 256;
      }

      canvas = document.createElement('canvas');
      var size = 128;
      canvas.width = size;
      canvas.height = size;
      context = canvas.getContext('2d');
      context.font = "18px sans-serif";
      context.textAlign = 'center';
      context.fillStyle = this.textColor;
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      context.strokeStyle = this.textColor;
      context.strokeText(text, canvas.width / 2, canvas.height / 2);

      texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      texture.generateMipmaps = true;
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearFilter;

      material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        color: 0xffffff,
        alphaTest: 0.3
      });
      plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(size / 8, size / 8), material);
      plane.doubleSided = true;
      plane.overdraw = true;

      return plane;
    }
  }]);

  return LabeledGrid;
}(THREE.Object3D);
