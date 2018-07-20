/** 
* MAT3D
* JAVASCRIPT FILE CONTAINING 
* MATHMATICAL FUNCTIONS FROM PARSER
* lib-used: math.js from external javascript library
* @author Jacob Schwartz
* @version 1.0
*/

//NEED A VARIABLE math either declared in html or another javascript file

//-------------------------------------------------
/**
 * test function
 */
function exampleFunction(){
	console.log("exampole function is working");
}

/**
 * Function takes in a stack array in 
 * reversed polished notation(rpn) and returns computed answer
 * @param {object} stack array containing rpn
 * @return {object} output of computation
 */
function readStack(stack){

	var stackLength = stack.length;
	var arr = [];
	for(var i =0; i < stackLength; i++){
		var element = stack[i];
		if(typeof(element) == "function"){
			var val = element(arr)
			arr.push(val);
		}
		else{
			arr.push(element);
		}
	}
	var re=arr.pop();
	//console.log("arr " + stack.pop());
	return re;
}

/**
 * Function prints object to console
 * used for testing purposes
 * @param {object} value any math.java input 
 * 
 */
function print (value) {
  const precision = 14
  console.log(math.format(value, precision))
}

/**
 * Function computes addition using math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findAdd(a){
	var operator1 = a.pop();
	var operator2 = a.pop();
	return math.add(operator1, operator2);
}

/**
 * Function computes subtraction using math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findSub(a){
	var operator1 = a.pop();
	var operator2 = a.pop();
	return math.subtract(operator2, operator1);
}

/**
 * Function computes division using math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findDiv(a){
	var operator1 = a.pop();
	var operator2 = a.pop();
	return math.divide(operator2, operator1);
}

/**
 * Function computes multiplication using math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function matrixMultiplication(stack){
	var a = stack.pop();
	var b = stack.pop();
	console.log(a);
	console.log(b);
	var c = math.multiply(a, b);
	//print(c);
	//stack.push(c);
	return c;
}

/**
 * Function takes the inverse of input
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findInverse(a){
	var operator = a.pop();
	var c = math.inv(operator);
	return c;	
}

/**
 * Function computes transpose of given matrix
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findTranspose(a){
	var operator = a.pop();
	var c = math.transpose(operator);
	return c;
}

/**
 * Function computes the diagonal of a matrix
 * uses math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findDiagonal(a){ 
	var operator = a.pop();
	var c = math.diag(operator);
	return c;
}

/**
 * Function computes the determinant of a matrix
 * uses math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findDeterminant(a){
	var operator = a.pop();
	var c = math.det(operator);
	return c;
}

/**
 * Function computes trig function on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findSin(a){
	var operator = a.pop();
	return math.sin(toRadians(operator));
}

/**
 * Function computes trig function on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findCos(a){
	var operator = a.pop();
	return math.cos(toRadians(operator));
}

/**
 * Function computes trig function on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findTan(a){
	var operator = a.pop();
	return math.tan(toRadians(operator));
}

//INVERSE TRIG FUNCTIONS
/**
 * Function computes trig function on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findArcSin(a){
	var operator = a.pop();
	return math.asin(toRadians(operator));
}

/**
 * Function computes trig function on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findArcCos(a){
	var operator = a.pop();
	return math.acos(toRadians(operator));
}

/**
 * Function computes trig function on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findArcTan(a){
	var operator = a.pop();
	return math.atan(toRadians(operator));
}

// 1/VAL TRIG FUNCTIONS
/**
 * Function computes trig function on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findCosecant(a){
	var operator = a.pop();
	return math.csc(toRadians(operator));
}

/**
 * Function computes trig function on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findSecant(a){
	var operator = a.pop();
	return math.sec(toRadians(operator));
}

/**
 * Function computes trig function on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findCotangent(a){
	var operator = a.pop();
	return math.cot(toRadians(operator));
}

//log base 10
/**
 * Function computes log10 on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findLog10(a){
	var operator = a.pop();
	var c = math.log10(operator);
	
	return c;
}

//natural log
/**
 * Function computes natural log on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findNaturalLog(a){
	var operator = a.pop();
	var c = math.log(operator);
	return c;
}

//find exponent
/**
 * Function computes exponent on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findExp(a){
	var operator1 = a.pop();
	var operator2 = a.pop();
	return math.pow(operator2, operator1);
}

//find sqrt
/**
 * Function computes square root on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findSqrt(a){
	var operator = a.pop();
	var c = math.sqrt(operator);
	return c;
}

//find absolute value
/**
 * Function computes absolute value on input
 * uses the math.js library
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findAbs(a){
	var operator = a.pop();
	var c = math.abs(operator);
	return c;
}

/**
 * Function computes factorial on input
 * uses the math.js library
 * note will accept matrix with only integer values
 * see math.js documentation
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 * 
 */
