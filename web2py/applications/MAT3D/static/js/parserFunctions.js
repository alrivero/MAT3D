//MAT3D
//JAVASCRIPT FILE CONTAINING
//MATHMATICAL FUNCTIONS FROM PARSER
//lib-used: math.js from external javascript library

//NEED A VARIABLE math either declared in html or another javascript file

//-------------------------------------------------

//FUNCTION readStack(stack)
//reads a rpn stack and calls functions in order
function readStack2(stack){
	var stackLength = stack.length;
	//console.log("stack length " + stackLength);
	var arr = [];
	try {
	    for (var i = 0; i < stackLength; i++) {
	        var element = stack[i];
	       // console.log(element);
	        if (isOperator(element)) {

	            if (element == "*") {
	                var operator1 = arr.pop();
	                var operator2 = arr.pop();
	                var val = matrixMultiplication(operator1, operator2);
	                arr.push(val);
	            } else if (element == "/") {
	                var operator1 = arr.pop();
	                var operator2 = arr.pop();
	                var val = math.divide(operator1, operator2);
	                arr.push(val);
	            } else if (element == "+") {
	                var operator1 = arr.pop();
					var operator2 = arr.pop();
					checkInput(operator1, 0);
					checkInput(operator2, 0);
	                var val = math.add(operator1, operator2);
	                arr.push(val);
	            } else if (element == "-") {
	                var operator1 = arr.pop();
                    var operator2 = arr.pop();
                    checkInput(operator1, 0);
	                checkInput(operator2, 0);
	                var val = math.subtract(operator1, operator2);
	                arr.push(val);
				}
				else if(element == "det"){ //DETERMINANT OF A MATRIX
					var operator1 = arr.pop();
					checkInput(operator1, 0);
					var val = findDeterminant(operator1);
					arr.push(val);
				}
				else if(element == "inv"){//INVERSE OPERATION
					var operator1 = arr.pop();
					checkInput(operator1, 0);
					var val = findInverse(operator1);
					arr.push(val);
				}
				else if(element == "transpose"){
					var operator1 = arr.pop();
					checkInput(operator1 ,0);
					arr.push(findTranspose(operator1));
				}
				else if(element == "abs"){
					var operator1 = arr.pop();
					checkInput(operator1, 0);
					arr.push(findAbs(operator1));
				}
				else if(element == "log10"){
					var operator1 = arr.pop();
					checkInput(operator1, 0);
					arr.push(findLog10(operator1));
				}
				else if(element == "ln"){
					var operator1 = arr.pop();
					checkInput(operator1, 0);
					arr.push(findNaturalLog(operator1));
				}
				else if(element == "sqrt"){
					var operator1 = arr.pop();
					checkInput(operator1, 0);
					arr.push(findSqrt(operator1));
				}
				else if(element == "lu"){//LU DECOMP
					//INPUT MUST BE A MATRIX/ARRAY
					var operator1 = arr.pop();
					checkInput(operator1, 0);
					arr.push(findLu(operator1));
				}

				else if(element == "rank"){// FIND RANK OF A MATRIX
					var operator1 = arr.pop();
					checkInput(operator1, 0);
					var size = math.size(operator1);
					arr.push(rankOfMatrix(operator1, size[0], size[1]));
				}
				else if(element == "choleksy"){//FIND CHOLESKY DECOMP
					var operator1 = arr.pop();
					checkInput(operator1, 0);
					var size = math.size(operator1);
					arr.push(choleskyDecomp2(operator1, size[0]));
				}
			}
			else arr.push(element);
		} //end for
		// /*
	} catch (error) {
        console.log("Input is not correctly placed!");
        return "Invalid Input!";
	}//*/
	return arr.pop();
	}

//isOperator //checks if given input is an operator
function isOperator(string){
	if(string == "*")
		return true;
	else if(string == "/")
		return true;
	else if(string == "+")
		return true;
	else if(string == "-")
		return true;
	else if(string == "det")
		return true;
	else if(string == "inv")
		return true;
	else if(string == "transpose")
		return true;
	else if(string == "abs")
		return true;
	else if(string == "log10")
		return true;
	else if(string == "ln")
		return true;
	else if(string == "sqrt")
		return true;
	else if(string == "lu")
		return true;
	else if(string == "rank")
		return true;
	else if(string == "cholesky")
		return true;


	else return false;
}

function checkInput(a, typeError) {
	if (typeError == 0) {//TYPE ERROR 0: OPERATOR IS UNDEFINED
		if (a == undefined) {
			throw "error";
		}
	}
	return;
}


function print (value) {
  const precision = 14
  console.log(math.format(value, precision))
}

function findAdd(a){
	var operator1 = a.pop();
	var operator2 = a.pop();
	return math.add(operator1, operator2);
}

