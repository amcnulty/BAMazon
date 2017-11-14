#!/usr/bin/env node
/**
 * BAMazon is a command line application created with NodeJS and MySQL. There three separate
 * programs included in this project. Each program is designed for a different BAMazon user,
 * one for customers, one for managers, and one for supervisors. Data about the store's
 * inventory is stored in a local MySQL database which can be recreated by any user with the
 * provided sql files in this project.
 * 
 * @summary BAMazon customer interface used for making purchases from products in the local database.
 * @since 1.0.0
 * @version 1.0.0
 * 
 * Inquirer npm module
 * @link https://www.npmjs.com/package/inquirer
 * MySQL npm module
 * @link https://www.npmjs.com/package/mysql
 * 
 * @author Aaron Michael McNulty
 */
// Include depended files and libraries.
require('dotenv').config();
const inquirer = require('inquirer');
const MYSQL = require('mysql');
/**
 * All properties and methods involving customer orders are store in this object.
 * 
 * @since 1.0.0
 */
var orders = {
    /**
     * Local array to hold products that are in the database.
     * @type {Object[]}
     */
    products: [],
    /**
     * A handle for the connection to the MySQL database.
     */
    connection: MYSQL.createConnection({
        host: "localhost",
        port: "3306",
        user: "root",
        password: process.env.DB_PASS,
        database: "bamazon"
    }),
    /**
     * Loads all products from database into the orders.products array.
     * 
     * @since 1.0.0
     * @fires orders.promptUser();
     */
    loadData: function() {
        orders.connection.query("SELECT item_id, product_name, price FROM products", function(err, results) {
            if (err) throw err;
            orders.products = results;
            orders.promptUser();
        });
    },
    /**
     * Displays all of the products in the orders.products array to the console.
     * 
     * @since 1.0.0
     */
    displayProducts: function() {
        for (var i = 0; i < orders.products.length; i++) {
            console.log("\nProduct ID: " + orders.products[i].item_id + "\nProduct Name: " + orders.products[i].product_name + "\nPrice: " + orders.products[i].price);
        }
    },
    /**
     * Gathers user input to determine what product the customer would like to purchase.
     * 
     * @since 1.0.0
     * @fires orders.handleOrder()
     */
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
    /**
     * Determines if there is enough inventory to process the requested order. If there is not enough
     * inventory for the selected product, the order is declined.
     * 
     * @since 1.0.0
     * @param {Object} answers - The responses gathered from the user about the requested transaction.
     * @fires orders.processTransaction()
     * @fires orders.declineTransaction()
     */
    handleOrder: function(answers) {
        orders.connection.query("SELECT * FROM products WHERE ?", { item_id: answers.productID }, function(err, results) {
            if (err) throw err;
            if (results[0].stock_quantity >= answers.productQuantity) orders.processTransaction(answers.productID, (results[0].stock_quantity - answers.productQuantity), results[0].price * answers.productQuantity);
            else orders.declineTransaction();
        });
    },
    /**
     * Updates the database with the new stock. Also alerts customer how much their order cost them.
     * 
     * @since 1.0.0
     * @param {Number} itemID - The id of the item to update.
     * @param {Number} stock - The new stock quantity of the item to be saved to the database.
     * @param {Number} cost - The total cost of the items purchased.
     * @fires orders.askForNewOrder()
     */
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
    /**
     * Declines the transaction by alerting the user of a stock shortage. The customer then is asked
     * if they would like to place a new order.
     * 
     * @since 1.0.0
     * @fires orders.askForNewOrder()
     */
    declineTransaction: function() {
        console.log("\nInsufficient quantity!");
        orders.askForNewOrder();
    },
    /**
     * Asks the customer if they would like to place a new order. Ends the application if they decline.
     * 
     * @since 1.0.0
     * @fires orders.exitApp()
     */
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
    /**
     * Ends database connection, thanks customer, and exits application.
     * 
     * @since 1.0.0
     */
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