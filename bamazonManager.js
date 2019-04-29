const mysql = require("mysql")
var inquirer = require('inquirer');
var Table = require('cli-table');

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "bamazon"
});

const connection_view_low = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "bamazon"
});

const connection_add = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "bamazon"
});


function start_manager() {
    inquirer.prompt([
        {
            type: "list",
            message: "Manager options list",
            choices: ["View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Quit"],

            name: "select"
        }

    ]).then(function (res) {
        // console.log("res: ",res.select)
        var u_i = res.select
        if (u_i == "View Products for Sale") {
            console.log("u_i: ", u_i);
            View_Products()
        } else if (u_i == "View Low Inventory") {
            console.log("u_i: ", u_i);
            // View_Low_Inv()
            inq_v_low_inv()

        } else if (u_i == "Add to Inventory") {
            console.log("u_i: ", u_i);
            Add_to_Inventory()

        } else if (u_i == "Add New Product") {
            console.log("u_i: ", u_i);
            add_new()

        } else if (u_i == "Quit") {
            console.log("Quit selected - Goodbye");
            connection.end();

        }

    });
}
start_manager();

function View_Products() {
    // connection = new connection;
    connection.query("select item_id,product_name,department_name,price,stock_quantity from products", function (error, result) {
        if (error) throw error;
        var table = [];
        var row = []
        for (var i = 0; i < 1; i++) {
            // get i-th object in the results array  
            var columnsIn = result[i];
            // loop through every key in the object
            for (var key in columnsIn) {
                // console.log(key)
                row.push(key)
            }
        }
        table.push(row)
        row = []
        for (var i = 0; i < result.length; i++) {
            // get i-th object in the results array  
            var columnsIn = result[i];
            // loop through every key in the object
            for (var key in columnsIn) {
                // console.log(result[i][key]); // here is your column name you are looking for + its value
                row.push(result[i][key])
            }
            table.push(row)
            row = []
        }
        col_max_len = []
        for (j = 0; j < table[0].length; j++) {

            var x = 0;
            for (i = 0; i < result.length; i++) {

                if (x < table[i][j].toString().length) {
                    x = table[i][j].toString().length;
                }

            }
            x += 2;
            col_max_len.push(x)
        }
        // console.log(col_max_len)


        var displayTable = new Table({
            head: ["Item ID", "Product Name", "Catergory", "Price", "Quantity"],
            // dynamicly built column lengths
            colWidths: col_max_len
        });
        for (var i = 0; i < result.length; i++) {
            displayTable.push(
                [result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity]
            );
        }
        console.log(displayTable.toString());
        // connection.end();
        start_manager();
    });


}

function inq_v_low_inv() {
    inquirer.prompt([
        {
            type: "input",
            message: "Items with an inventory of less than what number?",
            name: "num_name",
            //https://www.npmjs.com/package/inquirer number: User input (filtered if filter is defined) (Number)
            filter: Number
        }
    ]).then(function (res) {
        console.log(res.num_name)
        View_Low_Inv(res.num_name)

    });
}

function View_Low_Inv(num) {

    var query = "select item_id,product_name,department_name,price,stock_quantity from products where stock_quantity < ?";
    // var query = "select * from products where stock_quantity < 500";
    connection.query(query, num, function (error, result) {
        // connection_view_low.query(query, function (error, result) {
        if (error) throw error;

        var table = [];
        var row = []
        for (var i = 0; i < 1; i++) {
            // get i-th object in the results array  
            var columnsIn = result[i];
            // loop through every key in the object
            for (var key in columnsIn) {
                // console.log(key)
                row.push(key)
            }
        }
        table.push(row)
        row = []
        for (var i = 0; i < result.length; i++) {
            // get i-th object in the results array  
            var columnsIn = result[i];
            // loop through every key in the object
            for (var key in columnsIn) {
                // console.log(result[i][key]); // here is your column name you are looking for + its value
                row.push(result[i][key])
            }
            table.push(row)
            row = []
        }
        col_max_len = []
        for (j = 0; j < table[0].length; j++) {

            var x = 0;
            for (i = 0; i < result.length; i++) {

                if (x < table[i][j].toString().length) {
                    x = table[i][j].toString().length;
                }

            }
            x += 2;
            col_max_len.push(x)
        }
        // console.log(col_max_len)


        var displayTable = new Table({
            head: ["Item ID", "Product Name", "Catergory", "Price", "Quantity"],
            // dynamicly built column lengths
            colWidths: col_max_len
        });
        for (var i = 0; i < result.length; i++) {
            displayTable.push(
                [result[i].item_id, result[i].product_name, result[i].department_name, result[i].price,result[i].stock_quantity ]
            );
        }
        console.log(displayTable.toString());


        // connection.end();
        start_manager();
    });

}


