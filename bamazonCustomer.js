var mysql = require("mysql");
var inquirer = require("inquirer");
// var table = require ("cli-table3");
const table = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"

});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection() { //productTable
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        // connection.end()
        purchasePrompt();
    });
}
    //_________Class Notes____________
    function purchasePrompt() {

        inquirer.prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the item you would like to purchase? [QUIT with Q]",
                // filter:Number
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like? [QUIT with Q]",
                // filter:Number
            },

        ])
        .then(product => {
            if (product.id === "Q" || product.quantity === "Q") {
                console.log("thank you")
                 connection.end()
                 console.clear

            } else 
            {
                connection.query("SELECT * FROM products WHERE id = " + product.id, function (err, res) {
                    if (err) throw err;
                    //var totalCost = 0;
                    var totalCost = res[0].price * product.quantity;
                    console.log(" ");
                    console.log(" ");
                    console.log(" ");
                    console.log("current stock: " + res[0].stock_quantity);
                    console.log("user requested stock: " + product.quantity);
                    var newQty = res[0].stock_quantity - product.quantity;
                    console.log("newQty: " + newQty);
                    console.log(" ");
                    console.log(" ");
                    console.log(" ");
                    if (res[0].stock_quantity <= 0 || res[0].stock_quantity < product.quantity) {
                        console.log("! Cannot approve transaction: item is sold out, or you entered an " +  "incorrect value.");
       
                    } else {
                            connection.query("UPDATE products SET stock_quantity =  "  + newQty + " WHERE id = " + product.id,function (err, res) {
                                if (err) throw err;
                            });

                        purchasedItem(res[0], product) 

                        // console.clear();
                        // console.log("thank you");
    
                    }
                 });
                }
                });
            }

            function purchasedItem(product_db, user_input){
                console.log("Thank you  for your purchase of" +  product_db.quantity + product_db.name);
                console.log("The price of the item is: $" + product_db.price);
                console.log('\n---------------------------------------\n')

            }
            
            console.log(`Would you like to make another purchase?`);

            resume (){
                if 
            }

                

                purchasePrompt()
           
        



            // .then(function(answers){
            //     var quantityNeeded = answers.Quantity;
            //     var IDrequested = answers.ID;
            //     purchaseOrder(IDrequested, quantityNeeded);
            // });

    // for (var i = 0; i <= res.length; i++) {
    //     table.push ([res[i].id, res[i].product_name, res[i].price]);
    // }
    // console.table(());
    // console.log(``);






//The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.//




// if (parseFloat(answer.bidPrice) > parseFloat(dbPrice)) {
//     //update database
//     connection.query(
//         'UPDATE products SET ? WHERE ?",
//         [
//             {
//                 newBidPrice: answer.bidPrice,
//             },
//             {
//                 name: inquirer.name,
//             },
//         ],
//         function(err, res) {
//             if (err) throw err;
//             console.log(`Bid is placed successfully!`);
//             initialize();
//         }
//     );
// } else {
//     console.log(`Sorry, bid price is too low.Try again`.)