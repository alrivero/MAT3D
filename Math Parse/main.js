var matrices = {"ANS" : math.matrix(), I : math.matrix()};
var scalars = {"e" : math.e, "pi" : math.pi, "i" : math.complex(0, 1)};
var functions = {"hulloh" : hulloh, "*" : mul,
                 "+" : add, "-" : sub, "\\" : div,
                 "^" : exp};

function main() {
  console.log(toRPN("-1.74ehulloh(piIe) * (2 + 4^2)*3I".split(" ")));
}

function add(){
  return true
}
function sub(){
  return true
}
function mul(){
  return true
}
function div(){
  return true
}
function hulloh(){
  return true
}
function exp(){
  return true
}
