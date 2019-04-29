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

Array.prototype.unique = function () {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}

var item_to_buy
var quant_to_buy
var check



var select_all = function () {
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
            // colWidths: [10, 25, 25, 10, 14]
            colWidths: col_max_len
        });
        for (var i = 0; i < result.length; i++) {
            displayTable.push(
                [result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity]
            );
        }
        console.log(displayTable.toString());
        ask_id_qunat()
        // connection.end();
    });


}
select_all()


function ask_id_qunat() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the Item ID of the product you would like to buy",
            name: "id_name",
            //https://www.npmjs.com/package/inquirer number: User input (filtered if filter is defined) (Number)
            filter: Number
        }, {
            type: "input",
            message: "Enter the quantity you would like to buy.",
            name: "quant_name",
            //https://www.npmjs.com/package/inquirer number: User input (filtered if filter is defined) (Number)
            filter: Number
        }

    ]).then(function (res) {
        // console.log(res.id_name);
        item_to_buy = res.id_name;
        // console.log(res.quant_name);
        quant_to_buy = res.quant_name;
        // query_quant_w_id(item_to_buy)
        // var query = "select stock_quantity from bamazon.products where item_id = "+item_to_buy;


        query_quant_w_id(item_to_buy, quant_to_buy)


    });
}



function query_quant_w_id(id, quant) {
    var db_q = 0
    var query = "select stock_quantity,price from bamazon.products where ?";
    connection.query(query, { item_id: id }, function (error, res) {
        // connection.query(query, function(error, res) {
        if (error) throw error;
        // console.log("res: ",parseFloat(res[0].stock_quantity))
        db_q = parseFloat(res[0].stock_quantity)
        new_stock_quant = db_q - quant;
        get_price = parseFloat(res[0].price)
        var total = get_price * quant;
        // console.log("total: ",total)
        // console.log("price: ",get_price)
        // console.log("new_stock_quant: ",new_stock_quant)
        if ((db_q - quant) > 0) {
            console.log('In stock')
            updateProduct(new_stock_quant, id, total)

        } else {
            console.log('Insufficient quantity!')
            connection.end();
        }

        // connection.end();

    });


}


function updateProduct(new_quant, id, total) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: new_quant
            },
            {
                item_id: id
            }
        ],
        function (err, res) {
            if (err) throw err;
            // console.log(res.affectedRows + " products updated!\n");
            // Call deleteProduct AFTER the UPDATE completes
            console.log("Your tatal is: $" + total);

            update_product_sales(id,total)
        });





}

function update_product_sales(id,total){
    var query = "select product_sales from products where ?";
    connection.query(query, { item_id: id }, function (error, res) {
        // connection.query(query, function(error, res) {
        if (error) throw error;
        
        if(res[0].product_sales == null){
            // console.log("res[0]: ",res[0].product_sales)
            updated_w_id(id, total)

        }else{
            // console.log("Not Null res[0]: ",res[0].product_sales)
            product_sales_w_id(id,total)
        }

        // connection.end();

    });
}


function updated_w_id(index_to_update, add_to_inv) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                product_sales: add_to_inv
            },
            {
                item_id: index_to_update
            }
        ],
        function (err, res) {
            if (err) throw err;
            // console.log(res.affectedRows + " product updated!\n");
            connection.end();

        });


}

function product_sales_w_id(id,total){
    var query = "select product_sales from products where ?";
    connection.query(query, { item_id: id }, function (error, res) {
        if (error) throw error;
        var before_total = res[0].product_sales;
        var new_total = total + before_total;
        // console.log("new_total: ",new_total)
        updated_w_id(id, new_total)
    });

}