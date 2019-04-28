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


function start_super(){
    inquirer.prompt([
        {
            type: "list",
            message: "Supervisor options list.",
            choices: ["View Product Sales by Department",
                "Create New Department",
            "Quit"],

            name: "select"
        }

    ]).then(function (res) {
        
        if(res.select == "View Product Sales by Department"){
            console.log(res.select)
            get_summary_table()
        }else if(res.select == "Create New Department"){
            console.log(res.select)
            new_dep()
        }else if(res.select == "Quit"){
            console.log("Quit selected - Goodbye");
            connection.end();
        }


    });

}
start_super()

function get_summary_table(){

    //what if multiple products are in the same depatment?
    var query = `
    select d.department_id, d.department_name,
d.over_head_costs, p.product_sales, 
(p.product_sales - d.over_head_costs ) as total_profit
from departments d join
 (select department_name,sum(product_sales) as product_sales 
from products 
group by department_name) p
on d.department_name = p.department_name
`
    connection.query(query, function (error, result) {
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
                var handle_null_issue = if_null_return_zero(table[i][j])
                if (x < handle_null_issue.toString().length) {
                    x = handle_null_issue.toString().length;
                }
            }
            x += 2;
            col_max_len.push(x)
        }

        var displayTable = new Table({
            head: table[0],

            // colWidths: [8, 30, 20,12, 12]
            colWidths: col_max_len
        });
        for (var i = 0; i < result.length; i++) {
               
            displayTable.push(
               
                [result[i].department_id, result[i].department_name, result[i].over_head_costs, if_null_return_zero(result[i].product_sales), if_null_return_zero(result[i].total_profit)]
            );
        }
        console.log(displayTable.toString());
        start_super()
        // connection.end();
    });

}

function if_null_return_zero(if_null){
    if(if_null == null){
        return 0;
    }else{
        return if_null;
    }
}

function new_dep(){

    inquirer.prompt([
        {
            type: "input",
            message: "Enter the new department name",
            name: "dep_name",
            //https://www.npmjs.com/package/inquirer number: User input (filtered if filter is defined) (Number)

        },{
            type: "input",
            message: "Enter the new department over head cost",
            name: "overhead_name",
            //https://www.npmjs.com/package/inquirer number: User input (filtered if filter is defined) (Number)
            filter: Number
        }

    ]).then(function (res) {
        console.log(res.num_name)
        var dep_name = res.dep_name
        var over_cost = res.overhead_name
        const add = function (res) {
        connection.query(
            "INSERT INTO departments SET ?",
            [{
                department_name: res.dep_name,
                over_head_costs: res.overhead_name
            }], function (err, res ) {
                if (err) throw err;
                // console.log(res)
                console.log("\nSuccess: \n"+ dep_name +" has been added to the database.")
                start_super()
            });
        }
        add(res)        


    });
}