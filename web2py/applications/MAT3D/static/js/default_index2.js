// This is the js for the default/index.html view.


var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    self.add_matrix_button = function () {
        // The button to add a matrix has been pressed.
        self.vue.is_adding_matrix = !self.vue.is_adding_matrix;
    };

    self.add_matrix = function () {
        // The submit button to add a matrix has been pressed.
        $.post(add_matrix_url,
            {
                name: self.vue.form_name,
                row: self.vue.form_row,
                col: self.vue.form_col
            },
            function (data) {
                $.web2py.enableElement($("#add_matrix_submit"));
                //self.vue.matrices.unshift(data.matrix);
                self.vue.matrices.push(data.matrix);
                enumerate(self.vue.matrices);
                self.vue.populate_matrix_name = self.vue.form_name;
                self.vue.populate_cols = self.vue.form_col;
                self.vue.populate_rows = self.vue.form_row;
                self.vue.form_name = "";
                self.vue.form_row = "";
                self.vue.form_col = "";
                //self.vue.form_matrix_id = self.vue.form_matrix_id + 1;
                self.vue.is_adding_matrix = !self.vue.is_adding_matrix;
                self.vue.is_populating_matrix = true;
            });
    };

    self.parse_string = function() {
        // Parsing code goes here. Input variable: self.vue.form_parsertext (Example: A+B)
        // The compute button has been pressed and will parse the input string. (This would come out as "A B +")
        // If parser needs to get the matrix by name, use self.get_matrix_by_name(name) and it
        // will return the data of the matrix based on the name (name would be A or B in this case).
        var parser = new Parser();
        self.vue.return_message = parser.parseTopBar(self.vue.form_parsertext);


        //self.vue.x = self.get_matrix_by_name(self.vue.form_parsertext);
        //var y = parser.parseTopBar(self.vue.form_parsertext);
        //alert(y);
    };

    self.delete_matrix = function(matrix_idx) {
        /*
        // If the last matrix from sidebar has been deleted, then clear the screen
        // where matrices are being displayed
        if (self.vue.populate_matrix_name == self.vue.matrices[matrix_idx].name) {
            self.vue.last_deleted_matrix_name = self.vue.populate_matrix_name;

            var entered_table = document.getElementsByName(self.vue.last_deleted_matrix_name);
            var individual_row = [];
            var individual_matrix = [];

            // Loop through all rows and columns of the table
            // and retrieve content of each cell.
            for ( var i = 0; row = entered_table.rows[i]; i++ ) {
                row = entered_table.rows[i];
                for ( var j = 0; col = row.cells[j]; j++ ) {
                    // create individual array rows from HTML
                    individual_row.push(col.firstChild.nodeValue);
                }
                // Add the individual array row to the individual matrix
                individual_matrix.push(individual_row);
                individual_row = [];
        }
        */

        /*
        var entered_table = document.getElementById("data_matrix");
        var individual_row = [];
        var individual_matrix = [];

        // Loop through all rows and columns of the table
        // and retrieve content of each cell.
        for ( var i = 0; row = entered_table.rows[i]; i++ ) {
            row = entered_table.rows[i];
            for ( var j = 0; col = row.cells[j]; j++ ) {
                // create individual array rows from HTML
                individual_row.push(col.firstChild.nodeValue);
            }
            // Add the individual array row to the individual matrix
            individual_matrix.push(individual_row);
            individual_row = [];
        }
         */

        // Delete Main Matrix
        self.vue.matrices.splice(matrix_idx, 1);
        enumerate(self.vue.matrices);
        // Delete data portion
        self.vue.matrices_data.splice(matrix_idx, 1);
        enumerate(self.vue.matrices_data);
    };

    self.get_this_matrix = function (matrix_idx) {
        // Retrieve name of Matrix
        self.vue.populate_matrix_name = self.vue.matrices[matrix_idx].name;
        // Retrieve the clicked matrix's data
        self.vue.one_matrix = self.vue.matrices_data[matrix_idx];
        // To ensure the html codes goes to logic that only displays the matrix data
        self.vue.is_populating_matrix = false;
    };

    // Used to get all values from matrix based on the name
    self.get_matrix_by_name = function (matrix_name) {

        var arrayLength = self.vue.matrices.length;
        self.vue.return_matrix_data = null;
        if (arrayLength > 0) {
            for (var i = 0; i < arrayLength; i++) {
                if (self.vue.matrices[i].name == matrix_name) {
                    var matrixIdx = i;
                    break;
                }
            }
            // Retrieve the clicked matrix's data
            self.vue.return_matrix_data = self.vue.matrices_data[matrixIdx];
        }
        return self.vue.return_matrix_data;
    };

    // Used to check if matrix is in matrices array
    self.det_matrices_membership = function (matrix_name) {
        var return_membership = false;
        var arrayLength = self.vue.matrices.length;
        if (arrayLength > 0) {
            for (var i = 0; i < arrayLength; i++) {
                if (self.vue.matrices[i].name == matrix_name) {
                    return_membership = true;
                    break;
                }
            }
         }
        return return_membership;
    };

    self.add_data_matrix = function () {
        var entered_table = document.getElementById("data_matrix");
        var individual_row = [];
        var individual_matrix = [];

        // Loop through all rows and columns of the table
        // and retrieve content of each cell.
        for ( var i = 0; row = entered_table.rows[i]; i++ ) {
            row = entered_table.rows[i];
            for ( var j = 0; col = row.cells[j]; j++ ) {
                // create individual array rows from HTML
                individual_row.push(col.firstChild.nodeValue);
            }
            // Add the individual array row to the individual matrix
            individual_matrix.push(individual_row);
            individual_row = [];
        }

        // For debugging, to be displayed on html
        self.vue.one_matrix = individual_matrix;
        // Store matrix created from html into matrices_data []
        self.vue.matrices_data.push(individual_matrix);
        // Reset is_populating_matrix to false to prevent entry
        self.vue.is_populating_matrix = false;

        // Popup Alert message
        alert("Matrix Data Saved");
    };

    self.is_3D_button = function () {
        // button to toggle between 3D mode and 2D mode
        self.vue.is_3D = !self.vue.is_3D;
    };


    /* Matrix function buttons */

    self.determinant = function () {
        document.getElementById("no_table_parsertext").value = "det(";
    };

    self.inverse = function () {
        document.getElementById("no_table_parsertext").value = "inv(";
    };

    self.transpose = function () {
        document.getElementById("no_table_parsertext").value = "transpose(";
    };

    self.lu_decomposition = function () {
        document.getElementById("no_table_parsertext").value = "lu(";
    };

    self.rank = function () {
        document.getElementById("no_table_parsertext").value = "rank(";
    };

    self.cholesky_decomposition = function () {
        document.getElementById("no_table_parsertext").value = "cholesky(";
    };


    /* Other function buttons */

    self.absolute_value = function () {
        document.getElementById("no_table_parsertext").value = "abs(";
    };

    self.log_base_10 = function () {
        document.getElementById("no_table_parsertext").value = "log10(";
    };

    self.natural_log = function () {
        document.getElementById("no_table_parsertext").value = "ln(";
    };

    self.square_root = function () {
        document.getElementById("no_table_parsertext").value = "sqrt(";
    };


    /* Trig function buttons */

    self.sine = function () {
        document.getElementById("no_table_parsertext").value = "sin(";
    };

    self.cosine = function () {
        document.getElementById("no_table_parsertext").value = "cos(";
    };

    self.tangent = function () {
        document.getElementById("no_table_parsertext").value = "tan(";
    };

    self.secant = function () {
        document.getElementById("no_table_parsertext").value = "sec(";
    };

    self.cosecant = function () {
        document.getElementById("no_table_parsertext").value = "csc(";
    };

    self.cotangent = function () {
        document.getElementById("no_table_parsertext").value = "cot(";
    };


    /* Inverse trig function buttons */

    self.arcsine = function () {
        document.getElementById("no_table_parsertext").value = "arcsin(";
    };

    self.arccosine = function () {
        document.getElementById("no_table_parsertext").value = "arccos(";
    };

    self.arctangent = function () {
        document.getElementById("no_table_parsertext").value = "arctan(";
    };


    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_adding_matrix: false,
            matrices: [],
            matrices_data: [],
            one_matrix: [],
            form_name: null,
            form_parsertext: null,
            form_row: null,
            form_col: null,
            return_message: null,
            self_page: false,
            populate_matrix_name: null,
            populate_cols: null,
            populate_rows: null,
            is_populating_matrix: false,
            is_3D: false,
            matrix_name: null,
            return_matrix_data: null,
            x: [],
            last_deleted_matrix_name: null
        },
        methods: {
            add_matrix_button: self.add_matrix_button,
            add_matrix: self.add_matrix,
            parse_string: self.parse_string,
            get_this_matrix: self.get_this_matrix,
            get_matrix_by_name: self.get_matrix_by_name,
            det_matrices_membership: self.det_matrices_membership,
            delete_matrix: self.delete_matrix,
            add_data_matrix: self.add_data_matrix,
            is_3D_button: self.is_3D_button,
            determinant: self.determinant,
            inverse: self.inverse,
            transpose: self.transpose,
            lu_decomposition: self.lu_decomposition,
            rank: self.rank,
            cholesky_decomposition: self.cholesky_decomposition,
            absolute_value: self.absolute_value,
            log_base_10: self.log_base_10,
            natural_log: self.natural_log,
            square_root: self.square_root,
            sine: self.sine,
            cosine: self.cosine,
            tangent: self.tangent,
            secant: self.secant,
            cosecant: self.cosecant,
            cotangent: self.cotangent,
            arcsine: self.arcsine,
            arccosine: self.arccosine,
            arctangent: self.arctangent
        }

    });

    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
