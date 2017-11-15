#!/usr/bin/env node
/**
 * BAMazon is a command line application created with NodeJS and MySQL. There three separate
 * programs included in this project. Each program is designed for a different BAMazon user,
 * one for customers, one for managers, and one for supervisors. Data about the store's
 * inventory is stored in a local MySQL database which can be recreated by any user with the
 * provided sql files in this project.
 * 
 * @summary BAMazon supervisor interface used for checking department status and creating new departments.
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
require('console.table');
const inquirer = require('inquirer');
const MYSQL = require('mysql');
/**
 * All properties and methods involving supervisor interactions are stored in this object.
 * 
 * @since 1.0.0
 */
var supervisor = {
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
        'View Product Sales by Department': 'showDepartmentSales',
        'Create New Department': 'createNewDepartment',
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
                message: "\nBAMazon Supervisor Portal\n\nPlease choose an action from the list below.",
                choices: [
                    'View Product Sales by Department',
                    'Create New Department',
                    'Exit App'
                ],
                name: 'action'
            }
        ]).then(function(answers) {
            supervisor[supervisor.actionsMap[answers.action]]();
        });
    },
    showDepartmentSales: function() {
        console.log("Showing Department Sales.");
        supervisor.connection.query('SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) AS product_sales, (SUM(product_sales) - over_head_costs) AS total_profit FROM products INNER JOIN departments ON products.department_name = departments.department_name GROUP BY departments.department_name;', function(err, results) {
            if (err) throw err;
            var myTable = [];
            for (var i = 0; i < results.length; i++) {
                myTable.push(
                    {
                        department_id: results[i].department_id,
                        department_name: results[i].department_name,
                        over_head_costs: results[i].over_head_costs,
                        product_sales: results[i].product_sales,
                        total_profit: results[i].total_profit
                    }
                );
            }
            console.table(myTable);
            supervisor.showMenu();
        });
    },
    createNewDepartment: function() {
        console.log("Creating New Department"); 
    },
    /**
     * Ends database connection, thanks customer, and exits application.
     * 
     * @since 1.0.0
     */
    exitApp: function() {
        supervisor.connection.end(function(err) {
            if (err) throw err;
            console.log("\nThank you for using BAMazon!")
            process.exit();
        })
    }
}

supervisor.connection.connect(function(err) {
    if (err) throw err;
    supervisor.showMenu();
});