// Defined matrices
var matrices = {"ANS" : math.matrix()};
// Defined scalar variables
var scalars = {"e" : math.e, "pi" : math.pi, "i" : math.complex(0, 1)};
// Functions used when computing matrices or scalars
var functions = { "inv" : findInverse, "transpose": findTranspose,
                  "det" : findDeterminant, "abs" : findAbs, "log10" : findLog10,
                  "ln" : findNaturalLog, "sqrt" : findSqrt, "lu" : findLU,
                  "rank" : rankOfMatrix, "cholesky" : choleskyDecomp };

function main() {
  console.log("389pisqrt(4)");
}
