// Defined matrices
var matrices = { "ANS": math.matrix() };
// Defined scalar variables
var scalars = { "e": math.e, "pi": math.pi, "i": math.complex(0, 1) };
// Functions used when computing matrices or scalars
var functions = {
  "inv": findInverse, "transpose": findTranspose,
  "det": findDeterminant, "abs": findAbs, "log10": findLog10,
  "ln": findNaturalLog, "sqrt": findSqrt, "lu": findLu,
  "rank": findRank, "cholesky": findCholesky,
  "+": findAdd, "-": findSub, "/": findDiv,
  "*": matrixMultiplication, "^": findExp, //elc
  "sin": findSin, "cos": findCos, "tan": findTan,
  "asin": findArcSin, "acos": findArcCos, "atan": findArcTan,
  "csc": findCosecant, "sec": findSecant, "cot": findCotangent
};

function main() {
  console.log(parseExpression("389pisqrt(4)"));
}
