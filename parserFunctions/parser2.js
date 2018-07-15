/**
 * Creates a specialized mathematical parser used for computing matrices/scalars
 * within the MAT3D calculator
 *
 * @constructor
 * @author Alfredo Rivero
 * @version 2.0
 * @this {Parser}
 */
function Parser() {
  // Operator presedence dictionary used for Shunting-Yard

  /** @private */ this.ops = { "|": 0, "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };

  // The following are membership values within wordBreak and its helper functions
  /** @private */ this.NAM = -1;  // Not a Member
  /** @private */ this.MATRIX = 0;
  /** @private */ this.SCALAR = 1;
  /** @private */ this.FUNCTION = 2;
}

/**
 * Parses input provided by the top bar of the MAT3D calculator.
 *
 * @param {String} rawIn Raw input string provided by top bar
 * @returns {Number, Array, SparseMatrix, DenseMatrix} Computed output
 * @throws Message if the input was invalid
 *
 */
Parser.prototype.parseTopBar = function(rawIn) {
  try {
    var parsedOut = this.parseExpression(rawIn, []);
    if (parsedOut instanceof String) {
      throw parsedOut;
    }

    return parsedOut;
  }
  catch(err) {
    // ERROR HANDELING GOES HERE
    console.log(err);
  }
}

/**
 * Parses input provided by the side bar. Will only return matrices.
 *
 * @param {String} rawIn Raw input string provided by top bar
 * @returns {Array, SparseMatrix, DenseMatrix} Computed output
 * @throws Message if the input was invalid or the computed input was a scalar
 *
 */
Parser.prototype.parseSideBar = function(rawIn) {
  try {
    var parsedOut = this.parseExpression(rawIn, []);
    if (parsedOut instanceof String) {
      throw parsedOut;
    }
    if (typeof(parsedOut) == "number") {
      throw "Tried to assign a scalar to a matrix variable!";
    }

    return parsedOut;
  }
  catch(err) {
    // ERROR HANDELING GOES HERE
    console.log(err);
  }
}

/**
 * Parses input provided by the side bar. Will only return matrices.
 *
 * @param {String} rawIn Raw input string provided by top bar
 * @returns {Number} Computed output
 * @throws Message if the input was invalid or the computed input was a matrix
 *
 */
Parser.prototype.parseMatCell = function(rawIn) {
  try {
    var parsedOut = this.parseExpression(rawIn, []);
    if (parsedOut instanceof String) {
      throw parsedOut;
    }
    if (typeof(parsedOut) != "number") {
      throw "Tried to assign a matrix to a scalar variable!";
    }

    return parsedOut;
  }
  catch(err) {
    // ERROR HANDELING GOES HERE
    console.log(err);
  }
}

/**
 * Computes any matheamtical expression given by parseTopBar, parseMatCell, or
 * parseSideBar. Uses a modified version of the Shunting-Yard algorithm which is
 * recursive.
 *
 * @private
 * @param {String} strIn string input provided by parseExpression
 * @param {Boolean} opStack Operator stack used for modified Shunting-Yard
 * @returns {Number, Array, SparseMatrix, DenseMatrix, String} Computed value or
 * exception message.
 */
Parser.prototype.parseExpression = function(mathExp, opStack) {
  var splitExp = this.splitExpToArray(mathExp);
  var answerRPN = [];
  var prevHadOp = true;

  for (var i = 0; i < splitExp.length; i++) {

    if (this.isParenBlock()) {
      opStack.push("|"); // Used as a boundry within the opStack for next call
      var computedBlock = this.parseExpression(splitExp[i], opStack);
      opStack.pop();  // Remove "|" from opStack

      if (computedBlock instanceof String) {  // Exception detected
        return computedBlock;
      }
      answerRPN.push(computedBlock);

      prevHadOp = false;
    }
    else if (this.isNegSign(splitExp, prevHadOp)) {
      this.pushToOpStack(functions["neg"], opStack, answerRPN);
      prevHadOp = true; //
    }
    else if (this.isOperator(splitExp)) {
      this.pushToOpStack(splitExp, opStack, answerRPN);
      prevHadOp = true;
    }
    else if (this.isNumber(splitExp)) {
      if (!prevHadOp) {
        this.pushToOpStack("*", opStack, answerRPN);
      }

      answerRPN.push(parseInt);
      prevHadOp = false;
    }
    else if (this.isLetterStr(splitExp)) {
      opStack.push("|"); // Used as a boundry within the opStack for next call
      var parsedStr = this.compLettStr(splitExp);
      opStack.pop();  // Remove "|" from opStack

      if (!prevHadOp) {
        this.pushToOpStack("*", opStack, answerRPN);
      }

      if (typeof(parsedStr) == "function") {
        this.pushToOpStack(splitExp, opStack, answerRPN);
      }
      else if (!(parsedStr instanceof String)){
        answerRPN.push(parsedStr);
      }
      else {  // Exception detected
        return parsedStr;
      }

      prevHadOp = false;
    }
    else {
      return "Invalid characters, operator missuse, or invalid formatting detected!"
    }

    // Move the remaining elements from opStack into answerRPN
    while (false) {
      answerRPN.push(functions[opStack.pop()]);
    }
    return readStack(answerRPN);
  }
}

/**
 * Follows Shunting-Yard's criteria for pushing operators/functions to the
 * operator stack (opStack). Uses ops to follow that criteria.
 *
 * @private
 * @param {String, function} pushedItem Operator or funciton being pushed
 * @param {Array} opStack Operator stack that will have pushedItem pushed onto it
 * @param {Array} answerRPN The answer array which operators popped off opStack
 * will be pushed to
 */
Parser.prototype.pushToOpStack = function(pushedItem, opStack, answerRPN) {
  if (typeof(pushedItem) == "function") {
    while (typeof(opStack[opStack.length - 1] == "function")) {
      answerRPN.push(functions[opStack.pop()]);
    }
  }
  else {
    while (this.isOfHigherPresedence(opStack[opStack.length - 1], pushedItem)) {
      answerRPN.push(functions[opStack.pop()]);
    }
    opStack.push(pushedItem);
  }
}

/**
 * Determines if the item from the top of the operator stack (opStack) is of
 * higher presedence than what is being pused. A helper function to
 * pushToOpStack().
 *
 * @private
 * @param {String, function} topOfStack Operator or funciton from top of opStack
 * @param {String, function} pushedItem Operator or funciton being pushed
 */
Parser.prototype.isOfHigherPresedence = function(topOfStack, pushedItem) {
  return typeof(topOfStack) == "function" || ops[topOfStack] >= ops[pushedItem];
}

/**
* Deconstructs lettStr into a valid combination of scalars, matrices, functions and computes
* them into a scalar, matrix, or function.
*
* @private
* @param {String} lettStr String composed of only letters
* @returns {Boolean} True if strIn was a negative sign
*/
Parser.prototype.compLettStr = function(lettStr) {
  var splitLettStr = this.wordBreak(lettStr);  // Deconstruct lettStr into valid matrices/scalars
  if (splitLettStr instanceof String) {
    return splitLettStr;
  }

  // Convert splitLettStr into RPN
  for (var i = 2; i < splitLettStr.length; i+=2) {
    splitLettStr.splice(i, 0, functions["*"]);
  }
  return this.readStack(splitLettStr);
}

/**
* A modified version of the wordBreak algorithm. Instead of checking if
* lettStr can be deconsructed into a valid combination of scalars, matrices, and
* functions, it computes an array keeping track of valid scalars, matrices, and
* their positon within a valid combination. This algorithm was adapted from a
* java equivalent found at:
* https://www.programcreek.com/2014/03/leetcode-word-break-ii-java/.
*
* @private
* @param {String} lettStr String being deconsructed into valid combinations
* @returns {Array ,String} Array containg the best valid deconstruction of
* lettStr or string if an Exception was found.
*/
Parser.prototype.wordBreak = function(lettStr) {
  var strPos = new Array(lettStr.length + 1);
  strPos[0] = [];

  for (var startBound = 0; i < lettStr.length; i++) {
    if (pos[i] == null) {
      continue;
    }

    for (var endBound = startBound + 1; endBound <= lettStr.length; endBound++) {
      var subStr = lettStr.subString(startBound, endBound);
      var membership = this.determMem(subStr);

      if(membership != NAM) {
        if (strPos[endBound] == null) {
          var validSubStrs = [];
          validSubStrs.push([subStr, membership]);
          strPos[endBound] = validSubStrs;
        }
      }
      else {
        strPos.push([subStr, membership]);
      }
    }
  }

  if (strPos[lettStr.length] == null) {
    return "Tried to use a varaible which is not defined!"
  }

  return this.bestComb(strPos);
}

/**
* Determines to which dictionary (matrices, scalars, functions) subStr belongs
* to. Returns NAM if not a member of any dictionary.
*
* @private
* @param {Array} strPos Array containing containg the valid combinations
* @returns {Array} Array containg the best best combination
*/
Parser.prototype.determMem(subStr) {
  if (subStr in matrices) {
    return this.MATRIX;
  }
  // If subStr is a defined scalar
  else if (subStr in scalars) {
    return this.SCALAR;
  }
  // If subStr is a valid function
  else if (subStr in functions) {
    return this.FUNCTION;
  }
  else {
    return this.NAM;
  }
}

/**
* Determines the best combination of scalars, matrices, and functions. A helper
* function of wordBreak.
*
* @private
* @param {Array} strPos Array containing containg the valid combinations
* @returns {Array} Array containg the best best combination
*/
Parser.prototype.bestComb = function(strPos) {
  var possOuts = [];  // Possible combinations of a letter based string

  // Lists all possible combinations of a string in possOuts
  this.dfs(strPos, possOuts, [], strPos.length - 1);

  // Count the # of functions in each combination and push it to end of the combination
  for (var i = 0; i < possOuts.length; i++) {
    var funcNum = 0;
    for (var j = 0; j < possOuts[i].length; j++) {
      if (possOuts[i][j][1] == this.FUNCTION) {
        funcNum++;
      }
    }
    possOuts[i].push(funcNum);
  }

  possOuts.sort(this.bestCombCiteria);  // Best comb will be at 1st position of possOuts
  possOut[0].pop(); // Remove the # of functions from the end of the combination

  // Convert the deconstruction's elements into the value they represent
  for (var k = 0; k < possOuts[0].length; k++) {
    switch (possOuts[0][k][1]) {
      case this.MATRIX:
        possOuts[0][k] = matrices[possOuts[0][k][0]];
        break;
      case this.SCALAR:
        possOuts[0][k] = scalars[possOuts[0][k][0]];
        break;
      case this.FUNCTION:
        possOuts[0][k] = functions[possOuts[0][k][0]];
    }
   }

   return possOuts[0];
}

/**
* Determines which combination (comb1, comb2) fits this criteria better:
* 1. Has a function at the end
* 2. Has the least amount of functions
* 3. Has the least amount of elements
* A sorting function used weight combinations within bestComb.
*
* @private
* @param {Array} comb1 Array containing containg the the first combination
* @param {Array} comb2 Array containing containg the the second combination
* @returns {number} -1 if comb1 is better, 1 if comb2 is better, and 0 if equal
*/
Parser.prototype.bestCombCiteria = function(comb1, comb2) {
  // If a function is at the end of a possiblity, weight it higher
  if ((comb1[comb1.length - 2][0] in functions) && !(comb2[comb2.length - 2][0] in functions)) {
    return -1
  }
  else if (!(comb1[comb1.length - 2][0] in functions) && (comb2[comb2.length - 2][0] in functions)) {
    return 1
  }
  // Followed by the least number of functions
  if (comb1[comb1.length - 1] > comb2[comb2.length - 1]) {
    return 1
  }
  else if (comb1[comb1.length - 1] < comb2[comb2.length - 1]) {
    return -1
  }
  // Followed by the least amount of elements in that deconstruction
  else if (comb1.length < comb2.length) {
    return -1;
  }
  else if (comb1.length > comb2.length) {
    return 1;
  }

  return 0;
}

/**
 * A modified version of depth first search. Used to list out possible
 * deconstructions found by wordBreak. This algorithm was translated from a java
 * equivalent which can be found at:
 * https://www.programcreek.com/2014/03/leetcode-word-break-ii-java/.
 *
 * @param {Array} pos Position array containing strings that are part of
 * possible deconstructions
 * @param {Array} possOuts List of possible deconstructions
 * @param {Array} current Current deconstruction being formed
 * @param {number} i Index used to traverse pos recursively
 * @return {Array} Return possOuts full of possible deconstructions
 */
Parser.prototype.dfs(strPos, possOuts, current, i) {
  if (i == 0) {
    possOuts.push(current.slice(0));
    return;
  }

  for (var k = 0; k < strPos[i].length; k++) {
    current.unshift(strPos[i][k]);
    this.dfs(strPos, possOuts, current, i - strPos[i][k][0].length);
    current.shift();
}

/**
* Determines if the provided string is a negative sign. A helper function for
* parseExpression().
*
* @private
* @param {String} strIn string input provided by parseExpression
* @param {Boolean} prevHadOp Boolean determining if an operator was encountered beforehand
* @returns {Boolean} True if strIn was a negative sign
*/
Parser.prototype.isParenBlock = function(strIn, prevHadOp) {
  return strIn == "-" && prevHadOp;
}

/**
* Determines if the provided string is a parenthesis block (...stuff inside...).
* A helper function for parseExpression().
*
* @private
* @param {String} strIn string input provided by parseExpression
* @returns {Boolean} True if strIn was a parenthesis block.
*/
Parser.prototype.isParenBlock = function(strIn) {
  return /\(.*\)/.test(strIn);
}

/**
* Determines if the provided string is an operator (+-+/^). A helper function
* for parseExpression().
*
* @private
* @param {String} strIn string input provided by parseExpression
* @returns {Boolean} True if strIn was an operator
*/
Parser.prototype.isLetterStr = function(strIn) {
  return strIn == "+" | strIn == "-" | strIn == "*" | strIn == "/" | strIn == "^";
}

/**
* Determines if the provided string is a number. A helper function to
* parseExpression().
*
* @private
* @param {String} strIn string input provided by parseExpression
* @returns {Boolean} True if strIn was a number
*/
Parser.prototype.isletterStr = function(strIn) {
  return /[A-Za-z]+/.test(strIn);
}

/**
* Determines if the provided string input is a string composed entirely of
* alphabetic characters. A helper function to parseExpression().
*
* @private
* @param {String} strIn string input provided by parseExpression
* @returns {Boolean} True if strIn was composed entirely of alphabetic characters
*/
Parser.prototype.isNumber = function(strIn) {
  return !isNan(strIn);
}

/**
* Turns a raw mathematical expression into an array split by operators, numbers,
* letter strings, and parenthesis encapsulating items. A helper function to
* parseExpression().
*
* @private
* @param {String} rawIn Raw input mathematical expression
* @returns {Array} Split raw input
*/
Parser.prototype.splitExpToArray = function(mathExp) {
  splitExp.replace(/^\(+|\)+$/g, ''); // Remove encapsulating parenthesis
  var out = mathExp.replace(/\s/g, ''); // Remove spaces
  out = out.split(/([A-Za-z]+|\(.*\)|[\+\-\/\*\^]+|[0-9]\.[0-9]*)/g);
  out.filter(Boolean);  // Remove any null items within out

  return out;
}