function findSub(a){
	var operator1 = a.pop();
	var operator2 = a.pop();
	return math.subtract(operator2, operator1);
}

function findDiv(a){
	var operator1 = a.pop();
	var operator2 = a.pop();
	return math.divide(operator2, operator1);
}

//matrixMultiplication-multiplies two matrices together
//NOTE WORKS FOR ALL INPUT MATRICES AND SCALARS
//RETURNS A MATRIX
function matrixMultiplication(stack){
	var a = stack.pop();
	var b = stack.pop();

	if (typeof(a) == "function" || typeof(b) == "function") {
		return composeFunction(a,b);
	}

	var c = math.multiply(a, b);
	//print(c);
	//stack.push(c);
	return c;
}

// Composes a function with another function. Used in matrixMultiplication.
function composeFunction (a, b) {
	if (typeof(a) != "function") {
		return function(stack) {
			return math.multiply(a, b(stack));
		}
	}
	else if(typeof(b) != "function") {
		return function(stack) {
			return math.multiply(b, a(stack));
		}
	}
	else {
		return function(stack) {
			return a(b(stack));
		}
	}
}

//findInverse() return the inverse of the input matrixMultiplication
function findInverse(a){
	var operator = a.pop();
	var c = math.inv(operator);
	return c;
}

//findTranspose()
//RETURNS TRANSPOSE OF GIVEN MATRIX
function findTranspose(a){
	var operator = a.pop();
	var c = math.transpose(operator);
	return c;
}

//findDiagonal
//RETURNS DIAGONAL OF MATRIX
function findDiagonal(a){
	var operator = a.pop();
	var c = math.diag(operator);
	return c;
}

//findDeterminant
function findDeterminant(a){
	var operator = a.pop();
	var c = math.det(operator);
	return c;
}

//TRIG FUNCTION PARSER
function findTrig(a, angle, bit){
	var val;
	//sin
	if(bit == 0){
		console.log("sin");
		val = math.multiply(Math.sin(toRadians(angle)), a);
	}
	//cos
	else if(bit == 1){
		if(angle == 90 || angle == 270){
			return math.multiply(0, a);
		}
		val = math.multiply(Math.cos(toRadians(angle)), a);
	}
	//tan
	else if(bit == 2){
		val = math.multiply(Math.tan(toRadians(angle)), a);
	}

	//arcsin
	else if(bit == 3){
		val = math.multiply(Math.asin(toRadians(angle)), a);
	}
	//arccos
	else if(bit == 4){
		val = math.multiply(Math.acos(toRadians(angle)), a);
	}

	else if(bit == 5){
		val = math.multiply(Math.atan(toRadians(angle)), a);
	}

	return val;
}

//TRIG FUNCTIONS
function findSin(a){
	var operator = a.pop();
	return math.sin(toRadians(operator));
}

function findCos(a){
	var operator = a.pop();
	return math.cos(toRadians(operator));
}

function findTan(a){
	var operator = a.pop();
	return math.tan(toRadians(operator));
}

//INVERSE TRIG FUNCTIONS
function findArcSin(a){
	var operator = a.pop();
	return math.asin(toRadians(operator));
}

function findArcCos(a){
	var operator = a.pop();
	return math.acos(toRadians(operator));
}

function findArcTan(a){
	var operator = a.pop();
	return math.atan(toRadians(operator));
}

// 1/VAL TRIG FUNCTIONS
function findCosecant(a){
	var operator = a.pop();
	return math.csc(toRadians(operator));
}

function findSecant(a){
	var operator = a.pop();
	return math.sec(toRadians(operator));
}

function findCotangent(a){
	var operator = a.pop();
	return math.cot(toRadians(operator));
}

//log base 10
function findLog10(a){
	var operator = a.pop();
	var c = math.log10(operator);

	return c;
}

//natural log
function findNaturalLog(a){
	var operator = a.pop();
	var c = math.log(operator);
	return c;
}

//find exponent
function findExp(a){
	var operator1 = a.pop();
	var operator2 = a.pop();
	return math.pow(operator2, operator1);
}

//find sqrt
function findSqrt(a){
	var operator = a.pop();
	var c = math.sqrt(operator);
	return c;
}

//find absolute value
function findAbs(a){
	var operator = a.pop();
	var c = math.abs(operator);
	return c;
}

//find factorial
//note will accept matrix with only integer values
//see math.js documentation
function findFactorial(a){
	var operator = a.pop();
	var c = math.factorial(operator);
	return c;
}

function findLu(a){
	var operator = a.pop();
	var c = math.lup(operator);
	return c;
}

function findRank(a){
	var operator = a.pop();
	var size = math.size(operator);
	return rankOfMatrix(operator, size[0], size[1]);

}

