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

    self.parse_string = function(data) {
        // The compute button has been pressed and will parse the input string.
        $.post(parse_string_url,
            {
                parser_text: self.vue.form_parsertext
            },
            function (data) {
                self.vue.return_message = data.returnmessage;
            });
    }



     self.delete_matrix = function(matrix_idx) {
         /*Delete Main Matrix */
        self.vue.matrices.splice(matrix_idx, 1);
        enumerate(self.vue.matrices);
        /* Delete data portion */
        self.vue.matrices_data.splice(matrix_idx, 1);
        enumerate(self.vue.matrices_data);
    };


     self.get_this_matrix = function (matrix_idx) {
         //Retrieve name of Matrix
         self.vue.populate_matrix_name = self.vue.matrices[matrix_idx].name;
         //Retrieve the clicked matrix's data
         self.vue.one_matrix = self.vue.matrices_data[matrix_idx];
         //To ensure the html codes goes to logic that only displays the matrix data
         self.vue.is_populating_matrix = false;
    };

    self.add_data_matrix = function () {

        var entered_table = document.getElementById("data_matrix")
        var individual_row = [];
        var individual_matrix = [];

        // Loop through all rows and columns of the table
        // and retrieve content of each cell.
        for ( var i = 0; row = entered_table.rows[i]; i++ ) {
            row = entered_table.rows[i];
            for ( var j = 0; col = row.cells[j]; j++ ) {
                //create individual array rows from HTML
                    individual_row.push(col.firstChild.nodeValue);
            }
            //Add the individual array row to the individual matrix
            individual_matrix.push(individual_row);
            individual_row = []
        }
        // For debugging, to be displayed on html
        self.vue.one_matrix = individual_matrix;
        // Store matrix created from html into matrices_data []
        self.vue.matrices_data.push(individual_matrix);
        //Reset is_populating_matrix to false to prevent entry
        self.vue.is_populating_matrix = false;


        //Popup Alert message
        alert("Matrix Data Saved");

    };

    self.is_3D_button = function () {
        // button to toggle between 3D mode and 2D mode
        self.vue.is_3D = !self.vue.is_3D;
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
            returnmessage: null,
            self_page: false,
            populate_matrix_name: null,
            populate_cols: null,
            populate_rows: null,
            is_populating_matrix: false,
            is_3D: false
        },
        methods: {
            add_matrix_button: self.add_matrix_button,
            add_matrix: self.add_matrix,
            parse_string: self.parse_string,
            get_this_matrix: self.get_this_matrix,
            delete_matrix: self.delete_matrix,
            add_data_matrix: self.add_data_matrix,
            is_3D_button: self.is_3D_button
        }

    });

    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});