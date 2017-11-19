# BAMazon #
BAMazon is a command line application created with NodeJS and MySQL. There three separate programs included in this project. Each program is designed for a different BAMazon user, one for customers, one for managers, and one for supervisors. Data about the store's inventory is stored in a local MySQL database which can be recreated by any user with the provided sql files in this project.

## Demo Video ##
Watch this video demo of how to use this application.

![Demo Video](https://raw.githubusercontent.com/amcnulty/BAMazon/master/readme/BAMazon_Demo.gif "Demo Video")

# Getting Started #
The following is a getting started guide for running BAMazon on your local machine.

### Prerequisites ###
1. NodeJS - NodeJS is required for running the javascript for this application.
2. MySQL - Required for the local database instance.

### Get The Code ###
Download the zip file from this repo or fork this repo to get the code on your computer.

### Install Dependencies ###
Once the code is installed on your computer navigate to root of the project in a bash/terminal/command prompt of your choice. Run the following node command to install the required dependencies.
```
$ npm install
```

### Create Database ###
A local database is required for storing product and department information for BAMazon. Here are the steps for setting up a basic database to get going.

1. Start MySQL server on your computer.
2. Execute the queries found in the bamazon.sql file to create the bamazon database and products table.
3. Execute the queries found in the departments.sql file to create the departments table.

### Set Up Environment Variables ###
In the root of the project create a .env file. Use the example.env file included in the project as an example for how to set up the local .env file. Enter the database credentials for the host, port, user, and password values.

### Run BAMazon ###
To run BAMazon execute the following command in the bash/terminal/command prompt of your choice in the root of the project directory.

* For BAMazon customer program run

```
$ node bamazonCustomer.js
```

* For BAMazon manager program run

```
$ node bamazonManager.js
```

* For BAMazon supervisor program run

```
$ node bamazonSupervisor.js
```

## Built With ##
BAMazon was built with the following technologies.

* NodeJS
* NPM
* MySQL
* mysql npm module
* Inquirer npm module
* Dot-env npm module
* console.table npm module

## Author
#### Aaron Michael McNulty
* [Github Link](https://github.com/amcnulty "amcnulty (Aaron Michael McNulty)")
* [Personal Website](http://www.aaronmichael.tk "Aaron Michael McNulty")

## Links
* [NodeJS Website](https://nodejs.org/en/ "Node.js")
* [MySQL Module](https://www.npmjs.com/package/mysql/ "mysql")
* [Inquirer Module](https://www.npmjs.com/package/inquirer/ "inquirer")
* [Dot-env Module](https://www.npmjs.com/package/dot-env "Dot-env")
* [console.table Module](https://www.npmjs.com/package/console.table/ "console.table")
* [Demo Video](https://gfycat.com/gifs/detail/LightResponsibleAmmonite "Demo Video")