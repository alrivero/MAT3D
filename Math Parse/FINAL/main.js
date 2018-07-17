// Defined matrices
var matrices = {"ANS" : math.identity([4,4])};
// Defined scalar variables
var scalars = {"e" : math.e, "pi" : math.pi, "i" : math.complex(0, 1)};

function main() {
  var parser = new Parser();
  console.log(parser.parseTopBar("-6sqrt(-piepi) + 2epiepi"));
}
