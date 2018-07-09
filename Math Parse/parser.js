/**
 * Parses mathematical expressions.
 *
 * @author Alfredo
 * @version 1.0
 */

 // Operator presedence dictionary
 var ops = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3, "(": 0};

/**
* Computes the matheamtical expression provided as input
*
* @param {object} splitIn An array containing the user's raw input
* @return {object} The output produced by mathematical expression
*/
function parseExpression(rawIn) {
  var rpnStack = toRPN(rawIn.split(" "));
  return rpnStack;
  //return readStack(rpn);
}

/**
 * Turns an array from infix notation to reverse polish notation
 *
 * @param {object} splitIn An array containing the user's space-seperated input
 * @return {object} An array containing splitIn in reverse polish notation
 * @throws Will throw error messages depending on errors within the user's input
 */
function toRPN(splitIn) {
  var rpnOut = []; // Queue used for output

  var opStack = []; // Stack of operators
  var hadOpPrev = true;  // Used for differentating between neg sign/sub.

  try {
    for (var i = 0; i < splitIn.length; i++) {
      var itemRead = "";  //Used for interperting numbers/letter strings

      var j = 0;
      while (j < splitIn[i].length) {
        var currChar = splitIn[i].charAt(j);  // Character currently read

        try {
          // Check if the character read is invalid
          if ("|\":<>[]{}`';@#$%&_=?!,~".indexOf(currChar) != -1)
            throw "Expression has invalid characters: *|\":<>[]{}`';@#$%&_=?!,~";

          // If the currChar is a number
          if (currChar.match(/^[0-9.]+$/)) {
            // Gather the rest of the number characters
            do {
              itemRead = itemRead.concat(currChar);
              j++;
              if (j < splitIn[i].length)
                currChar = splitIn[i].charAt(j);
            } while (j < splitIn[i].length && currChar.match(/^[0-9.]+$/))

            // Turn the number characters into a float
            itemRead = parseFloat(itemRead, 10);
            if (itemRead == NaN) {
              throw "Invalid number: Periods possibly used incorrectly";
            }

            // Check if the number was preceeded by an operator. If not, previous
            // Item must have be a variable/function so add "*" inbetween
            if (!hadOpPrev) {
              while (opStack.length > 0 && ops[opStack[opStack.length - 1]] >= ops["*"])
                rpnOut.push(opStack.pop());
              opStack.push("*");
            }
            // Push number to the stack
            rpnOut.push(itemRead);

            // Reset itemRead to the empty string
            itemRead = "";
            hadOpPrev = false;
          }
          // If currChar is a letter
          else if (currChar.match(/^[A-Za-z]+$/)) {
            // Gather the rest of the letter string
            do {
              itemRead = itemRead.concat(currChar);
              j++;
              if (j < splitIn[i].length)
                currChar = splitIn[i].charAt(j);
            } while (currChar.match(/^[A-Za-z]+$/) && j < splitIn[i].length)

            // Use wordBreak algorithm to deconstruct letter string into array of
            // best combination of variables/functions
            itemRead = wordBreak(itemRead);
            if (itemRead == [])
              throw "Undefined scalars/matrices/functions";

            // Check if the number was preceeded by an operator. If not, previous
            // Item must have be a variable/function so add "*" inbetween
            if (!hadOpPrev) {
              while (opStack.length > 0 && ops[opStack[opStack.length - 1]] >= ops["*"])
                rpnOut.push(opStack.pop());
              opStack.push("*");
            }

            // Step through each element in itemRead array and manipulate rpnOut
            // and opStack
            for (var k = 0; k < itemRead.length; k++) {
              // If what is in the array is a number or matrix
              if (!isNaN(itemRead[k]) || typeof(itemRead[k]) == "object") {
                rpnOut.push(itemRead[k]);

                // If the number/matrix is followed by another element in itemRead
                // add a "*" operator between the two elements
                if (k < itemRead.length - 1) {
                  while (opStack.length > 0 && ops[opStack[opStack.length - 1]] >= ops["*"])
                    rpnOut.push(opStack.pop());
                  opStack.push("*");
                }
              }
              // If what is in the array is a function
              else {
                opStack.push(itemRead[k]);
              }
            }

            // Reset itemRead to the empty string
            itemRead = "";
            hadOpPrev = false;
          }
          // If currChar is a negative sign (NOT SUBTRACTION)
          else if (currChar == "-" && hadOpPrev) {
            rpnOut.push(0);
            while (opStack.length > 0 && ops[opStack[opStack.length - 1]] >= ops["-"])
              rpnOut.push(opStack.pop());
            opStack.push(currChar);
            hadOpPrev = true;
            j++;
          }
          // If currChar is an operator
          else if ("+-*/^".indexOf(currChar) != -1) {
            // If currChar is of higher presedence, keep poping the stack into rpnOut
            while (ops[opStack[opStack.length - 1]] >= ops[currChar])
              rpnOut.push(opStack.pop());
            // Push currChar to operator stack
            opStack.push(currChar);
            hadOpPrev = true;
            j++;
          }
          // If currChar is a ( parenthesis
          else if (currChar == "(") {
            opStack.push(currChar);
            hadOpPrev = true;
            j++;
          }
          // If currChar is a ) parenthesis
          else if (currChar == ")") {
            while (opStack[opStack.length - 1] != "(") {
              rpnOut.push(opStack.pop());
            }
            opStack.pop();
            if (opStack.length > 0 && typeof(opStack[opStack.length - 1]) == "function") {
              rpnOut.push(opStack.pop());
            }
            hadOpPrev = false;
            j++;
          }
          // Otherwise something went wrong
          else {
            throw "Error while parsing ¯\_(ツ)_/¯"
          }
        }
      }
    }
  }
  catch {
    // NECESSARY ERROR HANDELING GOES HERE
    console.log(err);
  }

  // Push all remaining items off the opStack
  while (opStack.length != 0)
    rpnOut.push(opStack.pop());

  return rpnOut;
}

