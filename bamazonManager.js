#!/usr/bin/env node
/**
 * BAMazon is a command line application created with NodeJS and MySQL. There three separate
 * programs included in this project. Each program is designed for a different BAMazon user,
 * one for customers, one for managers, and one for supervisors. Data about the store's
 * inventory is stored in a local MySQL database which can be recreated by any user with the
 * provided sql files in this project.
 * 
 * @summary BAMazon manager interface used for performing various manager roles.
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
 * All properties and methods involving manager interactions are stored in this object.
 * 
 * @since 1.0.0
 */
var manager = {
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
     * A map for different user interactions gathered from user input.
     * @type {Object}
     */
    actionsMap: {
        'View Products for Sale': 'showProducts',
        'View Low Inventory': 'showLowInventory',
        'Add to Inventory': 'addToInventory',
        'Add New Product': 'addNewProduct',
        'Exit App': 'exitApp'
    },
    /**
     * Displays the main menu to the user and prompts for input.
     * 
     * @since 1.0.0
     */
    showMenu: function() {
        inquirer.prompt([
            {
                type: 'list',
                message: '\nBAMazon Management Protal\n\nPlease choose an action from the list below.',
                choices: [
                    'View Products for Sale',
                    'View Low Inventory',
                    'Add to Inventory',
                    'Add New Product',
                    'Exit App'
                ],
                name: 'action'
            }
        ]).then(function(answers) {
            manager[manager.actionsMap[answers.action]]();
        });
    },
    /**
     * Displays the products that are in the database to the console. Then shows the main menu.
     * 
     * @since 1.0.0
     * @fires manager.showMenu()
     */
    showProducts: function() {
        manager.connection.query("SELECT * FROM products", function(err, results) {
            if (err) throw err;
            for (var i = 0; i < results.length; i++) {
                console.log("\nProduct ID: " + results[i].item_id + "\nProduct Name: " + results[i].product_name + "\nPrice: " + results[i].price + "\nStock Quantity: " + results[i].stock_quantity);
            }
            manager.showMenu();
        });
    },
    /**
     * Displays all products that have an stock quantity lower than 5 to the console.
     * 
     * @since 1.0.0
     * @fires manager.showMenu()
     */
    showLowInventory: function() {
        manager.connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, results) {
            if (err) throw err;
            for (var i = 0; i < results.length; i++) {
                console.log("\nProduct ID: " + results[i].item_id + "\nProduct Name: " + results[i].product_name + "\nPrice: " + results[i].price + "\nStock Quantity: " + results[i].stock_quantity);
            }
            manager.showMenu();
        });
    },
    /**
     * Adds a new user generated product to the store.
     * 
     * @since 1.0.0
     * @fires manager.showMenu()
     */
    addToInventory: function() {
        manager.connection.query("SELECT * FROM products", function(err, results) {
            if (err) throw err;
            for (var i = 0; i < results.length; i++) {
                console.log("\nProduct ID: " + results[i].item_id + "\nProduct Name: " + results[i].product_name + "\nPrice: " + results[i].price + "\nStock Quantity: " + results[i].stock_quantity);
            }
        });
        inquirer.prompt([
            {
                type: 'input',
                message: '\n\nEnter the ID of the product you would like to add more of.',
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
                message: 'How many units would you like to add to the inventory?',
                validate: function(quantity) {
                    if (Number.isInteger(parseFloat(quantity))) {
                        if (parseFloat(quantity) > 0) return true;
                        else return "\nChoose a number greater than 0.";
                    }
                    else return "\nPlease enter a valid number greater than 0."
                },
                name: 'productQuantity'
            }
        ]).then(function(answers) {
            manager.connection.query("UPDATE products SET stock_quantity = stock_quantity + " + answers.productQuantity + " WHERE item_id = " + answers.productID, function(err, results) {
                if (err) throw err;
                console.log("\n" + answers.productQuantity + " units added to inventory.");
                manager.showMenu();
            });
        });
    },
    addNewProduct: function() {
        inquirer.prompt([
            {
                type: 'input',
                message: "\nPlease enter the name of the new product.",
                name: 'productName'
            },
            {
                type: 'input',
                message: "\nEnter the department this product belongs in.",
                name: 'productDepartment'
            },
            {
                type: 'input',
                message: "\nEnter the price for this product.",
                validate: function(price) {
                    if (Number.isNaN(parseFloat(price)) || parseFloat(price) <= 0) return "\nPlease enter a valid number greater than 0.";
                    else return true;
                },
                name: 'productPrice'
            },
            {
                type: 'input',
                message: "\nEnter the stock quantity for this product.",
                validate: function(quantity) {
                    if (Number.isInteger(parseFloat(quantity))) {
                        if (parseFloat(quantity) > 0) return true;
                        else return "\nChoose a number greater than 0.";
                    }
                    else return "\nPlease enter a valid number greater than 0."
                },
                name: 'productStock'
            }
        ]).then(function(answers) {
            manager.connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('" + answers.productName + "', '" + answers.productDepartment + "', " + answers.productPrice + ", " + answers.productStock + ")", function(err, results) {
                if (err) throw err;
                console.log("\nYou have added " + answers.productName + " to the store!");
                manager.showMenu();
            });
        });
    },
    /**
     * Ends database connection, thanks customer, and exits application.
     * 
     * @since 1.0.0
     */
    exitApp: function() {
        manager.connection.end(function(err) {
            if (err) throw err;
            console.log("\nThank you for using BAMazon!")
            process.exit();
        });
    }
};
// Create connection to MySQL database then show main menu.
manager.connection.connect(function(err) {
    if (err) throw err;
    manager.showMenu();
});