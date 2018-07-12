//AUTHOR JACOB SCHWARTZ
//JS FILE
//TAKES INPUT FROM TEXT BOX AND SEND IT TO PARSER.JS

function mainInput(){
    //FUNCTION RUN WHEN WEB PAGE IS LOADED
    //FOR main project index
    document.getElementById("compute_button").onclick = function(){
        runParser();
    };
}

function mainTest() {
    //FUNCTION RUN WHEN WEB PAGE IS LOADED
    //FUNCTION FOR example.html
    document.getElementById("button1").onclick = function(){
        console.log("running ");
        runFunction();
    };

}

function runParser(inputString){
    //FUNCTION CALLED FOR FROM mainInput
    //FOR main project index
    var computeString = document.getElementById('no_table_parsertext').value;

}

function runFunction() {
    //FUNCTION TEST FOR example.html

    console.log("readstack test");
    var stack = ["2", [
        [2, 1],
        [1, 4]
    ], "4", "*", "+"];
    var ans = readStack2(stack);
    console.log(ans);
    print(ans);

    console.log("input test");
    var currentString = document.getElementById('textbox').value;
    console.log(currentString);
    var ex = parseExpression(currentString);
    print(ex);
    //console.log(ex);

    console.log("current test");
    var arr1 = [
        [4, 12, -16],
        [12, 37, -43],
        [-16, -43, 98]
    ];
    var arr3 = [
        [18, 22, 54, 42],
		[22, 70, 86, 62],
		[54, 86, 174, 134],
		[42, 62, 134, 106]];
    var arr2 = choleskyDecomp(arr1);
    print(arr2);
}