/**
* Creates a specialized queue used for organizing matrices and producing a
* linear transformation Matrix4 in three.js
*
* @constructor
* @author: Alfredo Rivero
* @this {TranQueue}
*/
function TranQueue() {
  this.queue = [];  // Queue containing matrix objects
}

/**
* Adds a 3x3/4x4 mathJS matrix object into the TranQueue. Index bounds are
* [0 - TranQueue.length()].
*
* @param {SparseMatrix, DenseMatrix} addedMatrix Matrix added to TranQueue
* @param {number} index Index of where in the queue you want to add addedMatrix
* @throws Message if addedmatrix is not mathJS matrix or index is out of bounds
*
*/
TranQueue.prototype.addMatrix = function(addedMatrix, index) {
  try {
    var dim;  // dim[0]: len, dim[1]: width
    if (addedMatrix instanceof Array) {
      dim = math.size(addedMatrix);
    }
    else if (typeof(addedMatrix) == "object") {
      dim = addedMatrix._size;
    }
    else {
      throw "Tried to add something that is not a mathJS matrix!";
    }

    if (this.notValidDim(dim)) {
      throw "Tried to add a matrix which is not a 3x3 or 4x4 matrix!"
    }
    if (this.indexOutOfBounds(index)) {
      throw "Tried to add a matrix beyond TranQueue length"
    }
    if (this.elemInMatAreNotNum(addedMatrix, dim[0])) {
      throw "All matrices must have entries with only real numbers!"
    }

    switch (index) {
      case this.queue.length:
        this.queue.push(addedMatrix);
        break;
      case 0:
        this.queue.unshift(addedMatrix);
        break;
      default:
        this.queue.splice(index, 0, addedMatrix);
    }
  }
  catch (err) {
    // ERROR HANDELING GOES HERE
    console.log(err);
  }
}

/**
* Determines if the given dimensions of a matrix are 3x3 or 4x4.
*
* @param {Array} dim Dimensions where dim[0]: len, dim[1]: width
* @returns {boolean} True if not 3x3 or 4x4 dimensions, false otherwise
*
*/
TranQueue.prototype.notValidDim = function(dim) {
  return dim.length != 2 || !((dim[0] == 3 && dim[1] == 3) || (dim[0] == 4 && dim[1] == 4));
}

/**
* Determines if the given index is considered out of bounds
* ([0 - TranQueue.length()]).
*
* @param {number} index Index within the TranQueue
* @returns {boolean} True if index is out-of-bounds, false otherwise
*/
TranQueue.prototype.indexOutOfBounds = function(index) {
  return index > this.queue.length || index < 0
}

/**
* Determines if addedMatrix is composed of only real numbers.
*
* @param {Array, Object} addedMatrix Matrix being tested
* @param {number} dim Dimensions of addedMatrix
* @returns {boolean} True if not composed of only real numbers, false otherwise
*/
TranQueue.prototype.elemInMatAreNotNum = function(addedMatrix, dim) {
  var matrixArray;
  if (addedMatrix instanceof Array) {
    matrixArray = addedMatrix;
  }
  else {
    matrixArray = addedMatrix._data;
  }

  for (var i = 0; i < dim; i++) {
    for (var j = 0; j < dim; j++) {
      if (typeof(matrixArray[i][j]) != "number") {
        return true;
      }
    }
  }

  return false;
}

/**
* Removes a specified mathJS matrix from the TranQueue.
*
* @param {SparseMatrix, DenseMatrix} remMatrix Matrix removed from TranQueue
* @throws Message if addedmatrix is not mathJS matrix or remMatrix is not found
*/
TranQueue.prototype.removeMatrix = function(remMatrix) {
  try {
    var index = this.queue.indexOf(remMatrix);
    if (index == -1) {
      throw "Tried to remove an element that is not present in TranQueue."
    }

    this.queue.splice(index, 1);
  }
  catch (err) {
    // ERROR HANDELING GOES HERE
    console.log(err);
  }
}

/**
* Moves a specified mathJS matrix from one position in the TranQueue to
* another position. Index bounds are [0 - TranQueue.length()].
*
* @param {SparseMatrix, DenseMatrix} matrix Matrix moved in TranQueue
* @param {number} matInc Increment/Decrement in position within TranQueue
* @throws Message if addedmatrix is not valid mathJS matrix or if
* increment causes out of bounds
*/
TranQueue.prototype.moveMatrix = function(matrix, matInc) {
  try {
    if (matInc == 0) {
      return;
    }

    var matIndex = this.queue.indexOf(matrix);
    if (matIndex == -1) {
      throw "Trying to move an element that is not present in transQueue."
    }

    var newPos = matIndex + matInc;
    if (this.indexOutOfBounds(newPos)) {
      throw " Trying to move a matrix beyond TranQueue length"
    }

    var movedTemp = this.queue.splice(matIndex, 1);
    switch (newPos) {
      case this.queue.length:
        this.queue.push(matrix);
        break;
      case 0:
        this.queue.unshift(matrix);
        break;
      default:
        this.queue.splice(newPos, 0, matrix);
    }
  }
  catch (err) {
    // ERROR HANDELING GOES HERE
    console.log(err);
  }
}

/**
* Computes the transformation matrix represented by multiplying all elements
* within the queue. Returns a three.js Matrix4 object.
*
* @returns {Matrix4} three.js matrix representing a transform. Returns
* identity matrix if TranQueue is empty.
*/
TranQueue.prototype.compThreeJSMatrix = function() {
  // Initial identity matrix
  var transform = math.identity(4,4);

  // Multiply all the matrices within the TranQueue
  for (var i = 0; i < this.queue.length; i++) {
    var matrix;
    if (this.queue[i].length[0] == 3) {
      matrix = threeToFour(matrix);
    }
    else {
      matrix = this.queue[i];
    }

    transform = math.multiply(matrix, transform);
  }

  // Turn transform into an array accepted by three.js in row major form
  var out = [];
  for (var j = 0; j < 4; j++) {
    for (var k = 0; k < 4; k++) {
      out.push(transform[j][k]);
    }
  }

  // turn transform array into a Matrix4 three.js object
  return new Matrix4(new Float32Array(out));
}

/**
* Turns a clone of a mathJS 3x3 matrix into a mathJS 4x4 matrix ready for 3D
* transformations.
*
* @param {SparseMatrix, DenseMatrix} matrix 3x3 mathJS matrix
* @returns {SparseMatrix, DenseMatrix} A cloned, 4x4 matrix
* @throws Message if param is not a 3x3 matrix
*/
TranQueue.prototype.threeToFour = function(matrix) {
  try {
    if (math.size(matrix)[0] != 3) {
      throw "Not a 3x3 matrix!"
    }

    var fxfclone = math.clone(matrix);
    fxfclone = math.resize(fxfclone, [4,4]);
    fxfclone = math.subset(fxfclone, math.index(3,3), 1);  // change bottom-rightest number to 1

    return fxfclone;
  }
  catch (err) {
    // ERROR HANDELING GOES HERE
    console.log(err);
  }
}

/**
* Returns the length of the TranQueue
*
* @returns {number} transQueue length
*/
TranQueue.prototype.length = function() {
  return this.queue.length;
}

/**
* Returns the array used within TranQueue
*
* @returns {Array} transQueue's internal Array
*/
TranQueue.prototype.returnQueue = function() {
  return this.queue;
}
