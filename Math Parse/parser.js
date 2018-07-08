var ops = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3, "(": 4}; // Op presedence dictionary

// Breaks down the user's mathematical expression into reverse polish notation.
// Based on Shunting-Yard.
function toRPN(rawIn) {
  var rpnOut = []; // Queue used for output

  var opStack = []; // Stack of operators
  var hadOpPrev = true;  // Used for differentating between neg sign/sub.

  for (var i = 0; i < rawIn.length; i++) {
    var itemRead = "";  //Used for interperting numbers/letter strings

    var j = 0;
    while (j < rawIn[i].length) {
      var currChar = rawIn[i].charAt(j);  // Character currently read

      try {
        // Check if the character read is invalid
        if ("|\":<>[]{}`';@#$%&_=?!,~".indexOf(currChar) != -1)
          throw "Expression has invalid characters: *|\":<>[]{}`';@#$%&_=?!,~";

        // If the currChar is a number
        if (currChar.match(/^[.0-9]+$/)) {
          // Gather the rest of the number characters
          do {
            itemRead = itemRead.concat(currChar);
            j++;
            if (j < rawIn[i].length)
              currChar = rawIn[i].charAt(j);
          } while (j < rawIn[i].length && currChar.match(/^[.0-9]+$/))

          // Turn the number characters into a float
          itemRead = parseFloat(itemRead, 10);
          if (itemRead == NaN) {
            throw "Invalid number: Periods possibly used incorrectly";
          }

          // Check if the number was preceeded by an operator. If not, previous
          // Item must have be a variable/function so add "*" inbetween
          if (!hadOpPrev) {
            while (opStack.length > 0 && ops[opStack[opStack.length - 1]] <= ops["*"])
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
            if (j < rawIn[i].length)
              currChar = rawIn[i].charAt(j);
          } while (currChar.match(/^[A-Za-z]+$/) && j < rawIn[i].length)

          // Use wordBreak algorithm to deconstruct letter string into array of
          // best combination of variables/functions
          itemRead = wordBreak(itemRead);
          if (itemRead == [])
            throw "Undefined scalars/matrices/functions";

          // Check if the number was preceeded by an operator. If not, previous
          // Item must have be a variable/function so add "*" inbetween
          if (!hadOpPrev) {
            while (opStack.length > 0 && ops[opStack[opStack.length - 1]] <= ops["*"])
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
                while (opStack.length > 0 && ops[opStack[opStack.length - 1]] <= ops["*"])
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
          while (opStack.length > 0 && ops[opStack[opStack.length - 1]] <= ops["-"])
            rpnOut.push(opStack.pop());
          opStack.push(currChar);
          hadOpPrev = true;
          j++;
        }
        // If currChar is an operator
        else if ("+-*/^".indexOf(currChar) != -1) {
          // If currChar is of higher presedence, keep poping the stack into rpnOut
          while (ops[opStack[opStack.length - 1]] <= ops[currChar])
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
          if (opStack.length > 0 && typeof(opStack[opStack.length - 1]) = "function") {
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
      catch (err) {
        // NECESSARY ERROR HANDELING GOES HERE
        var myErr = err;
        console.log(err);
        exit(1);
      }
    }
  }
  // Push all remaining items off the opStack
  for (var m = 0; m < opStack.length; m++)
    rpnOut.push(opStack.pop());

  return rpnOut;
}

// A modified version of the wordBreak algorithm. Computes and lsists all possible
// combinations.
function wordBreak(word, definedDic) {
  var pos = new Array(word.length + 1);
  pos[0] = [];

  for (var i = 0; i < word.length; i++) {
    if (pos[i] != null) {
      for (var j = i + 1; j <= word.length; j++) {
        var subStr = word.substring(i, j);
        if (subStr in matrices) {
          if (pos[j] == null) {
            var list = [];
            list.push([subStr, 0]);
            pos[j] = list;
          }
          else {
            pos[j].push([subStr, 0]);
          }
        }
        else if (subStr in scalars) {
          if (pos[j] == null) {
            var list = [];
            list.push([subStr, 1]);
            pos[j] = list;
          }
          else {
            pos[j].push([subStr, 1]);
          }
        }
        else if (subStr in functions) {
          if (pos[j] == null) {
            var list = [];
            list.push([subStr, 2]);
            pos[j] = list;
          }
          else {
            pos[j].push([subStr, 2]);
          }
        }
      }
    }
  }

  if (pos[word.length] == null) {
    return [];
  }
  else {
    var possOuts = [];
    dfs(pos, possOuts, [], word.length)
    return bestComb(possOuts)
  }
}

// Depth-First Search. Used to list all posible combinations found by wordbreak.
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

function bestComb(possOuts) {
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

  possOuts.sort(function(list1, list2) {
    if (list1[list1.length - 1] < list2[list2.length - 1]) {
      return 1
    }
    else if (list1[list1.length - 1] > list2[list2.length - 1]) {
      return -1
    }
    else if (list1.length > list2.length) {
      return 1;
    }
    else if (list1.length < list2.length) {
      return -1;
    }

    return 0;
  });

  possOuts[0].pop();
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
