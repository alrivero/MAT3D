// Defined matrices
var matrices = {"ANS" : math.identity([4,4])};
// Defined scalar variables
var scalars = {"e" : math.e, "pi" : math.pi, "i" : math.complex(0, 1)};
// Functions used when computing matrices or scalars
var functions = { "neg": negative, "inv" : findInverse, "transpose": findTranspose,
                  "det" : findDeterminant, "abs" : findAbs, "log10" : findLog10,
                  "ln" : findNaturalLog, "sqrt" : findSqrt, "lu" : findLu,
                  "rank" : rankOfMatrix, "cholesky" : choleskyDecomp,
                  "+" : findAdd, "-" : findSub, "/" : findDiv,
                  "*" : matrixMultiplication, "^": math.pow };

function main() {
  var parser = new Parser();
  console.log(parser.parseTopBar("-6sqrt(-piepi) + 2epiepi"));
}

function negative(stack) {
  var arg1 = stack.pop();
  return math.multiply(-1, arg1);
}