//function to find rank of a matrix
//algorithm taken and translated from geeksforgeeks
// https://www.geeksforgeeks.org/program-for-rank-of-matrix/
function rankOfMatrix(mat, r, c){
	var rank = c;

	for(var row = 0; row < rank; row++){
		// Before we visit current row
            // 'row', we make sure that
            // mat[row][0],....mat[row][row-1]
            // are 0.

            // Diagonal element is not zero
			if(mat[row][row] != 0){
				for(var col = 0; col < r; col++){
					if(col != row){
						//MAKES ALL ENTRIES OF CURRENT COLUMN ZERO
						//except at mat[row][row]
						var mult = mat[col][row]/mat[row][row];
						for(var i =0; i < rank; i++){
							mat[col][i] -= mult * mat[row][i];
						}//end for
					}
				}
			}//end if
			// Diagonal element is already zero.
            // Two cases arise:
            // 1) If there is a row below it
            // with non-zero entry, then swap
            // this row with that row and process
            // that row
            // 2) If all elements in current
            // column below mat[r][row] are 0,
            // then remvoe this column by
            // swapping it with last column and
            // reducing number of columns by 1.
			else {
				var reduce = true;

				//find the non-zero element
				//in current column
				for(var i = row + 1; i < r; i++){
					//swap the row with non-zero
					//element with this row.
					if(mat[i][row] != 0){
						swap(mat, row, i, rank);
						reduce = false;
						break;
					}
				}
				// If we did not find any row with
                // non-zero element in current
                // columnm, then all values in
                // this column are 0.
				if(reduce){
					//reduce number of columns
					rank--;

					//copy the last column here
					for(var i =0; i < r; i++){
						mat[i][row] = mat[i][rank];
					}
				}

				//Process this row again
				row--;
			}//end else


	}
	//return
	return rank;
}

function findCholesky(a){
	var operator = a.pop();
	return choleskyDecomp2(operator);
}

//function for cholesky decomposition
//algorithm taken and translated from geeksforgeeks
//https://www.geeksforgeeks.org/cholesky-decomposition-matrix-decomposition/
function choleskyDecomp2(matrix, n){
	var lower=jagArray(n);
	//memset from c -- should not be necessary in js

	for(var i = 0; i < n; i++){
		for(var j = 0; j <= i; j++){
			var sum = 0;

			if(j == i){//summation for diagonals
				for(var k = 0; k < j; k++){
					sum += Math.pow(lower[j][k], 2);
				}
				lower[j][j] = Math.sqrt(matrix[j][j] - sum);
			}
			else {
				//EVALUATING L(i, j) using L(j, j)
				for(var k = 0; k < j; k++){
					sum += (lower[i][k] * lower[j][k]);
				}
				lower[i][j] = (matrix[i][j] - sum) / lower[j][j];
			}
		}
	}//end for
	//END OF ALGORITHM
	return lower;
}

//FUNCTION choleskyDecomp
//algorithm taken from rosetta code.org
//https://rosettacode.org/wiki/Cholesky_decomposition#Java
function choleskyDecomp(a){
	var size = math.size(a);
	var n = size[0];
	var l = jagArray(n);
	for(var i = 0; i < n; i++){
		for(var k = 0; k < (i+1); k++){
			var sum = 0;
			for(var j = 0; j < k; j++){
				sum += l[i][j] * l[k][j];
			}
			//l[i][k] = (i == k) ? math.sqrt(a[i][i] - sum) :
			//(1.0 / l[k][k] * (a[i][k] - sum));

			if(i == k){
				l[i][k] = math.sqrt(a[i][i] - sum);
				//l[i][k] = 0;
			}
			else{
				l[i][k] = (1.0 / l[k][k] * (a[i][k] - sum));
				//l[i][k] = 0;
			}
		}
	}
	return l;
}
//--------------------------------------------------------------------
//ADDITIONAL HELPER FUNCTIONS
function toDegrees(angle){
	var val = angle * (180 / Math.PI);
	return val;
}

function toRadians(angle){
	var val = angle * (Math.PI / 180);
	console.log("torad " + val);
	return val;
}

//function swap
//function for rankOfMatrix
function swap(mat, row1, row2, col){
	for(var i = 0; i < col; i++){
		var temp = mat[row1][i];
		mat[row1][i] = mat[row2][i];
		mat[row2][i] = temp;
	}

}

//function jagArray
//function for choleskyDecomp
function jagArray(n){
	var arr = [];
	for(var x = 0; x < n; x++){
		arr[x]=[];
		for(var y =0; y < n; y++){
			//arr[x][y] = x*y;
			arr[x][y] = 0.0;
		}
	}
	return arr;
}

// Turns a value on the stack negative
function negative(stack) {
  var arg1 = stack.pop();
  return math.multiply(-1, arg1);
}
