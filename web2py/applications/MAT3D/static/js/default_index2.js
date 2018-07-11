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
                col: self.vue.form_col,
                matrix_id: self.vue.form_matrix_id
            },
            function (data) {
                $.web2py.enableElement($("#add_matrix_submit"));
                self.vue.matrices.unshift(data.matrix);
                enumerate(self.vue.matrices);
                self.vue.populate_matrix_name = self.vue.form_name;
                self.vue.populate_cols = self.vue.form_col;
                self.vue.populate_rows = self.vue.form_row;
                self.vue.form_name = "";
                self.vue.form_row = "";
                self.vue.form_col = "";
                self.vue.form_matrix_id = self.vue.form_matrix_id + 1;
                self.vue.is_adding_matrix = !self.vue.is_adding_matrix
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
    };

    self.get_user_matrix = function (matrix_id) {
        $.post(get_matrix_url,
            {
                matrix_id: matrix_id
            },
            function (data) {
                self.vue.self_page = data.self_page;
                self.vue.matrices = data.matrices;
                enumerate(self.vue.matrices);
        })
    };

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_adding_matrix: false,
            matrices: [],
            form_name: null,
            form_parsertext: null,
            form_row: null,
            form_col: null,
            form_matrix_id: 0,
            return_message: null,
            returnmessage: null,
            self_page: false,
            populate_matrix_name: null,
            populate_cols: null,
            populate_rows: null,
            is_populating_matrix: false

        },
        methods: {
            add_matrix_button: self.add_matrix_button,
            add_matrix: self.add_matrix,
            parse_string: self.parse_string,
            get_matrix_id: self.get_matrix_id
        }

    });

    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
