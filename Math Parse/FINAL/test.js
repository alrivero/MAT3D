/**
 * This is a test program for the Parser object of MAT3D.
 *
 * @author Alfredo Rivero
 * @version 2.0
 */

/**
* The main function called to test the Parser. Prints an array of test outputs
* to the console.
*/
function main() {
  // Construct the Parser object and add test variables inside
  var parser = new Parser();
  addVariables();

  // Push to the out array the results of each test
  var out = [];

  // SHOULD WORK
  // Basic math expression (no vars)
  out.push(parser.parseTopBar("9+ 2 - 3.4"));
  // Math expresion with vars
  out.push(parser.parseTopBar("9A * 2I^2 - 3.4I"));
  // Math expression with function (singular)
  out.push(parser.parseTopBar(det(A*B)));
  // Math expression with no * between vars
  out.push(parser.parseTopBar("ABC + 2inv(BC)"));
  // Math expression with nested parenthesis
  out.push(parser.parseTopBar("((((9+2)I - (3.4A))))"));
  // Math expression with negative sign
  out.push(parser.parseTopBar("-3det(A)"));
  // Math expression with operator followed by negative negative sign
  out.push(parser.parseTopBar("3I *-BC"));
  // Math expression with nested functions
  out.push(parser.parseTopBar("inv(codec(A))"));

  // SHOULD THROW EXCEPTION
  // Number being assigned to the side bar (only matrices)
  out.push(parser.parseSideBar("9+ 2 - 3.4i"));
  // Matrix assigned to matrix cell (only scalars)
  out.push(parser.parseMatCell("A"));
  // Invalid characters
  out.push(parser.parseTopBar("?><,\'\"_=%$#@!&{}[]~\|:;"));
  // operators n-times
  out.push(parser.parseTopBar("9****4"));
  // function times function
  out.push(parser.parseTopBar("det*inv"));
  // Undefined variables
  out.push(parser.parseTopBar("APPLEISFOOD"));
  // No operators
  out.push(parser.parseTopBar("8 9 6 I"));
  // Weird spacing
  out.push(parser.parseTopBar("3              *           6  ^   2"));
  // Multiple .. in decimals
  out.push(parser.parseTopBar("9...4 * 3"));
  // Absolute garbage
  out.push(parser.parseTopBar("fneojfnqeoifn fu wehif iwfoa;h94y2853 8y08 "));

  // Overlook out
  console.log(out);
}