function Add_to_Inventory() {
    var query = "select item_id, product_name,stock_quantity from products";
    var options = []
    var id = []
    var id_option = []
    connection.query(query, function (error, result) {
        if (error) throw error;
        // console.log(result[0].product_name)
        for (i = 0; i < result.length; i++) {
            options.push(result[i].product_name)
            id.push(result[i].item_id)
            id_option[i] = [result[i].item_id, result[i].product_name]
        }

        //somehow I need to keep track of the IDs incase the products have the
        //same name either on purpose or accident 

        // console.log(id_option)
        inquirer.prompt([
            {
                type: "list",
                message: "Select product to add inventory to.",
                choices: options,
                name: "select"
            }, {
                type: "input",
                message: "Enter how many to add to inventory.",
                name: "num_name",
                //https://www.npmjs.com/package/inquirer number: User input (filtered if filter is defined) (Number)
                filter: Number
            }

        ]).then(function (res) {

            // console.log(id_option)
            var index_to_update = "";
            var add_to_inv = res.num_name
            for (i = 0; i < id_option.length; i++) {
                if (id_option[i][1] == res.select) {
                    index_to_update = id_option[i][0]
                }

            }
            // console.log(index_to_update)
            var query = "select stock_quantity from products where ?";
            connection.query(query, { item_id: index_to_update }, function (error, res) {
                // connection.query(query, function(error, res) {
                if (error) throw error;
                // console.log("res[0]: ",res[0].stock_quantity)
                var current_inv = res[0].stock_quantity;
                var new_total_quant = current_inv + add_to_inv;

                updated_w_id(index_to_update, new_total_quant)


            });


        });


    });

}



function updated_w_id(index_to_update, add_to_inv) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: add_to_inv
            },
            {
                item_id: index_to_update
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product updated!\n");
            // connection_add.end();
            start_manager();
        });


}



function add_new() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the product_name of the new item.",
            name: "product_name",
            // filter:Number
        }, {
            type: "input",
            message: "Enter the department_name of the new item.",
            name: "department_name",
            // filter:Number
        }, {
            type: "input",
            message: "Enter the price of the new item.",
            name: "price_name",
            filter: Number
        }, {
            type: "input",
            message: "Enter the stock_quantity of the new item.",
            name: "quantity_name",
            filter: Number
        }
    ]).then(function (res) {
        // console.log(res.product_name)
        // console.log(res.department_name)
        // console.log(res.price_name)
        // console.log(res.quantity_name)
        var var_pass = res.product_name

        const add = function (res,pass) {
            

            connection.query(
                "INSERT INTO products SET ?",
                [{
                    product_name: res.product_name,
                    department_name: res.department_name,
                    price: res.price_name,
                    stock_quantity: res.quantity_name
                }], function (err, res ) {
                    if (err) throw err;
                    console.log("\nSuccess: \n"+ pass+" has been added to the database.")
                    start_manager();
                });
            // connection.end();
        };
        add(res,var_pass)        

    });

}
function if_null_return_zero(if_null){
    if(if_null == null){
        return 0;
    }else{
        return if_null;
    }
}