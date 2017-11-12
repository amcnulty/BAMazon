require('dotenv').config();
const inquirer = require('inquirer');
const MYSQL = require('mysql');

var orders = {
    products: [],
    connection: MYSQL.createConnection({
        host: "localhost",
        port: "3306",
        user: "root",
        password: process.env.DB_PASS,
        database: "bamazon"
    }),
    loadData: function() {
        orders.connection.query("SELECT item_id, product_name, price FROM products", function(err, results) {
            if (err) throw err;
            orders.products = results;
            orders.promptUser();
        });
    },
    displayProducts: function() {
        for (var i = 0; i < orders.products.length; i++) {
            console.log("\nProduct ID: " + orders.products[i].item_id + "\nProduct Name: " + orders.products[i].product_name + "\nPrice: " + orders.products[i].price);
        }
    },
    promptUser: function() {
        orders.displayProducts();
        inquirer.prompt([
            {
                type: 'input',
                message: '\nPlease enter the ID of the product you wish to buy.',
                validate: function(id) {
                    if (Number.isInteger(parseFloat(id))) {
                        if (parseFloat(id) > 0 && parseFloat(id) < 11) return true;
                        else return "\nChoose a number between 0 - 10.";
                    }
                    else return "\nThat is not a valid number! Please choose a number between 0 - 10.";
                },
                name: 'productID'
            },
            {
                type: 'input',
                message: 'How many would you like to buy?',
                validate: function(id) {
                    if (Number.isInteger(parseFloat(id))) {
                        if (parseFloat(id) > 0) return true;
                        else return "\nChoose a number greater than 0.";
                    }
                    else return "\nThat is not a valid quantity! Please choose a number greater than 0.";
                },
                name: 'productQuantity'
            }
        ]).then(function(answers) {
            orders.handleOrder(answers);
        });
    },
    handleOrder: function(answers) {
        orders.connection.query("SELECT * FROM products WHERE ?", { item_id: answers.productID }, function(err, results) {
            if (err) throw err;
            if (results[0].stock_quantity >= answers.productQuantity) orders.processTransaction(answers.productID, (results[0].stock_quantity - answers.productQuantity), results[0].price * answers.productQuantity);
            else orders.declineTransaction();
        });
    },
    processTransaction: function(itemID, stock, cost) {
        orders.connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: stock
            },
            {
                item_id: itemID
            }
        ], function(err, results) {
            if (err) throw err;
        });
        console.log("\nThe cost of your order is: $" + cost);
        orders.askForNewOrder();
    },
    declineTransaction: function() {
        console.log("\nInsufficient quantity!");
        orders.askForNewOrder();
    },
    askForNewOrder: function() {
        inquirer.prompt([
            {
                type: "confirm",
                message: "Would you like to place another order?",
                name: "newOrder"
            }
        ]).then(function(answers) {
            if (answers.newOrder) orders.promptUser();
            else orders.exitApp();
        });
    },
    exitApp: function() {
        orders.connection.end(function(err) {
            if (err) throw err;
            console.log("\nThank you for using BAMazon!")
            process.exit();    
        });
    }
}
// Create connection to MySQL database then load data.
orders.connection.connect(function(err) {
    if (err) throw err;
    orders.loadData();
});