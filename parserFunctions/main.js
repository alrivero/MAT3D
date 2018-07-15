// Defined matrices
var matrices = {"ANS" : math.matrix(), "A" : 2, "B": 3};
// Defined scalar variables
var scalars = {"e" : math.e, "pi" : math.pi, "i" : math.complex(0, 1)};
// Functions used when computing matrices or scalars
var functions = { "inv" : findInverse, "transpose": findTranspose,
                  "det" : findDeterminant, "abs" : findAbs, "log10" : findLog10,
                  "ln" : findNaturalLog, "sqrt" : findSqrt, "lu" : findLu,
                  "rank" : findRank, "cholesky" : findCholesky,
                  "+" : findAdd, "-" : findSub, "/" : findDiv,
                  "*" : matrixMultiplication, "^": findExp };

function main() {
  var parser = new Parser();
  console.log(parser.parseTopBar("-6 * -3det(inv(A*B)) + 3)"));
}
