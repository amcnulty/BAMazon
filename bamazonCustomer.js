require('dotenv').config();
const inquirer = require('inquirer');
const MYSQL = require('mysql');

var connection = MYSQL.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: process.env.DB_PASS,
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    loadData();
});

function loadData() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, results) {
        for (var i = 0; i < results.length; i++) {
            console.log("\nProduct ID: " + results[i].item_id + "\nProduct Name: " + results[i].product_name + "\nPrice: " + results[i].price);
        }
        promptUser();
    });
}

function promptUser() {
    inquirer.prompt([
        {
            type: 'input',
            message: '\nPlease enter the ID of the product you wish to buy.',
            name: 'productID'
        },
        {
            type: 'input',
            message: 'How many would you like to buy?',
            name: 'productQuantity'
        }
    ]).then(function(answers) {

    });
}