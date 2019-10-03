var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
  });

connection.connect(function(err) {
if (err) throw err;
console.log("connected as id " + connection.threadId);
manager();
});

function manager() {   
    inquirer
        .prompt([
            {
                type: "list",
                name: "manOptions",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }
        ]).then(answers => {
            if(answers.manOptions === "View Products for Sale") {
                console.log("Viewing Products for Sale".bgRed.black);
                connection.query("SELECT * FROM products", function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    manager();
                })
            }
            if(answers.manOptions === "View Low Inventory") {
                console.log("Viewing Items with Low Inventories".bgRed.black);
                connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    manager();
                })
            }
            if(answers.manOptions === "Add to Inventory") {
                connection.query("SELECT * FROM products", function (err, result) {
                    if (err) throw err;
                    console.log(" ")
                    console.table(result);
                });
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "addTo",
                            message: "Which item's inventory would you like to add to? (select id)"
                        },
                        {
                            type: "number",
                            name: "howMany",
                            message: "How many of this item are you adding? "
                        }
                    ]).then(answers => {
                        console.log(("Added " + answers.howMany + " to inventory for id " + answers.addTo).bgRed.black);
                        connection.query("UPDATE products SET stock_quantity = stock_quantity + " + answers.howMany + " WHERE id = " + answers.addTo, function (err, result) {
                            if (err) throw err;
                        connection.query("SELECT * FROM products", function (err, result) {
                            if (err) throw err;
                            console.log(" ")
                            console.table(result);
                            manager();
                        })
                        })
                    })
                }
            if(answers.manOptions === "Add New Product") {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "prodName",
                            message: "What is the product called? (Product name)"
                        },
                        {   type: "list",
                            name: "prodDept",
                            message: "Which department is this product in?",
                            choices: ['Outdoor Recreation', 'Grills & Outdoor Cooking' , 'Camera & Photo', 'Business Books' , 'Self Development Books', 'Computers & Technology', 'Other']
                        },
                        {
                            type: "number",
                            name: "prodPrice",
                            message: "What is the cost per item?"
                        },
                        {
                            type: "number",
                            name: "prodQuant",
                            message: "How many of this product are you adding to the inventory?"
                        }
                    ]).then(answers => {
                        console.log("INSERT INTO products (product_name, department_name, price, stock_quantity)VALUES (" + answers.prodName + ", " + answers.prodDept + ", " + answers.prodPrice + ", " + answers.prodQuant + ")");
                        console.log(("Catalog now includes " + answers.prodQuant + " " + answers.prodName + "'s in the " + answers.prodDept + " Department at " + answers.prodPrice + " per unit.").bgRed.black);
                        connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity)VALUES ("' + answers.prodName + '", "' + answers.prodDept + '", "' + answers.prodPrice + '", "' + answers.prodQuant + '")', function (err, result) {
                            if (err) throw err;
                        connection.query("SELECT * FROM products", function (err, result) {
                            if (err) throw err;
                            console.table(result);
                            manager();
                        })
                    })
                        
                    })
            }
        })

    }