/**
 * A modified version of the wordbreak algorithm. Determines if a string can be
 * deconstructed into defined scalars/matrices/functions and provides a table
 * which keeps track of possible deconstructions of scalars/matrices/functions.
 *
 * @param {string} word String that will be deconstructed by wordbreak
 * @return {object} [] if the string cannot be deconstructed. Otherwise the
 * best deconstruction of word.
 */
function wordBreak(word) {
  // Array used to keep track of defined substrings within word
  var pos = new Array(word.length + 1);
  pos[0] = [];

  for (var i = 0; i < word.length; i++) {
    if (pos[i] != null) {
      for (var j = i + 1; j <= word.length; j++) {
        // Substring within word
        var subStr = word.substring(i, j);
        // Used to tag a substring as a scalar/matrix/function
        var member = -1;

        // If subStr is a defined matrix
        if (subStr in matrices) {
          member = 0;
        }
        // If subStr is a defined scalar
        else if (subStr in scalars) {
          member = 1;
        }
        // If subStr is a valid function
        else if (subStr in functions) {
          member = 2;
        }

        // If subStr is a valid matrix/scalar/function, add it to pos
        if (member != -1) {
          if (pos[j] == null) {
            var list = [];
            list.push([subStr, member]);
            pos[j] = list;
          }
          else {
            pos[j].push([subStr, member]);
          }
        }
      }
    }
  }

  // If no valid deconstruction was found, return the empty array
  if (pos[word.length] == null) {
    return [];
  }
  else {
    // Array containg possible deconstructions found by wordBreak
    var possOuts = [];
    // Use depth first search to list out possible deconstructions
    dfs(pos, possOuts, [], word.length)
    // Return the best deconstruction using bestComb
    return bestComb(possOuts)
  }
}

/**
 * A modified version of depth first search. Used to list out possible
 * deconstructions found by wordBreak
 *
 * @param {object} pos Position array containing strings that are part of
 * possible deconstructions
 * @param {object} possOuts List of possible deconstructions
 * @param {object} current Current deconstruction being formed
 * @param {number} i Index used to traverse pos recursively
 * @return {object} Return possOuts full of possible deconstructions
 */
function dfs (pos, possOuts, current, i) {
  if (i == 0) {
    possOuts.push(current.slice(0));
    return;
  }

  for (var k = 0; k < pos[i].length; k++) {
    current.unshift(pos[i][k]);
    dfs(pos, possOuts, current, i - pos[i][k][0].length);
    current.shift();
  }
}

/**
 * Finds the best possible deconstruction of a word deconsructed by wordBreak
 *
 * @param {object} possOuts Array containg all possible deconstructions of a word
 * @return {object} Returns an array containg the best possible deconstruction
 * of a word
 */
function bestComb(possOuts) {
  // Count the number functions within a possible deconstruction
  for (var i = 0; i < possOuts.length; i++) {
    var funcNum = 0;
    var initLen = possOuts[i].length;
    for (var j = 0; j < initLen; j++) {
      if (possOuts[i][j][1] == 2) {
        funcNum++;
      }
    }
    possOuts[i].push(funcNum);
  }

  // Sort the possibilites based on the below criteria
  possOuts.sort(function(list1, list2) {
    // If a function is at the end of a possiblity, weight it higher
    if ((list1[list1.length - 2][0] in functions) && !(list2[list2.length - 2][0] in functions)) {
      return -1
    }
    else if (!(list1[list1.length - 2][0] in functions) && (list2[list2.length - 2][0] in functions)) {
      return 1
    }
    // Followed by the least number of functions
    if (list1[list1.length - 1] > list2[list2.length - 1]) {
      return 1
    }
    else if (list1[list1.length - 1] < list2[list2.length - 1]) {
      return -1
    }
    // Followed by the least amount of elements in that deconstruction
    else if (list1.length < list2.length) {
      return -1;
    }
    else if (list1.length > list2.length) {
      return 1;
    }

    return 0;
  });

  // Pop the number of functions off from the end of the best deconstruction
  possOuts[0].pop();
  // Convert the deconstruction into array containg the element's actual values
  for (var k = 0; k < possOuts[0].length; k++) {
    switch (possOuts[0][k][1]) {
      case 0:
        possOuts[0][k] = matrices[possOuts[0][k][0]];
        break;
      case 1:
        possOuts[0][k] = scalars[possOuts[0][k][0]];
        break;
      case 2:
        possOuts[0][k] = functions[possOuts[0][k][0]];
    }
  }

  return possOuts[0];
}