function findFactorial(a){
	var operator = a.pop();
	var c = math.factorial(operator);
	return c;
}

/**
 * Function computes lu decomposition on input
 * uses the math.js library
 * input can only be a matrix/array
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findLu(a){
	var operator = a.pop();
	var c = math.lup(operator);
	return c;
}

/**
 * Function computes rank on input
 * calls rankOfMatrix
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findRank(a){
	var operator = a.pop();
	var size = math.size(operator);
	return rankOfMatrix(operator, size[0], size[1]);

}

//function to find rank of a matrix
//algorithm taken and translated from geeksforgeeks
// https://www.geeksforgeeks.org/program-for-rank-of-matrix/
/**
 * Function computes trig function on input
 * algorithm taken and translated from geeksforgeeks
 * https://www.geeksforgeeks.org/program-for-rank-of-matrix/
 * @param {object} mat matrix in array format
 * @param {object} r number of rows in matrix
 * @param {object} c number of columns in matrix
 * @return {object} returns computed value
 */
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

/**
 * Function computes cholesky decomposition of a matrix
 * calls choleskyDecomp2
 * @param {object} a stack with mathmatical objects
 * @return {object} returns computed value
 */
function findCholesky(a){
	var operator = a.pop();
	return choleskyDecomp2(operator);
}

//function for cholesky decomposition
//algorithm taken and translated from geeksforgeeks
//https://www.geeksforgeeks.org/cholesky-decomposition-matrix-decomposition/
/**
 * Function computes cholesky on input
 * algorithm taken and translated from geeksforgeeks
 * //https://www.geeksforgeeks.org/cholesky-decomposition-matrix-decomposition/
 * @param {object} matrix matrix object input
 * @param {object} n size of matrix
 * @return {object} returns computed value
 */
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

//--------------------------------------------------------------------
//ADDITIONAL HELPER FUNCTIONS

/**
 * Function changes input from radians to degrees
 * 
 * @param {object} angle integer
 * @return {object} returns computed value
 */
function toDegrees(angle){
	var val = angle * (180 / Math.PI);
	return val;
}

/**
 * Function changes input from degrees to radians
 * 
 * @param {object} angle integer
 * @return {object} returns computed value
 */
function toRadians(angle){
	var val = angle * (Math.PI / 180);
	console.log("torad " + val);
	return val;
}

/**
 * Function swap helper function for rankOfMatrix
 * 
 * @param {object} mat matrix
 * @param {object} row1 matrix row
 * @param {object} row2 matrix row
 * @param {object} col matrix column
 * 
 */
function swap(mat, row1, row2, col){
	for(var i = 0; i < col; i++){
		var temp = mat[row1][i];
		mat[row1][i] = mat[row2][i];
		mat[row2][i] = temp;
	}
	
}

/**
 * Function jagArray creates a 2D array in Javascript
 * used for choleskyDecomp
 * 
 * @param {object} n empty array
 * @return {object} returns 2D array
 */
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

	